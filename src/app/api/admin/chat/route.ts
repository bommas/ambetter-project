import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'

// MCP Server Configuration
const MCP_SERVER_URL = 'https://centene-serverless-demo-a038f2.kb.us-east-1.aws.elastic.cloud/api/agent_builder/mcp'
const ELASTIC_ENDPOINT = process.env.ELASTIC_ENDPOINT || ''
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY || ''

// Cache for storing responses to repeated questions
const cache = new Map<string, { reply: string, timestamp: Date }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Elasticsearch helper functions for the chat assistant
async function analyzeSearchQueries() {
  try {
    // Get a sample of recent documents for analysis
      const response = await client.search({
        index: 'health-plans*',
        size: 10,
      body: {
        query: { match_all: {} },
        aggs: {
          states: { terms: { field: 'state.keyword', size: 50 } },
          plan_types: { terms: { field: 'plan_type.keyword', size: 20 } },
          document_types: { terms: { field: 'metadata.plan_info.document_type.keyword', size: 20 } }
        }
      }
    })

    return {
      totalDocs: response.hits.total,
      aggregations: response.aggregations,
      sampleResults: response.hits.hits.map(hit => ({
        id: hit._id,
        plan_name: (hit._source as any).plan_name,
        state: (hit._source as any).state,
        plan_type: (hit._source as any).plan_type
      }))
    }
  } catch (error: any) {
    return { error: error.message }
  }
}

async function testQueriesForNoResults() {
  // Test some common queries that might return no results
  const testQueries = [
    'nonexistentplan123',
    'invalidstate999',
    'zzzzzzz',
    'test123456'
  ]
  
  const results: Array<{ query: string, hits: number }> = []
  
  for (const query of testQueries) {
    try {
      const response = await client.search({
        index: 'health-plans*',
        size: 0,
        body: {
          query: {
            multi_match: {
              query,
              fields: ['title^2', 'plan_name^2', 'extracted_text^5'],
              type: 'best_fields',
              fuzziness: 'AUTO'
            }
          }
        }
      })
      
      const hitCount = typeof response.hits.total === 'number' 
        ? response.hits.total 
        : (response.hits.total?.value || 0)
      results.push({
        query,
        hits: hitCount
      })
    } catch (error) {
      // Skip errors
    }
  }
  
  return results
}

async function getIndexStats() {
  try {
    console.log('🔍 getIndexStats: Starting...')
    // Get document count from the alias
    const countResponse = await client.count({ index: 'health-plans' })
    console.log('📊 countResponse:', JSON.stringify(countResponse, null, 2))
    const totalDocs = typeof countResponse.count === 'number' ? countResponse.count : countResponse.count.value
    console.log('📈 totalDocs extracted:', totalDocs)
    
    // Skip cluster.health() as it's not available in Elasticsearch Serverless
    // Just return document count
    const stats = {
      totalDocs: totalDocs || 0,
      size: 0, // Size not critical for this use case
      health: 'healthy', // Assume healthy if we can query
      status: 'active' // Assume active if we can query
    }
    console.log('✅ Returning stats:', stats)
    return stats
  } catch (error: any) {
    console.error('❌ getIndexStats error:', error.message, error.stack)
    return { 
      totalDocs: 0, 
      size: 0,
      health: 'unknown', 
      status: 'unknown',
      error: error.message 
    }
  }
}

