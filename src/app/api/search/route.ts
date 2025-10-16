import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'

export async function POST(request: NextRequest) {
  try {
    const { query, filters = {} } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Initialize Elasticsearch client
    const client = new Client({
      node: process.env.ELASTIC_ENDPOINT || 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud',
      auth: {
        apiKey: process.env.ELASTIC_API_KEY!,
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    let searchBody: any = {
      query: {
        bool: {
          must: [],
          filter: []
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
      searchBody.query.bool.filter.push({
        term: { county: filters.county }
      })
    }

    if (filters.plan_type) {
      searchBody.query.bool.filter.push({
        term: { plan_type: filters.plan_type }
      })
    }

    if (filters.tobacco_use !== undefined) {
      searchBody.query.bool.filter.push({
        term: { tobacco_use: filters.tobacco_use }
      })
    }

    // Text search only
    searchBody.query.bool.must.push({
      multi_match: {
        query: query,
        fields: ['title^2', 'body', 'plan_description', 'benefits_summary', 'plan_name^2'],
        type: 'best_fields',
        fuzziness: 'AUTO'
      }
    })

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
    usage: 'POST to /api/search with query and filters for lexical search'
  })
}
