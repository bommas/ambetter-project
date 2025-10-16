import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'
import { createEmbeddingService } from '@/lib/embeddings'

export async function POST(request: NextRequest) {
  try {
    const { query, filters = {}, searchType = 'hybrid' } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Initialize Elasticsearch client
    const client = new Client({
      cloud: {
        id: process.env.ELASTIC_CLOUD_ID!,
      },
      auth: {
        apiKey: process.env.ELASTIC_API_KEY!,
      }
    })

    let searchBody: any = {
      query: {
        bool: {
          must: []
        }
      },
      size: 20,
      _source: [
        'plan_name', 'plan_type', 'county', 'tobacco_use', 
        'premium_range', 'deductible_info', 'title', 'body',
        'plan_description', 'benefits_summary', 'document_url'
      ]
    }

    // Add filters
    if (filters.county) {
      searchBody.query.bool.filter = searchBody.query.bool.filter || []
      searchBody.query.bool.filter.push({
        term: { county: filters.county }
      })
    }

    if (filters.plan_type) {
      searchBody.query.bool.filter = searchBody.query.bool.filter || []
      searchBody.query.bool.filter.push({
        term: { plan_type: filters.plan_type }
      })
    }

    if (filters.tobacco_use !== undefined) {
      searchBody.query.bool.filter = searchBody.query.bool.filter || []
      searchBody.query.bool.filter.push({
        term: { tobacco_use: filters.tobacco_use }
      })
    }

    if (searchType === 'semantic' || searchType === 'hybrid') {
      try {
        // Generate embedding for the query
        const embeddingService = createEmbeddingService(client)
        const queryEmbedding = await embeddingService.generateEmbedding(query)

        // Semantic search using dense vectors
        const semanticQuery = {
          knn: {
            field: 'title.semantic_vector',
            query_vector: queryEmbedding,
            k: 10,
            num_candidates: 100
          }
        }

        if (searchType === 'hybrid') {
          // Hybrid search: combine semantic and text search
          searchBody.query.bool.should = [
            semanticQuery,
            {
              multi_match: {
                query: query,
                fields: ['title^2', 'body', 'plan_description', 'benefits_summary'],
                type: 'best_fields',
                fuzziness: 'AUTO'
              }
            }
          ]
          searchBody.query.bool.minimum_should_match = 1
        } else {
          // Pure semantic search
          searchBody.query = semanticQuery
        }
      } catch (embeddingError) {
        console.warn('Embedding generation failed, falling back to text search:', embeddingError)
        // Fallback to text search
        searchBody.query.bool.must.push({
          multi_match: {
            query: query,
            fields: ['title^2', 'body', 'plan_description', 'benefits_summary'],
            type: 'best_fields',
            fuzziness: 'AUTO'
          }
        })
      }
    } else {
      // Text search only
      searchBody.query.bool.must.push({
        multi_match: {
          query: query,
          fields: ['title^2', 'body', 'plan_description', 'benefits_summary'],
          type: 'best_fields',
          fuzziness: 'AUTO'
        }
      })
    }

    // Execute search
    const searchResponse = await client.search({
      index: 'health-plans',
      body: searchBody
    })

    const hits = searchResponse.hits.hits.map((hit: any) => ({
      id: hit._id,
      score: hit._score,
      ...hit._source
    }))

    // Log search event
    try {
      await client.index({
        index: 'search-events',
        body: {
          search_query: query,
          filters: filters,
          search_type: searchType,
          result_count: hits.length,
          timestamp: new Date().toISOString(),
          user_session_id: 'admin' // In production, get from session
        }
      })
    } catch (logError) {
      console.warn('Failed to log search event:', logError)
    }

    return NextResponse.json({
      query,
      searchType,
      total: searchResponse.hits.total,
      hits,
      took: searchResponse.took
    })

  } catch (error) {
    console.error('❌ Search error:', error)
    return NextResponse.json(
      { 
        error: 'Search failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Search API endpoint',
    usage: 'POST to /api/search with query, filters, and searchType (text|semantic|hybrid)'
  })
}
