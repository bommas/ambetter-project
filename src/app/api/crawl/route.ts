import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'
import { initializeIndices } from '@/lib/elasticsearch'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting Elastic Crawler via API...')

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

    // Initialize indices
    await initializeIndices()

    // Run Elastic Crawler using Docker
    try {
      console.log('🐳 Starting Elastic Crawler...')
      const { stdout, stderr } = await execAsync(`
        docker run --rm \
          -v "$(pwd)/crawler-config.yml:/config/crawler-config.yml" \
          -e ELASTIC_CLOUD_ID="${process.env.ELASTIC_CLOUD_ID}" \
          -e ELASTIC_API_KEY="${process.env.ELASTIC_API_KEY}" \
          docker.elastic.co/integrations/crawler:latest \
          jruby bin/crawler crawl /config/crawler-config.yml
      `)

      console.log('Crawler output:', stdout)
      if (stderr) console.log('Crawler errors:', stderr)

      // Check if documents were indexed
      const searchResponse = await client.search({
        index: 'health-plans',
        body: {
          query: { match_all: {} },
          size: 0
        }
      })

      const totalDocs = searchResponse.hits.total
      const message = totalDocs > 0 
        ? `Crawl completed successfully. Indexed ${totalDocs} documents.`
        : 'Crawl completed but no documents were found.'

      return NextResponse.json({
        message,
        count: totalDocs,
        crawlerOutput: stdout,
        crawlerErrors: stderr
      })

    } catch (crawlError) {
      console.error('❌ Crawler execution failed:', crawlError)
      return NextResponse.json(
        { 
          error: 'Crawler execution failed', 
          details: crawlError instanceof Error ? crawlError.message : 'Unknown error',
          crawlerOutput: crawlError instanceof Error ? crawlError.message : 'No output'
        },
        { status: 500 }
      )
    }

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
