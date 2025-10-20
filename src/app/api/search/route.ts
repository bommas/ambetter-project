import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'
import { INDICES } from '@/lib/elasticsearch'

interface SearchRequest {
  query: string
  filters?: {
    county?: string
    planType?: string[]
    documentType?: string[]
    tobaccoUse?: boolean
  }
  page?: number
  limit?: number
  sortBy?: 'relevance' | 'planType' | 'county'
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json()
    const { query, filters = {}, page = 1, limit = 20, sortBy = 'relevance' } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Build the Elasticsearch query
    const searchQuery = buildSearchQuery(query, filters, sortBy)
    
    // Execute the search
    const response = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        ...searchQuery,
        from: (page - 1) * limit,
        size: limit,
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
    })

    // Format the results
    const results = response.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
      _score: hit._score
    }))

    // Track search analytics
    await trackSearchEvent(query, filters, results.length)

    return NextResponse.json({
      results,
      total: response.hits.total.value,
      page,
      limit,
      query,
      filters
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}

function buildSearchQuery(query: string, filters: any, sortBy: string) {
  const mustClauses: any[] = []
  const shouldClauses: any[] = []

  // Main query - hybrid search combining lexical and semantic
  shouldClauses.push(
    // Lexical search on multiple fields
    {
      multi_match: {
        query,
        fields: [
          'title^2',
          'plan_name^2',
          'extracted_text',
          'body',
          'pdf.content'
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
          'title^3',
          'plan_name^3',
          'extracted_text^2'
        ],
        type: 'phrase'
      }
    }
  )

  // Add semantic search if available
  // Note: This will work with ELSER model in Elasticsearch Serverless
  if (query.length > 3) {
    shouldClauses.push({
      text_expansion: {
        'extracted_text_semantic': {
          model_id: '.elser_model_2',
          model_text: query
        }
      }
    })
  }

  // Apply filters
  if (filters.county) {
    mustClauses.push({
      term: { 'county_code.keyword': filters.county }
    })
  }

  if (filters.planType && filters.planType.length > 0) {
    mustClauses.push({
      terms: { 'plan_id.keyword': filters.planType }
    })
  }

  if (filters.documentType && filters.documentType.length > 0) {
    mustClauses.push({
      terms: { 'plan_type.keyword': filters.documentType }
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