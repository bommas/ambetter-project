import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'

// Elastic Agent Builder Configuration
const ELASTIC_ENDPOINT = process.env.ELASTIC_ENDPOINT || ''
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY || ''
const RELEVANCY_AGENT_ID = '1' // Your custom Relevancy Agent

// Construct agent chat endpoint URL
function getAgentChatUrl(agentId: string): string {
  // Convert from elasticsearch endpoint to kibana endpoint for API
  const endpoint = ELASTIC_ENDPOINT.replace('.es.', '.kb.')
  return `${endpoint}/api/agent_builder/agents/${agentId}/chat`
}

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
    const totalDocs = (countResponse as any).count
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

// Summarize with OpenAI
async function summarizeWithOpenAI(rawText: string): Promise<string | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return null
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that explains Elasticsearch query results in natural, conversational language. Summarize the technical results into easy-to-understand insights.'
          },
          {
            role: 'user',
            content: `Explain these query results in natural language:\n\n${rawText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || null
  } catch (error) {
    console.error('OpenAI summarization error:', error)
    return null
  }
}

// Call the Elastic Agent Builder agent directly
async function callRelevancyAgent(message: string, conversationHistory: Message[] = []): Promise<string | null> {
  try {
    const agentUrl = getAgentChatUrl(RELEVANCY_AGENT_ID)
    
    // Build messages array with conversation history
    const messages = [
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]
    
    console.log('📤 Calling Relevancy Agent at:', agentUrl)
    console.log('📝 Message:', message)
    
    const response = await fetch(agentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${ELASTIC_API_KEY}`
      },
      body: JSON.stringify({ messages })
    })
    
    console.log('📥 Agent Response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Agent returned ${response.status}: ${errorText}`)
      return null
    }
    
    const data = await response.json()
    console.log('✅ Agent Response:', JSON.stringify(data, null, 2))
    
    // Extract the agent's message from the response
    if (data.message) {
      return data.message
    }
    
    // Fallback if response format is different
    if (typeof data === 'string') {
      return data
    }
    
    return null
  } catch (error: any) {
    console.error('❌ Agent call error:', error)
    return null
  }
}

