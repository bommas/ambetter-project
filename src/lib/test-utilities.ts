// Test utilities and helpers for QA Agent

export interface TestConfig {
  timeout: number
  retries: number
  environment: string
  baseUrl: string
}

export interface TestContext {
  config: TestConfig
  startTime: number
  results: any[]
}

export class TestUtilities {
  static createTestContext(config: Partial<TestConfig> = {}): TestContext {
    return {
      config: {
        timeout: 30000,
        retries: 3,
        environment: 'development',
        baseUrl: 'http://localhost:3000',
        ...config
      },
      startTime: Date.now(),
      results: []
    }
  }

  static async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null

    for (let i = 0; i < retries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
        }
      }
    }

    throw lastError || new Error('Operation failed after retries')
  }

  static async withTimeout<T>(
    operation: Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
      })
    ])
  }

  static formatDuration(startTime: number): number {
    return Date.now() - startTime
  }

  static formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  static formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%'
    return Math.round((value / total) * 100) + '%'
  }

  static generateTestId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  static validateEnvironment(): { isValid: boolean; missing: string[] } {
    const required = [
      'ELASTIC_CLOUD_ID',
      'ELASTIC_API_KEY'
    ]

    const optional = [
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'RABBITMQ_URL'
    ]

    const missing = required.filter(key => !process.env[key])
    const isValid = missing.length === 0

    return { isValid, missing }
  }

  static createMockData(type: 'health_plan' | 'search_event' | 'click_event') {
    const baseData = {
      timestamp: new Date().toISOString(),
      test_id: this.generateTestId()
    }

    switch (type) {
      case 'health_plan':
        return {
          ...baseData,
          plan_name: 'Test Health Plan',
          plan_type: 'EPO',
          state: 'TX',
          county: 'Harris',
          tobacco_use: false,
          document_url: 'https://example.com/test-plan.pdf',
          extracted_text: 'This is a test health plan document for QA testing.',
          title: 'Test Health Plan - EPO Coverage',
          body: 'Comprehensive health coverage for individuals and families.',
          plan_description: 'Affordable health insurance with comprehensive benefits.',
          benefits_summary: 'Includes doctor visits, prescription drugs, and emergency care.'
        }

      case 'search_event':
        return {
          ...baseData,
          search_query: 'test health insurance',
          filters: { county: 'Harris' },
          search_type: 'hybrid',
          result_count: 5,
          user_session_id: 'test_session'
        }

      case 'click_event':
        return {
          ...baseData,
          event_type: 'plan_click',
          plan_id: 'test_plan_123',
          user_session_id: 'test_session',
          click_position: 1,
          search_query: 'test health insurance'
        }

      default:
        return baseData
    }
  }

  static async simulateLoad(
    operation: () => Promise<any>,
    concurrency: number = 5,
    iterations: number = 10
  ): Promise<{
    successCount: number
    failureCount: number
    averageResponseTime: number
    totalDuration: number
  }> {
    const startTime = Date.now()
    const results: { success: boolean; duration: number }[] = []

    const runIteration = async (): Promise<void> => {
      const iterationStart = Date.now()
      try {
        await operation()
        results.push({ success: true, duration: Date.now() - iterationStart })
      } catch (error) {
        results.push({ success: false, duration: Date.now() - iterationStart })
      }
    }

    // Run iterations in batches with concurrency
    for (let i = 0; i < iterations; i += concurrency) {
      const batch = Array.from({ length: Math.min(concurrency, iterations - i) }, () => runIteration())
      await Promise.all(batch)
    }

    const totalDuration = Date.now() - startTime
    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount
    const averageResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length

    return {
      successCount,
      failureCount,
      averageResponseTime,
      totalDuration
    }
  }

  static createPerformanceThresholds() {
    return {
      search: {
        maxResponseTime: 1000, // 1 second
        minSuccessRate: 0.95   // 95%
      },
      api: {
        maxResponseTime: 500,   // 500ms
        minSuccessRate: 0.99   // 99%
      },
      embedding: {
        maxResponseTime: 5000,  // 5 seconds
        minSuccessRate: 0.90   // 90%
      }
    }
  }

  static evaluatePerformance(
    results: { success: boolean; duration: number }[],
    thresholds: { maxResponseTime: number; minSuccessRate: number }
  ): { passed: boolean; details: any } {
    const successCount = results.filter(r => r.success).length
    const successRate = successCount / results.length
    const averageResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length
    const maxResponseTime = Math.max(...results.map(r => r.duration))

    const passed = successRate >= thresholds.minSuccessRate && 
                   averageResponseTime <= thresholds.maxResponseTime

    return {
      passed,
      details: {
        successRate: this.formatPercentage(successCount, results.length),
        averageResponseTime: Math.round(averageResponseTime),
        maxResponseTime: Math.round(maxResponseTime),
        thresholdSuccessRate: this.formatPercentage(thresholds.minSuccessRate * 100, 100),
        thresholdMaxResponseTime: thresholds.maxResponseTime
      }
    }
  }
}
