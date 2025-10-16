import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'
import { QAAgent } from '@/lib/qa-agent'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Starting QA validation...')

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

    // Get environment from request or default
    const { environment = 'development' } = await request.json().catch(() => ({}))
    
    // Create QA agent
    const qaAgent = new QAAgent(client, environment)

    // Run full validation
    const report = await qaAgent.runFullValidation()

    // Generate markdown report
    const markdownReport = await qaAgent.generateReport(report)

    // Store report in Elasticsearch for history
    try {
      await client.index({
        index: 'qa-reports',
        body: {
          ...report,
          markdown_report: markdownReport
        }
      })
    } catch (indexError) {
      console.warn('Failed to store QA report:', indexError)
    }

    return NextResponse.json({
      success: true,
      report,
      markdown_report: markdownReport
    })

  } catch (error) {
    console.error('❌ QA validation failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'QA validation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'QA Validation API endpoint',
    usage: 'POST to /api/qa/validate to run full validation suite',
    available_tests: [
      'Elasticsearch Connection',
      'Index Health',
      'API Endpoints',
      'Search Functionality',
      'Embedding Generation',
      'Data Integrity',
      'Performance'
    ]
  })
}
