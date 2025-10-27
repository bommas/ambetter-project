import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'

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
      index: 'health-plans',
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

async function getIndexStats() {
  try {
    const stats = await client.indices.stats({ index: 'health-plans' })
    const health = await client.cluster.health({ index: 'health-plans' })
    
    return {
      totalDocs: stats.indices?.['health-plans']?.total?.docs?.count || 0,
      size: stats.indices?.['health-plans']?.total?.store?.size_in_bytes || 0,
      health: (health as any).health || 'unknown',
      status: (health as any).status || 'unknown'
    }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Generate response using Elasticsearch context
async function generateResponse(userMessage: string, conversationHistory: Message[]): Promise<string> {
  const context = await analyzeSearchQueries()
  const stats = await getIndexStats()
  
  const systemContext = `You are a Search Relevancy Assistant for an Ambetter Health Plans search application.

Current Index Statistics:
- Total Documents: ${stats.totalDocs || 'Unknown'}
- Index Health: ${stats.health || 'Unknown'}
- Index Size: ${stats.size ? `${(stats.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}

Your role is to help administrators understand and improve search relevancy.

IMPORTANT: Use the provided index statistics and conversation history to answer questions. Be specific and actionable.`

  // Simulate a response based on the user's query
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('no results') || lowerMessage.includes('zero results')) {
    return `Based on current index stats:
- Total documents indexed: ${stats.totalDocs}
- Index health: ${stats.health || 'green'}
- Index status: ${stats.status || 'active'}

To find queries with no results, you can:
1. Check search logs for queries returning zero hits
2. Use Elasticsearch Search Profiler to identify problematic queries
3. Review aggregations to see if facet counts are zero
4. Add synonyms or adjust field boosts for common queries

Would you like me to help identify specific problematic query patterns?`
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
- Documents: ${stats.totalDocs}
- Health: ${stats.health}
- Status: ${stats.status}

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

