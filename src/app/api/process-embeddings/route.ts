import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'
import { createEmbeddingService } from '@/lib/embeddings'

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting semantic processing...')

    // Initialize Elasticsearch client
    const client = new Client({
      cloud: {
        id: process.env.ELASTIC_CLOUD_ID!,
      },
      auth: {
        apiKey: process.env.ELASTIC_API_KEY!,
      }
    })

    // Test connection
    try {
      await client.cluster.health()
    } catch (error) {
      return NextResponse.json(
        { error: 'Elastic Cloud connection failed. Check your credentials.' },
        { status: 500 }
      )
    }

    // Create embedding service
    const embeddingService = createEmbeddingService(client)

    // Process all documents
    await embeddingService.processAllDocuments()

    // Get statistics
    const statsResponse = await client.search({
      index: 'health-plans',
      body: {
        query: { match_all: {} },
        size: 0,
        aggs: {
          processed_count: {
            filter: { term: { 'metadata.semantic_processed': true } }
          },
          total_count: {
            value_count: { field: '_id' }
          }
        }
      }
    })

    const processedCount = statsResponse.aggregations?.processed_count?.doc_count || 0
    const totalCount = statsResponse.aggregations?.total_count?.value || 0

    return NextResponse.json({
      message: 'Semantic processing completed successfully',
      processed: processedCount,
      total: totalCount,
      percentage: totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0
    })

  } catch (error) {
    console.error('❌ Error during semantic processing:', error)
    return NextResponse.json(
      { 
        error: 'Semantic processing failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Semantic processing API endpoint',
    usage: 'POST to /api/process-embeddings to generate embeddings for semantic search'
  })
}
