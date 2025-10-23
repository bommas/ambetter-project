import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'
import { INDICES } from '@/lib/elasticsearch'

// Force this route to be dynamic (not statically generated)
export const dynamic = 'force-dynamic'

interface SearchRequest {
  query: string
  filters?: {
    state?: string
    county?: string
    plan?: string
    planId?: string
    planType?: string[]
    documentType?: string[]
    tobaccoUse?: boolean
  }
  page?: number
  limit?: number
  sortBy?: 'relevance' | 'planType' | 'county'
  mode?: 'semantic' | 'keyword'
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    let { query, filters = {}, page = 1, limit = 20, sortBy = 'relevance', mode = 'semantic' } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Auto-detect state from query if not explicitly filtered
    if (!filters.state) {
      const detectedState = detectStateFromQuery(query)
      if (detectedState) {
        filters = { ...filters, state: detectedState }
        console.log(`🎯 Auto-detected state: ${detectedState} from query: "${query}"`)
      }
    }

    // Load boosts configuration
    const boostsResp = await client.search({ 
      index: INDICES.SEARCH_BOOSTS, 
      body: { size: 1, sort: [{ 'updated_at': { order: 'desc' } }] } 
    }).catch(() => null)
    const boostsDoc: any = boostsResp?.hits?.hits?.[0]?.['_source'] || {}
    const textWeights = boostsDoc.weights || {}

    // Build the Elasticsearch query with custom weights
    const searchQuery = buildSearchQuery(query, filters, sortBy, mode, textWeights)
    
    // Construct the full Elasticsearch request body with collapse to deduplicate
    const esRequestBody = {
      ...searchQuery,
      from: (page - 1) * limit,
      size: limit,
      collapse: {
        field: 'plan_id.keyword', // Deduplicate by plan ID (more reliable than URL with query params)
        inner_hits: {
          name: 'top_chunk',
          size: 1,
          _source: ['extracted_text', 'document_url']
        }
      },
      _source: [
        'title',
        'plan_name',
        'plan_type',
        'plan_id',
        'county_code',
        'extracted_text',
        'url',
        'document_url',
        'pdf.filename',
        'metadata'
      ]
    }
    
    // Log the Elasticsearch query for debugging
    console.log('🔍 Elasticsearch Query:', JSON.stringify({
      index: INDICES.HEALTH_PLANS,
      query: esRequestBody.query,
      from: esRequestBody.from,
      size: esRequestBody.size
    }, null, 2))
    
    // Load curations for pin/exclude logic
    const curationsResp = await client.get({ 
      index: INDICES.CURATIONS, 
      id: Buffer.from(query.toLowerCase()).toString('base64') 
    }).catch(() => null)

    const pins: string[] = (curationsResp as any)?.['_source']?.pins || []
    const excludes: string[] = (curationsResp as any)?.['_source']?.excludes || []

    // Apply numeric boosts via function_score if configured
    const functions: any[] = []
    if (Array.isArray(boostsDoc.numeric_boosts)) {
      for (const nb of boostsDoc.numeric_boosts) {
        if (nb?.field && (nb.type === 'log' || nb.type === 'sigmoid')) {
          const script = nb.type === 'log'
            ? `1 + Math.log(1 + doc['${nb.field}'].value * ${(nb.factor || 1)})`
            : `1 / (1 + Math.exp(-1 * (doc['${nb.field}'].value * ${(nb.factor || 1)})))`
          functions.push({ script_score: { script: { source: script } } })
        }
      }
    }

    // Wrap original query if functions exist
    let finalQuery: any = esRequestBody.query
    if (functions.length > 0) {
      finalQuery = { function_score: { query: esRequestBody.query, functions, boost_mode: 'multiply', score_mode: 'multiply' } }
    }

