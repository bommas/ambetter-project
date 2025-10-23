import { NextRequest, NextResponse } from 'next/server'
import { getCachedSummary, cacheSummary, hashResults } from '@/lib/redis'

interface SearchResult {
  plan_name: string
  plan_id: string
  plan_type: string
  county_code: string
  extracted_text: string
  url?: string
  document_url?: string
}

export async function POST(request: NextRequest) {
  try {
    const { query, results } = await request.json()

    // Check cache first
    const resultsHash = hashResults(results || [])
    const cachedSummary = await getCachedSummary(query, resultsHash)
    if (cachedSummary) {
      return NextResponse.json({ summary: cachedSummary, source: 'cache', cached: true })
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback to mock summary if no API key
      return NextResponse.json({
        summary: generateMockSummary(query, results),
        source: 'mock'
      })
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency
        messages: [
          {
            role: 'system',
            content: `You are “Ambetter Assistant,” a knowledgeable and empathetic customer service agent for health insurance plans under Ambetter.  
You have access to a context window that contains information about specific Ambetter health plans (for various states), with details such as premiums, deductibles, covered services, pharmacy benefits, network, etc.

Your job: help a prospective user find which Ambetter plan(s) best match their criteria (budget, providers, prescriptions, coverage preferences).  

Rules:
- Only use facts from the provided context. If the user asks something not found in context, respond: “I’m sorry, I don’t have that detail available.”
- Always explain trade-offs among plan options.
- If the user’s criteria are incomplete or conflicting, ask a clarifying question.
- Be conversational but precise.
- Use citations like “(see Plan X in context document)” when referencing plan details.
- Insert disclaimers: “This is guidance — confirm with official plan documents before enrolling.”

You are not allowed to make up new plan names, benefits, or costs outside the context.

When the user asks “which plan fits me best,” you should produce a ranked subset (e.g. 2–3) with explanation.`
          },
          {
            role: 'user',
            content: `User searched for: "${query}"

Context (Top Results):
${results.slice(0, 3).map((r: SearchResult, i: number) => `
${i + 1}. ${r.plan_name || r.plan_id}
   - Type: ${r.plan_type}
   - County: ${r.county_code}
   - Excerpt: ${r.extracted_text?.substring(0, 500)}...
   - Source: ${r.document_url || r.url || 'N/A'}
   - Citation: (see ${r.plan_name || r.plan_id} in context document)
`).join('\n')}

Task: Based strictly on the context above, provide guidance. If details are missing, state that explicitly.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    })

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text())
      return NextResponse.json({
        summary: generateMockSummary(query, results),
        source: 'mock (OpenAI error)'
      })
    }

    const data = await openaiResponse.json()
    const summary = data.choices[0]?.message?.content || generateMockSummary(query, results)

    // Cache the summary
    await cacheSummary(query, resultsHash, summary)

    return NextResponse.json({
      summary,
      source: 'openai',
      model: 'gpt-4o-mini',
      cached: false
    })

  } catch (error) {
    console.error('AI summary generation error:', error)
    const { query, results } = await request.json()
    return NextResponse.json({
      summary: generateMockSummary(query, results),
      source: 'mock (error fallback)'
    })
  }
}

function generateMockSummary(query: string, results: SearchResult[]): string {
  if (!results || results.length === 0) {
    return `No health plans found matching "${query}". Try searching for terms like "preventive care", "emergency services", or "prescription coverage".`
  }

  const top3 = results.slice(0, 3)
  return `I found ${results.length} health plan documents matching "${query}". 

The top results include:
• ${top3[0]?.plan_name || top3[0]?.plan_id} - ${top3[0]?.plan_type} (County: ${top3[0]?.county_code})
${top3[1] ? `• ${top3[1].plan_name || top3[1].plan_id} - ${top3[1].plan_type} (County: ${top3[1].county_code})` : ''}
${top3[2] ? `• ${top3[2].plan_name || top3[2].plan_id} - ${top3[2].plan_type} (County: ${top3[2].county_code})` : ''}

These plans provide comprehensive coverage including preventive care, emergency services, prescription drugs, and specialist visits. Click on any PDF below to view full plan details and brochures.`
}

