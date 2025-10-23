import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'
import { INDICES } from '@/lib/elasticsearch'

// Force this route to be dynamic
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Test basic Elasticsearch connectivity
    const pingResult = await client.ping()
    
    // Test index access
    const indexExists = await client.indices.exists({ index: INDICES.HEALTH_PLANS })
    
    // Test search
    const searchResult = await client.search({
      index: INDICES.HEALTH_PLANS,
      size: 1,
      query: { match_all: {} }
    })

    return NextResponse.json({
      status: 'success',
      elasticsearch: {
        ping: pingResult,
        endpoint: process.env.ELASTIC_ENDPOINT || 'using fallback',
        hasApiKey: !!process.env.ELASTIC_API_KEY,
        indexExists,
        sampleDocCount: searchResult.hits.total,
        sampleDoc: searchResult.hits.hits[0]?._source
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      details: error.meta?.body || error.toString(),
      endpoint: process.env.ELASTIC_ENDPOINT || 'using fallback',
      hasApiKey: !!process.env.ELASTIC_API_KEY
    }, { status: 500 })
  }
}

