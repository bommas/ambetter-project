import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'
import { PDFCrawler } from '@/crawler/pdf-crawler'
import { initializeIndices } from '@/lib/elasticsearch'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting crawl via API...')

    // Initialize Elasticsearch client
    const client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
      }
    })

    // Test connection
    try {
      await client.cluster.health()
    } catch (error) {
      return NextResponse.json(
        { error: 'Elasticsearch connection failed. Make sure it\'s running.' },
        { status: 500 }
      )
    }

    // Initialize indices
    await initializeIndices()

    // Create crawler and run
    const crawler = new PDFCrawler(client)
    const documents = await crawler.crawlAmbetterWebsite()

    if (documents.length === 0) {
      return NextResponse.json(
        { message: 'No documents found to index', count: 0 },
        { status: 200 }
      )
    }

    // Index documents
    await crawler.indexDocuments(documents)

    // Return summary
    const planTypes = [...new Set(documents.map(doc => doc.plan_type))]
    const counties = [...new Set(documents.map(doc => doc.county).filter(Boolean))]

    return NextResponse.json({
      message: 'Crawl and indexing completed successfully',
      count: documents.length,
      planTypes,
      counties,
      documents: documents.map(doc => ({
        plan_name: doc.plan_name,
        plan_type: doc.plan_type,
        county: doc.county,
        document_url: doc.document_url
      }))
    })

  } catch (error) {
    console.error('❌ Error during crawl:', error)
    return NextResponse.json(
      { error: 'Crawl failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Crawl API endpoint',
    usage: 'POST to /api/crawl to start crawling and indexing'
  })
}
