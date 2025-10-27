import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Cache for storing responses to repeated questions
const cache = new Map<string, { reply: string, timestamp: Date }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// System prompt for the relevancy assistant
const SYSTEM_PROMPT = `You are a Search Relevancy Assistant for an Ambetter Health Plans search application powered by Elasticsearch.

Your role is to help administrators understand and improve search relevancy through:

1. **Query Analysis**: Analyze search queries, identify low-performing searches, find queries returning no results
2. **Relevancy Tuning Techniques**: Provide specific recommendations for:
   - Field boosting (adjusting weights for title, description, plan_name, etc.)
   - Synonym management (adding common misspellings, abbreviations)
   - Fuzziness adjustments (typo tolerance)
   - Curations (pinning/excluding specific documents for certain queries)
   - Filter refinement (ensuring faceted filters work correctly)
   - Semantic search tuning (adjusting ELSER model parameters)

3. **Performance Insights**: Analyze search patterns, popular queries, bounce rates
4. **Troubleshooting**: Help debug search issues, relevance problems, data quality issues

IMPORTANT RULES:
- Only answer questions about search relevancy, query analysis, and Elasticsearch tuning
- If asked about other topics (pricing, plans, benefits), politely redirect to search relevancy context
- Provide specific, actionable recommendations
- Use examples from actual search behavior when possible
- Be concise but thorough
- Always focus on how to improve search relevance`

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

    // Build conversation history for context
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT }
    ]

    // Add conversation history (last 10 messages for context)
    const recentHistory = conversationHistory.slice(-10)
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role,
        content: msg.content
      })
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    })

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    })

    const reply = completion.choices[0].message.content || 'No response generated'

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