    // Execute search
    console.log('🔍 Executing search with size:', esRequestBody.size, 'limit:', limit)
    const response = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: { ...esRequestBody, query: finalQuery }
    })
    console.log('📊 Elasticsearch returned:', response.hits.hits.length, 'results out of', response.hits.total)

    // Format the results with extracted plan names
    let results = response.hits.hits.map((hit: any) => {
      const source = hit._source
      const extractedPlanName = extractPlanNameFromBody(source.extracted_text || source.body || '')
      
      return {
        id: hit._id,
        ...source,
        // Override plan_name with extracted name if found
        plan_name: extractedPlanName || source.plan_name || source.title || source.plan_id,
        original_plan_name: source.plan_name, // Keep original for reference
        _score: hit._score
      }
    })

    // Apply excludes (remove matches by URL)
    if (excludes.length > 0) {
      const excludeSet = new Set(excludes)
      results = results.filter(r => !excludeSet.has(r.document_url || r.url))
    }

    // Apply pinning (move curated URLs to top in order)
    if (pins.length > 0) {
      const pinned: any[] = []
      const rest: any[] = []
      const pinSet = new Set(pins)
      for (const url of pins) {
        const idx = results.findIndex(r => (r.document_url || r.url) === url)
        if (idx >= 0) {
          pinned.push(results[idx])
        }
      }
      for (const r of results) {
        const u = r.document_url || r.url
        if (!pinSet.has(u)) rest.push(r)
      }
      results = [...pinned, ...rest]
    }

    // Track search analytics
    await trackSearchEvent(query, filters, results.length)

    return NextResponse.json({
      results,
      total: typeof response.hits.total === 'number' ? response.hits.total : response.hits.total?.value || 0,
      page,
      limit,
      query,
      filters
    })

  } catch (error: any) {
    console.error('Search API error:', error)
    console.error('Error details:', {
      message: error?.message,
      meta: error?.meta?.body,
      statusCode: error?.meta?.statusCode,
      stack: error?.stack
    })
    return NextResponse.json(
      { 
        error: 'Search failed',
        details: error?.message || 'Unknown error',
        meta: error?.meta?.body?.error || null
      },
      { status: 500 }
    )
  }
}

function buildSearchQuery(query: string, filters: any, sortBy: string, mode: 'semantic' | 'keyword' = 'semantic', weights: Record<string, number> = {}) {
  const mustClauses: any[] = []
  const shouldClauses: any[] = []

  // Apply custom field weights from boosts config or use defaults
  const getWeight = (field: string, defaultWeight: number = 1) => {
    return weights[field] !== undefined ? weights[field] : defaultWeight
  }

  // Main query - hybrid search combining lexical and semantic
  shouldClauses.push(
    // Lexical search on multiple fields (including state)
    {
      multi_match: {
        query,
        fields: [
          `title^${getWeight('title', 2)}`,
          `plan_name^${getWeight('plan_name', 2)}`,
          `state^${getWeight('state', 3)}`,
          `county^${getWeight('county', 2)}`,
          `extracted_text^${getWeight('extracted_text', 3)}`,
          `body^${getWeight('body', 1)}`,
          `pdf_extracted^${getWeight('pdf_extracted', 3)}`
        ],
        type: 'best_fields',
        fuzziness: 'AUTO'
      }
    },
    // Phrase search for exact matches
    {
      multi_match: {
        query,
        fields: [
          `title^${getWeight('title', 3)}`,
          `plan_name^${getWeight('plan_name', 3)}`,
          `state^${getWeight('state', 4)}`,
          `extracted_text^${getWeight('extracted_text', 2)}`,
          `pdf_extracted^${getWeight('pdf_extracted', 2)}`
        ],
        type: 'phrase'
      }
    },
    // Wildcard search for Texas-specific queries
    {
      query_string: {
        query: `*${query.toLowerCase().replace(/[^\w\s]/g, '')}*`,
        fields: ['state', 'county', 'plan_name', 'extracted_text'],
        default_operator: 'OR'
      }
    }
  )

  // Semantic search using ELSER embeddings (only if semantic mode)
  if (mode === 'semantic') {
    shouldClauses.push(
      {
        semantic: {
          field: 'extracted_text_semantic',
          query,
          boost: 2.0
        }
      },
      {
        semantic: {
          field: 'body_semantic',
          query,
          boost: 1.5
        }
      },
      {
        semantic: {
          field: 'pdf_semantic',
          query,
          boost: 1.5
        }
      }
    )
  }

  // Apply filters
  if (filters.state) {
    mustClauses.push({
      term: { 'state.keyword': filters.state }
    })
  }

  if (filters.county) {
    mustClauses.push({
      term: { 'county_code.keyword': filters.county }
    })
  }

  if (filters.plan) {
    mustClauses.push({
      term: { 'plan_name.keyword': filters.plan }
    })
  }

  // Filter by plan_type
  if (filters.planType && filters.planType.length > 0) {
    mustClauses.push({
      terms: { 'plan_type.keyword': filters.planType }
    })
  }

  // Filter by document type from metadata
  if (filters.documentType && filters.documentType.length > 0) {
    mustClauses.push({
      terms: { 'metadata.plan_info.document_type.keyword': filters.documentType }
    })
  }

  if (filters.tobaccoUse !== undefined) {
    mustClauses.push({
      term: { tobacco_use: filters.tobaccoUse }
    })
  }

  // Build the final query
  const searchQuery: any = {
    query: {
      bool: {
        must: mustClauses,
        should: shouldClauses,
        minimum_should_match: 1
      }
    }
  }

  // Add sorting
  switch (sortBy) {
    case 'planType':
      searchQuery.sort = [{ 'plan_id.keyword': { order: 'asc' } }]
      break
    case 'county':
      searchQuery.sort = [{ 'county_code.keyword': { order: 'asc' } }]
      break
    default:
      // Default to relevance scoring
      break
  }

  return searchQuery
}

