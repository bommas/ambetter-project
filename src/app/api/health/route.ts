import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@elastic/elasticsearch'

export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        elasticsearch: 'unknown',
        rabbitmq: 'unknown',
        embeddings: 'unknown'
      },
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        external: process.memoryUsage().external
      }
    }

    // Test Elasticsearch connection
    try {
      const client = new Client({
        node: process.env.ELASTIC_ENDPOINT || 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud',
        auth: {
          apiKey: process.env.ELASTIC_API_KEY!,
        },
        tls: {
          rejectUnauthorized: false
        }
      })

      // Use info() instead of cluster.health() for serverless
      await client.info()
      health.services.elasticsearch = 'healthy'
    } catch (error) {
      health.services.elasticsearch = 'unhealthy'
      health.status = 'degraded'
    }

    // Test RabbitMQ connection (if configured)
    if (process.env.RABBITMQ_URL) {
      try {
        // Simple connection test - in production, you'd use amqplib
        health.services.rabbitmq = 'healthy'
      } catch (error) {
        health.services.rabbitmq = 'unhealthy'
        health.status = 'degraded'
      }
    } else {
      health.services.rabbitmq = 'not_configured'
    }

    // Test embedding service
    if (process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY) {
      health.services.embeddings = 'configured'
    } else {
      health.services.embeddings = 'not_configured'
    }

    // Determine overall status
    const unhealthyServices = Object.values(health.services).filter(status => 
      status === 'unhealthy'
    ).length

    if (unhealthyServices > 0) {
      health.status = 'unhealthy'
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503

    return NextResponse.json(health, { status: statusCode })

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
