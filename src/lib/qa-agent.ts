import { Client } from '@elastic/elasticsearch'
import { INDICES } from './elasticsearch'

export interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  duration: number
  details?: any
}

export interface ValidationReport {
  timestamp: string
  overallStatus: 'pass' | 'fail' | 'warning'
  totalTests: number
  passedTests: number
  failedTests: number
  warningTests: number
  duration: number
  results: TestResult[]
  environment: string
  version?: string
}

export class QAAgent {
  private client: Client
  private environment: string

  constructor(client: Client, environment: string = 'development') {
    this.client = client
    this.environment = environment
  }

  async runFullValidation(): Promise<ValidationReport> {
    const startTime = Date.now()
    const results: TestResult[] = []

    console.log('🔍 Starting QA validation...')

    // Run all test suites
    results.push(...await this.testElasticsearchConnection())
    results.push(...await this.testIndexHealth())
    results.push(...await this.testAPIEndpoints())
    results.push(...await this.testSearchFunctionality())
    results.push(...await this.testDataIntegrity())
    results.push(...await this.testPerformance())

    const duration = Date.now() - startTime
    const passedTests = results.filter(r => r.status === 'pass').length
    const failedTests = results.filter(r => r.status === 'fail').length
    const warningTests = results.filter(r => r.status === 'warning').length

    const overallStatus = failedTests > 0 ? 'fail' : warningTests > 0 ? 'warning' : 'pass'

    const report: ValidationReport = {
      timestamp: new Date().toISOString(),
      overallStatus,
      totalTests: results.length,
      passedTests,
      failedTests,
      warningTests,
      duration,
      results,
      environment: this.environment
    }

    console.log(`✅ QA validation completed: ${passedTests} passed, ${failedTests} failed, ${warningTests} warnings`)
    return report
  }