// Legacy MCP function - kept for reference
async function callMCPAgent(agentId: string, message: string) {
  try {
    // Generate unique request ID
    const requestId = Math.random().toString(36).substring(7)
    
    const requestBody = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'chat',
      params: {
        agent_id: agentId,
        message: message
      }
    }
    
    console.log('📤 MCP Agent Request:', JSON.stringify(requestBody, null, 2))
    console.log('🔗 MCP Server URL:', MCP_SERVER_URL)
    console.log('🤖 Agent ID:', agentId)
    
    // MCP servers require Accept header for JSON and JSON-RPC 2.0 format
    const response = await fetch(MCP_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `ApiKey ${ELASTIC_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📥 MCP Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ MCP Server returned ${response.status}: ${errorText}`)
      return null
    }

    const data = await response.json()
    console.log('✅ MCP Response data:', JSON.stringify(data, null, 2))
    
    // Handle agent response - it should be a chat message
    if (data.result && data.result.message) {
      return data.result.message
    }
    
    // Fallback for other formats
    if (data.result) {
      // Handle results array with different types (query, tabular_data, resource)
      if (Array.isArray(data.result.results)) {
        let responseText = ''
        
        data.result.results.forEach((r: any, index: number) => {
          // Handle tabular data from ES|QL
          if (r.type === 'tabular_data' && r.data) {
            const columns = r.data.columns?.map((c: any) => c.name).join(', ') || ''
            const rows = r.data.values?.slice(0, 5).map((row: any[]) => row.join(' | ')) || []
            
            if (columns && rows.length > 0) {
              responseText += `**Query Results:**\nColumns: ${columns}\n`
              responseText += rows.join('\n') + '\n\n'
            } else if (columns && rows.length === 0) {
              responseText += `**Query Results:**\nColumns: ${columns}\nNo results found.\n\n`
            } else if (r.data.query) {
              responseText += `**Query Executed:** ${r.data.query}\nNo matching data found.\n\n`
            }
          }
          
          // Handle search results with highlights
          if (r.data?.content?.highlights) {
            const cleanHighlights = r.data.content.highlights
              .slice(0, 3)
              .map((h: string) => h.replace(/<em>|<\/em>/g, ''))
              .join(' | ')
            responseText += `**Result ${index + 1}:** ${cleanHighlights}\n\n`
          }
          
          // Handle query info
          if (r.type === 'query' && r.data?.esql) {
            responseText += `**ES|QL Query:** ${r.data.esql}\n`
          }
        })
        
        if (responseText.trim()) {
          // Get the actual result data for better context
          let actualResults = ''
          data.result.results.forEach((r: any) => {
            if (r.type === 'tabular_data' && r.data?.values && r.data.values.length > 0) {
              const columns = r.data.columns?.map((c: any) => c.name).join(', ') || ''
              const values = r.data.values[0].join(', ')
              actualResults += `Columns: ${columns}\nValues: ${values}\n`
            }
          })
          
          // Create context for OpenAI - include resource results too
          const resourceResults = data.result.results
            .filter((r: any) => r.type === 'resource')
            .map((r: any, idx: number) => {
              if (r.data?.content?.highlights) {
                const cleanH = r.data.content.highlights
                  .slice(0, 2)
                  .map((h: string) => h.replace(/<em>|<\/em>/g, ''))
                  .join('; ')
                return `Doc ${idx + 1}: ${cleanH}`
              }
              return null
            })
            .filter(Boolean)
            .join('\n')
          
          const fullContext = `${responseText}\n\nActual Results:\n${actualResults}\n\nDocuments Found:\n${resourceResults}`
          
          console.log('🔍 Attempting OpenAI summarization for:', fullContext.substring(0, 300))
          
          // Summarize using OpenAI to make it natural language
          const naturalSummary = await summarizeWithOpenAI(fullContext.trim())
          if (naturalSummary) {
            console.log('✅ OpenAI summarization succeeded')
            return naturalSummary
          }
          
          console.log('⚠️ OpenAI summarization failed, using fallback')
          
          // Format as human-readable summary even without OpenAI
          if (resourceResults) {
            return `Found ${data.result.results.filter((r: any) => r.type === 'resource').length} relevant documents in your search results:\n\n${resourceResults}\n\nThese documents contain information related to your query.`
          }
          
          // Check if there are ES|QL queries with no results
          const hasQueries = data.result.results.some((r: any) => r.type === 'query' && r.data?.esql)
          const hasNoResults = data.result.results.some((r: any) => r.type === 'tabular_data' && (!r.data?.values || r.data.values.length === 0))
          
          if (hasQueries && hasNoResults) {
            // Try to interpret the query
            const queryResult = data.result.results.find((r: any) => r.type === 'query' && r.data?.esql)
            if (queryResult) {
              const esql = queryResult.data.esql
              let interpretation = 'Executed analysis on your data'
              
              if (esql.includes('BY plan_type') && esql.includes('state')) {
                interpretation = 'Analyzed plan type and state combinations in your data. No missing plan-type/state combinations found.'
              } else if (esql.includes('plan_id.keyword') && esql.includes('count == 0')) {
                interpretation = 'Checked for documents with missing or invalid plan IDs. No such documents found - all documents have valid plan IDs.'
              } else if (esql.includes('plan_id.keyword')) {
                interpretation = 'Analyzed plan ID distribution. No data quality issues detected.'
              } else if (esql.includes('plan_name')) {
                interpretation = 'Checked for documents with missing plan names. No such documents found - all documents have plan names.'
              } else if (esql.includes('plan_type') && !esql.includes('state')) {
                interpretation = 'Checked for documents with missing plan types. No such documents found - all documents have plan types.'
              } else if (esql.includes('document_url')) {
                interpretation = 'Checked for documents with missing URLs. No such documents found - all documents have URLs.'
              } else if (esql.includes('STATS') && esql.includes('BY')) {
                interpretation = 'Analyzed data distribution across multiple dimensions. No data quality issues detected.'
              } else if (esql.includes('STATS')) {
                interpretation = 'Analyzed data quality across your index. No data quality issues detected.'
              }
              
              return `${interpretation}\n\nThe query executed successfully and found no problematic documents. Your data quality looks good!`
            }
          }
          
          // Fallback to formatted output
          const lines = responseText.trim().split('\n')
          const summary = lines.filter(line => line.trim()).slice(0, 10).join('\n')
          return `Query executed successfully.\n\n${summary}`
        }
      }
      
      // If result has content array with text
      if (data.result.content && Array.isArray(data.result.content)) {
        const textContent = data.result.content.find((c: any) => c.type === 'text' || c.text)
        if (textContent?.text) {
          return textContent.text
        }
      }
      
      // If result is a JSON string (from platform_core_search)
      if (typeof data.result === 'string') {
        try {
          const parsed = JSON.parse(data.result)
          if (parsed.results && Array.isArray(parsed.results)) {
            const summary = parsed.results
              .map((r: any) => {
                if (r.data?.content?.highlights) {
                  return r.data.content.highlights.slice(0, 3).join(' | ')
                }
                return null
              })
              .filter(Boolean)
              .slice(0, 5)
              .join('\n\n')
            return `Found ${parsed.results.length} results:\n${summary}`
          }
        } catch (e) {
          // Not JSON, return as string
        }
        return data.result
      }
    }
    
    // Return formatted JSON if summarization didn't happen
    const rawResult = JSON.stringify(data.result || data)
    console.log('⚠️ Returning raw JSON result (no summarization):', rawResult.substring(0, 200))
    return rawResult
  } catch (error: any) {
    console.error('❌ MCP Agent call error:', error)
    return null
  }
}

// Generate response using the actual Elastic Agent Builder Relevancy Agent
async function generateResponse(userMessage: string, conversationHistory: Message[]): Promise<string> {
  // Try to call the actual Relevancy Agent first
  const agentResponse = await callRelevancyAgent(userMessage, conversationHistory)
  
  if (agentResponse) {
    return agentResponse
  }
  
  // Fallback to default response if agent call fails
  const stats = await getIndexStats()
  
  return `I can help you with search relevancy tuning for your Ambetter health plans application.

Current index status:
- Documents: ${stats.totalDocs || 'Unknown'}
- Health: ${stats.health || 'Unknown'}
- Status: ${stats.status || 'Unknown'}

Ask me about:
- Relevance tuning techniques
- Field boosting strategies
- Query optimization
- Performance improvements
- Data quality analysis

What would you like to know?`
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

