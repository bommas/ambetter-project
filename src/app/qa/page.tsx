'use client'

import { useState, useEffect } from 'react'

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  duration: number
  details?: any
}

interface ValidationReport {
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

export default function QAPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [report, setReport] = useState<ValidationReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recentReports, setRecentReports] = useState<ValidationReport[]>([])

  const runValidation = async () => {
    setIsRunning(true)
    setError(null)
    setReport(null)

    try {
      const response = await fetch('/api/qa/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environment: 'production'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Validation failed')
      }

      setReport(data.report)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsRunning(false)
    }
  }

  const loadRecentReports = async () => {
    try {
      const response = await fetch('/api/qa/reports')
      if (response.ok) {
        const data = await response.json()
        setRecentReports(data.reports || [])
      }
    } catch (err) {
      console.warn('Failed to load recent reports:', err)
    }
  }

  useEffect(() => {
    loadRecentReports()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-50 border-green-200'
      case 'fail': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅'
      case 'fail': return '❌'
      case 'warning': return '⚠️'
      default: return '❓'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">QA Agent Dashboard</h1>
        <p className="text-gray-600">Validate and test your deployment automatically</p>
      </div>

      {/* Run Validation */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Run Validation</h2>
        <p className="text-gray-600 mb-4">
          Execute comprehensive tests to validate your deployment including Elasticsearch connectivity, 
          API endpoints, search functionality, and data integrity.
        </p>
        
        <button
          onClick={runValidation}
          disabled={isRunning}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Validation...' : 'Run Full Validation'}
        </button>
      </div>

      {/* Current Report */}
      {report && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Latest Validation Report</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(report.overallStatus)}`}>
              {getStatusIcon(report.overallStatus)} {report.overallStatus.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{report.totalTests}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{report.passedTests}</div>
              <div className="text-sm text-green-600">Passed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{report.failedTests}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{report.warningTests}</div>
              <div className="text-sm text-yellow-600">Warnings</div>
            </div>
          </div>

          <div className="space-y-3">
            {report.results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(result.status)}</span>
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{result.duration}ms</span>
                </div>
                <p className="text-sm mt-1">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer text-gray-600 hover:text-gray-800">
                      View Details
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium">Validation Error</h4>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
          <div className="space-y-2">
            {recentReports.slice(0, 5).map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(report.overallStatus)}</span>
                  <div>
                    <div className="font-medium">{report.timestamp}</div>
                    <div className="text-sm text-gray-600">
                      {report.passedTests} passed, {report.failedTests} failed, {report.warningTests} warnings
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {report.duration}ms
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Categories */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900">Infrastructure Tests</h3>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Elasticsearch Connection</li>
              <li>• Index Health Check</li>
              <li>• API Endpoints</li>
              <li>• Performance Tests</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900">Feature Tests</h3>
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              <li>• Search Functionality</li>
              <li>• Embedding Generation</li>
              <li>• Data Integrity</li>
              <li>• Semantic Search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