/**
 * Extract the human-readable plan name from the document body text
 * Looks for patterns like "Ambetter + Adult Vision", "Ambetter Essential Care", etc.
 */
function extractPlanNameFromBody(bodyText: string): string | null {
  if (!bodyText) return null

  // Pattern 1: Look for explicit product/tier phrases (e.g., "Everyday Gold + Vision + Adult Dental")
  const productTierPattern = /(Everyday|Complete|Focused|Elite|Standard|Premier|Value)\s+(Gold|Silver|Bronze)(?:\s*\+\s*[A-Za-z\s]+)?/i
  const productTierMatch = bodyText.match(productTierPattern)
  if (productTierMatch && productTierMatch[0]) {
    const candidate = productTierMatch[0].trim()
    if (candidate.length > 5 && candidate.length < 120) return candidate
  }

  // Pattern 2: Ambetter branded product names (e.g., "Ambetter Health Premier", "Ambetter Value")
  const ambetterProductPattern = /Ambetter(?:\s+Health)?\s+(Premier|Value|TXSMP)(?:[^\n]{0,60})?/i
  const ambetterProductMatch = bodyText.match(ambetterProductPattern)
  if (ambetterProductMatch && ambetterProductMatch[0]) {
    const candidate = ambetterProductMatch[0].trim()
    if (candidate.length > 5 && candidate.length < 120) return candidate
  }

  // Pattern 3: Look for "MAJOR MEDICAL EXPENSE POLICY" followed by plan name line
  const policyPattern = /MAJOR MEDICAL EXPENSE POLICY\s+([^\n]+)/i
  const policyMatch = bodyText.match(policyPattern)
  if (policyMatch && policyMatch[1]) {
    const planName = policyMatch[1].trim()
    const cleanName = planName
      .replace(/Ambetter\.SuperiorHealthPlan\.com/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (cleanName && cleanName.length > 3 && cleanName.length < 100) {
      return cleanName
    }
  }

  // Pattern 4: Look for "Ambetter + <addon>" (e.g., "Ambetter + Adult Vision")
  const ambetterPattern = /Ambetter\s*\+?\s*([A-Z][A-Za-z\s]+(?:Care|Vision|Health|Plan|Plus|Select|Choice|Value|Essential|Balanced|Secure))/
  const ambetterMatch = bodyText.match(ambetterPattern)
  if (ambetterMatch && ambetterMatch[0]) {
    const planName = ambetterMatch[0].trim()
    if (planName.length > 3 && planName.length < 100) {
      return planName
    }
  }

  // Pattern 5: Look for "FOR AMBETTER FROM <Issuer>" followed by issuer name
  const forAmbetterPattern = /FOR AMBETTER FROM\s+([A-Z][A-Za-z\s]+)/i
  const forAmbetterMatch = bodyText.match(forAmbetterPattern)
  if (forAmbetterMatch && forAmbetterMatch[1]) {
    const planName = `Ambetter from ${forAmbetterMatch[1].trim()}`
    if (planName.length < 100) {
      return planName
    }
  }

  return null
}

/**
 * Detect state from query text
 * Matches common state names and abbreviations
 */
function detectStateFromQuery(query: string): string | null {
  const queryLower = query.toLowerCase()
  
  // State detection patterns
  const statePatterns: Record<string, RegExp> = {
    'TX': /\b(texas|tx)\b/i,
    'FL': /\b(florida|fl)\b/i,
    'CA': /\b(california|ca)\b/i,
    'NY': /\b(new york|ny)\b/i,
    'IL': /\b(illinois|il)\b/i,
    'PA': /\b(pennsylvania|pa)\b/i,
    'OH': /\b(ohio|oh)\b/i,
    'GA': /\b(georgia|ga)\b/i,
    'NC': /\b(north carolina|nc)\b/i,
    'MI': /\b(michigan|mi)\b/i,
  }
  
  for (const [state, pattern] of Object.entries(statePatterns)) {
    if (pattern.test(queryLower)) {
      return state
    }
  }
  
  return null
}

async function trackSearchEvent(query: string, filters: any, resultCount: number) {
  try {
    await client.index({
      index: INDICES.SEARCH_EVENTS,
      body: {
        search_query: query,
        filters,
        timestamp: new Date().toISOString(),
        result_count: resultCount,
        user_session_id: 'anonymous', // TODO: Add proper session tracking
        search_duration_ms: 0 // TODO: Add timing
      }
    })
  } catch (error) {
    console.error('Failed to track search event:', error)
    // Don't fail the search if analytics tracking fails
  }
}