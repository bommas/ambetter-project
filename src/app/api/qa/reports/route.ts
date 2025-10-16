import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'

export async function GET(request: NextRequest) {
  try {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const environment = searchParams.get('environment') || 'production'

    // Search for recent QA reports
    const searchResponse = await client.search({
      index: 'qa-reports',
      body: {
        query: {
          bool: {
            must: [
              { term: { environment } }
            ]
          }
        },
        sort: [
          { timestamp: { order: 'desc' } }
        ],
        size: limit,
        _source: [
          'timestamp', 'overallStatus', 'totalTests', 'passedTests', 
          'failedTests', 'warningTests', 'duration', 'environment'
        ]
      }
    })

    const reports = searchResponse.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source
    }))

    return NextResponse.json({
      reports,
      total: searchResponse.hits.total,
      environment
    })

  } catch (error) {
    console.error('❌ Failed to fetch QA reports:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch reports', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const olderThan = searchParams.get('olderThan')
    const environment = searchParams.get('environment') || 'production'

    if (!olderThan) {
      return NextResponse.json(
        { error: 'olderThan parameter is required' },
        { status: 400 }
      )
    }

    // Delete old reports
    const deleteResponse = await client.deleteByQuery({
      index: 'qa-reports',
      body: {
        query: {
          bool: {
            must: [
              { term: { environment } },
              { range: { timestamp: { lt: olderThan } } }
            ]
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Reports deleted successfully',
      deleted: deleteResponse.deleted
    })

  } catch (error) {
    console.error('❌ Failed to delete QA reports:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete reports', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