// MCP Agent Builder integration
async function callMCPAgent(agentName: string, query: string, context?: any) {
  try {
    // Generate unique request ID
    const requestId = Math.random().toString(36).substring(7)
    
    // MCP servers require Accept header for JSON and JSON-RPC 2.0 format
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `ApiKey ${ELASTIC_API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: requestId,
        method: 'tools/call',
        params: {
          name: agentName,
          arguments: {
            user_message: query,
            context: context || {}
          }
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`MCP Server returned ${response.status}: ${errorText}`)
      return null
    }

    const data = await response.json()
    return data.result?.content?.[0]?.text || data.response || data
  } catch (error: any) {
    console.error('MCP Agent call error:', error)
    return null
  }
}

async function getMCPTools() {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/tools`, {
      method: 'GET',
      headers: {
        'Authorization': `ApiKey ${ELASTIC_API_KEY}`
      }
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.tools || []
  } catch (error: any) {
    console.error('MCP Tools fetch error:', error)
    return []
  }
}

// Generate response using Elastic Agent Builder via MCP
async function generateResponse(userMessage: string, conversationHistory: Message[]): Promise<string> {
  const context = await analyzeSearchQueries()
  const stats = await getIndexStats()
  
  // Try to use Elastic Agent Builder MCP first
  const lowerMessage = userMessage.toLowerCase()
  
  // Determine which agent to use based on query
  let agentName = 'Elastic AI Agent' // Default
  if (lowerMessage.includes('relevancy') || lowerMessage.includes('relevance') || 
      lowerMessage.includes('boost') || lowerMessage.includes('tuning') ||
      lowerMessage.includes('query analysis') || lowerMessage.includes('search optimization')) {
    agentName = 'Relevancy Agent'
  }
  
  // Call MCP Agent Builder
  const mcpResponse = await callMCPAgent(agentName, userMessage, {
    indexStats: stats,
    aggregations: context.aggregations,
    sampleResults: (context as any).sampleResults
  })
  
  // If MCP agent returns a response, use it
  if (mcpResponse && typeof mcpResponse === 'string') {
    return mcpResponse
  }
  
  const systemContext = `You are a Search Relevancy Assistant for an Ambetter Health Plans search application.

Current Index Statistics:
- Total Documents: ${stats.totalDocs || 'Unknown'}
- Index Health: ${stats.health || 'Unknown'}
- Index Size: ${stats.size ? `${(stats.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}

Your role is to help administrators understand and improve search relevancy.

IMPORTANT: Use the provided index statistics and conversation history to answer questions. Be specific and actionable.`

  // Simulate a response based on the user's query
  
  if (lowerMessage.includes('no results') || lowerMessage.includes('zero results') || lowerMessage.includes('queries with no results')) {
    const testResults = await testQueriesForNoResults()
    const noResultQueries = testResults.filter(r => r.hits === 0)
    
    return `Based on current index stats:
- Total documents indexed: ${stats.totalDocs}
- Index health: ${stats.health || 'green'}
- Index status: ${stats.status || 'active'}

I tested some sample queries and found ${noResultQueries.length} queries with zero results:
${noResultQueries.length > 0 ? noResultQueries.map(r => `- "${r.query}" (0 hits)`).join('\n') : '- None detected in sample test queries'}

To find actual queries with no results in production:
1. **Check search logs** - Look for queries returning 0 hits
2. **Use Elasticsearch Search Profiler** - Identify problematic queries
3. **Monitor aggregations** - Check if facet counts are zero
4. **Add synonyms** - For common misspellings (e.g., "healthcare" → "health care")
5. **Adjust field boosts** - Increase weights for more important fields

To fix no-result queries:
- Add synonyms for common terms
- Enable more aggressive fuzziness
- Broaden field coverage in multi_match
- Consider using query_string with wildcards for partial matches

Current test queries returning results: ${testResults.filter(r => r.hits > 0).length}/${testResults.length}`
  }
  
  if (lowerMessage.includes('relevancy') || lowerMessage.includes('relevance')) {
    return `Here are relevancy tuning techniques for your ${stats.totalDocs} document index:

1. **Field Boosting**: Adjust weights for:
   - plan_name^3 (highest priority)
   - title^2
   - extracted_text^5
   - Consider boosting state^3 and county^2

2. **Synonym Management**: Add common misspellings:
   - texas → TX
   - healthcare → health care
   - center → centre

3. **Fuzziness**: Current setting AUTO (recommended for typo tolerance)

4. **Semantic Search**: ELSER model enabled for intent understanding

5. **Curations**: Pin important documents for specific high-value queries

6. **Red flag**: If index health is ${stats.health}, consider reindexing.`
  }
  
  if (lowerMessage.includes('boost') || lowerMessage.includes('weighting')) {
    return `Field Boosting Recommendations:
- plan_name: Boost 3-5x (primary identifier)
- state: Boost 3x (filter/sort importance)
- county: Boost 2x (refinement)
- extracted_text: Boost 5x (main content)
- pdf_extracted: Boost 3x (PDF content)
- title: Boost 2x (document title)

Current best practice: Use multi_match with field boosts rather than single-field queries.`
  }
  
  if (lowerMessage.includes('performance') || lowerMessage.includes('speed')) {
    return `Performance Insights:
- Total documents: ${stats.totalDocs}
- Index size: ${stats.size ? `${(stats.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}

Optimization tips:
1. Use filters (not queries) for facet-based filters
2. Implement result caching for popular queries
3. Consider sharding if index > 50GB
4. Monitor slow queries using Elasticsearch slow log
5. Enable fielddata for frequently aggregated fields

Index status: ${stats.status || 'active'}`
  }
  
  // Default response
  return `I can help you with search relevancy tuning for your Ambetter health plans application.

Current index status:
- Documents: ${stats.totalDocs || 'Unknown'}
- Health: ${stats.health || 'Unknown'}
- Status: ${stats.status || 'Unknown'}

What would you like to know about improving search relevance?`
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== '1') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, sessionId, conversationHistory } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check cache first
    const cacheKey = message.toLowerCase().trim()
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp.getTime() < CACHE_TTL) {
      console.log(`Cache hit for: ${cacheKey.substring(0, 50)}...`)
      return NextResponse.json({ reply: cached.reply })
    }

    // Generate response using Elasticsearch context
    const reply = await generateResponse(message, conversationHistory || [])

    // Store in cache
    cache.set(cacheKey, {
      reply,
      timestamp: new Date()
    })

    // Clean old cache entries (keep cache size manageable)
    if (cache.size > 100) {
      const entries = Array.from(cache.entries())
      entries.sort((a, b) => b[1].timestamp.getTime() - a[1].timestamp.getTime())
      cache.clear()
      entries.slice(0, 50).forEach(([key, value]) => cache.set(key, value))
    }

    return NextResponse.json({ reply })

  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

