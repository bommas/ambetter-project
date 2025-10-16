'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCrawl = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Crawl failed')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage health plan data and system settings</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Crawl Ambetter Website</h3>
            <p className="text-gray-600 mb-4">
              Extract and index health plan documents from the Ambetter website.
              This will populate the Elasticsearch database with plan information.
            </p>
            
            <button
              onClick={handleCrawl}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Crawling...' : 'Start Crawl'}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-800 font-medium">Error</h4>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-green-800 font-medium">Crawl Completed</h4>
              <div className="text-green-600 space-y-2">
                <p><strong>Documents Indexed:</strong> {result.count}</p>
                <p><strong>Plan Types:</strong> {result.planTypes?.join(', ')}</p>
                <p><strong>Counties:</strong> {result.counties?.join(', ')}</p>
              </div>
              
              {result.documents && result.documents.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-green-800 mb-2">Indexed Documents:</h5>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {result.documents.map((doc: any, index: number) => (
                      <div key={index} className="text-sm text-green-600">
                        {doc.plan_name} ({doc.plan_type}) - {doc.county || 'No county'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-ambetter-blue">Elasticsearch</div>
            <div className="text-gray-600">Search & Analytics</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-ambetter-green">RabbitMQ</div>
            <div className="text-gray-600">Message Queue</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-ambetter-blue">Next.js</div>
            <div className="text-gray-600">Application</div>
          </div>
        </div>
      </div>
    </div>
  )
}