  private async testElasticsearchConnection(): Promise<TestResult[]> {
    const results: TestResult[] = []
    const startTime = Date.now()

    try {
      // Test connection with info() for serverless
      const info = await this.client.info()
      const duration = Date.now() - startTime

      results.push({
        name: 'Elasticsearch Connection',
        status: 'pass',
        message: `Connected to ${info.cluster_name}`,
        duration,
        details: {
          cluster_name: info.cluster_name,
          version: info.version?.number,
          build_flavor: info.version?.build_flavor
        }
      })

      // API key authentication is verified by successful info() call
      results.push({
        name: 'API Key Authentication',
        status: 'pass',
        message: 'API key authentication successful',
        duration: Date.now() - startTime
      })

    } catch (error) {
      results.push({
        name: 'Elasticsearch Connection',
        status: 'fail',
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }

    return results
  }

  private async testIndexHealth(): Promise<TestResult[]> {
    const results: TestResult[] = []
    const startTime = Date.now()

    try {
      // Check if health-plans index exists
      const indexExists = await this.client.indices.exists({ index: INDICES.HEALTH_PLANS })
      
      if (!indexExists) {
        results.push({
          name: 'Health Plans Index',
          status: 'fail',
          message: 'Health plans index does not exist',
          duration: Date.now() - startTime
        })
        return results
      }

      // Get document count using search instead of stats (serverless compatible)
      const countResponse = await this.client.count({ index: INDICES.HEALTH_PLANS })
      const docCount = countResponse.count || 0

      results.push({
        name: 'Health Plans Index',
        status: docCount > 0 ? 'pass' : 'warning',
        message: `Index exists with ${docCount} documents`,
        duration: Date.now() - startTime,
        details: {
          document_count: docCount
        }
      })

      // Check index mapping
      const mapping = await this.client.indices.getMapping({ index: INDICES.HEALTH_PLANS })
      const hasRequiredFields = (mapping[INDICES.HEALTH_PLANS] as any)?.mappings?.properties?.plan_name

      results.push({
        name: 'Index Mapping',
        status: hasRequiredFields ? 'pass' : 'warning',
        message: hasRequiredFields ? 'Required fields configured' : 'Required fields missing',
        duration: Date.now() - startTime
      })

    } catch (error) {
      results.push({
        name: 'Index Health Check',
        status: 'fail',
        message: `Index check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }

    return results
  }

  private async testAPIEndpoints(): Promise<TestResult[]> {
    const results: TestResult[] = []
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const endpoints = [
      { path: '/api/health', method: 'GET', name: 'Health Check' },
      { path: '/api/search', method: 'GET', name: 'Search API' },
      { path: '/api/crawl', method: 'GET', name: 'Crawl API' }
    ]

    for (const endpoint of endpoints) {
      const startTime = Date.now()
      try {
        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' }
        })

        const duration = Date.now() - startTime
        results.push({
          name: endpoint.name,
          status: response.ok ? 'pass' : 'fail',
          message: `Status: ${response.status} ${response.statusText}`,
          duration,
          details: {
            url: `${baseUrl}${endpoint.path}`,
            status_code: response.status
          }
        })
      } catch (error) {
        results.push({
          name: endpoint.name,
          status: 'fail',
          message: `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          duration: Date.now() - startTime
        })
      }
    }

    return results
  }

  private async testSearchFunctionality(): Promise<TestResult[]> {
    const results: TestResult[] = []
    const startTime = Date.now()

    try {
      // Test basic search
      const searchResponse = await this.client.search({
        index: INDICES.HEALTH_PLANS,
        body: {
          query: { match_all: {} },
          size: 1
        }
      })

      const duration = Date.now() - startTime
      const hasResults = searchResponse.hits.hits.length > 0

      results.push({
        name: 'Basic Search',
        status: hasResults ? 'pass' : 'warning',
        message: hasResults ? 'Search returns results' : 'No search results found',
        duration,
        details: {
          total_hits: searchResponse.hits.total,
          took: searchResponse.took
        }
      })

      // Test text search functionality
      const textSearchTest = await this.client.search({
        index: INDICES.HEALTH_PLANS,
        body: {
          query: {
            multi_match: {
              query: 'test',
              fields: ['plan_name', 'title']
            }
          },
          size: 1
        }
      })

      results.push({
        name: 'Text Search',
        status: 'pass',
        message: 'Text search functionality working',
        duration: Date.now() - startTime
      })

    } catch (error) {
      results.push({
        name: 'Search Functionality',
        status: 'fail',
        message: `Search test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }

    return results
  }


  private async testDataIntegrity(): Promise<TestResult[]> {
    const results: TestResult[] = []
    const startTime = Date.now()

    try {
      // Check for required fields in documents
      const sampleDocs = await this.client.search({
        index: INDICES.HEALTH_PLANS,
        body: {
          query: { match_all: {} },
          size: 10
        }
      })

      if (sampleDocs.hits.hits.length === 0) {
        results.push({
          name: 'Data Integrity',
          status: 'warning',
          message: 'No documents found for integrity check',
          duration: Date.now() - startTime
        })
        return results
      }

      const requiredFields = ['plan_name', 'state', 'document_url']
      let validDocs = 0
      let totalDocs = sampleDocs.hits.hits.length

      for (const hit of sampleDocs.hits.hits) {
        const source = hit._source as any
        const hasRequiredFields = requiredFields.every(field => source[field])
        if (hasRequiredFields) validDocs++
      }

      const integrityScore = (validDocs / totalDocs) * 100
      results.push({
        name: 'Data Integrity',
        status: integrityScore >= 80 ? 'pass' : integrityScore >= 50 ? 'warning' : 'fail',
        message: `${validDocs}/${totalDocs} documents have required fields (${integrityScore.toFixed(1)}%)`,
        duration: Date.now() - startTime,
        details: {
          valid_documents: validDocs,
          total_documents: totalDocs,
          integrity_score: integrityScore
        }
      })

    } catch (error) {
      results.push({
        name: 'Data Integrity',
        status: 'fail',
        message: `Integrity check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }

    return results
  }

  private async testPerformance(): Promise<TestResult[]> {
    const results: TestResult[] = []
    const startTime = Date.now()

    try {
      // Test search performance
      const searchStart = Date.now()
      await this.client.search({
        index: INDICES.HEALTH_PLANS,
        body: {
          query: { match_all: {} },
          size: 20
        }
      })
      const searchDuration = Date.now() - searchStart

      results.push({
        name: 'Search Performance',
        status: searchDuration < 1000 ? 'pass' : searchDuration < 3000 ? 'warning' : 'fail',
        message: `Search completed in ${searchDuration}ms`,
        duration: searchDuration,
        details: {
          search_time_ms: searchDuration,
          threshold_ms: 1000
        }
      })

      // Test index performance using count (serverless compatible)
      const indexStart = Date.now()
      const countResponse = await this.client.count({ index: INDICES.HEALTH_PLANS })
      const indexDuration = Date.now() - indexStart

      results.push({
        name: 'Index Performance',
        status: indexDuration < 500 ? 'pass' : indexDuration < 1000 ? 'warning' : 'fail',
        message: `Document count retrieved in ${indexDuration}ms`,
        duration: indexDuration
      })

    } catch (error) {
      results.push({
        name: 'Performance Test',
        status: 'fail',
        message: `Performance test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }

    return results
  }

  async generateReport(report: ValidationReport): Promise<string> {
    const statusEmoji = {
      pass: '✅',
      fail: '❌',
      warning: '⚠️'
    }

    let reportText = `
# QA Validation Report

**Timestamp:** ${report.timestamp}
**Environment:** ${report.environment}
**Overall Status:** ${statusEmoji[report.overallStatus]} ${report.overallStatus.toUpperCase()}
**Duration:** ${report.duration}ms

## Summary
- **Total Tests:** ${report.totalTests}
- **Passed:** ${report.passedTests} ✅
- **Failed:** ${report.failedTests} ❌
- **Warnings:** ${report.warningTests} ⚠️

## Test Results
`

    for (const result of report.results) {
      reportText += `
### ${statusEmoji[result.status]} ${result.name}
- **Status:** ${result.status.toUpperCase()}
- **Message:** ${result.message}
- **Duration:** ${result.duration}ms
`
      if (result.details) {
        reportText += `- **Details:** \`${JSON.stringify(result.details, null, 2)}\`\n`
      }
    }

    return reportText
  }
}
