'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  plan_name: string
  plan_id: string
  plan_type: string
  county_code: string
  extracted_text: string
  url: string
  document_url: string
  _score: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState(searchParams?.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [selectedPlanTypes, setSelectedPlanTypes] = useState<string[]>([])
  const [selectedCounties, setSelectedCounties] = useState<string[]>([])

  useEffect(() => {
    if (searchParams?.get('q')) {
      performSearch()
    }
  }, [])

  const performSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || '*',
          page: 1,
          limit: 20
        })
      })

      const data = await response.json()
      setResults(data.results || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const toggleFilter = (type: 'planType' | 'county', value: string) => {
    if (type === 'planType') {
      setSelectedPlanTypes(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      )
    } else {
      setSelectedCounties(prev =>
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      )
    }
  }

  const handleRelatedSearch = (topic: string) => {
    setQuery(topic)
    setTimeout(() => {
      performSearch()
    }, 100)
  }

  const planTypes = ['TX014', 'TX016', 'TX017']
  const counties = ['001', '113', '121', '141', '201', '339', '375', '439', '453']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Ambetter Health Search</span>
            </button>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search health plans..."
                  className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="flex gap-6">
            {/* Main Content - Left Side */}
            <div className="flex-1">
              {/* Top Panel - AI Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Summary</h3>
                    <div className="text-gray-700 space-y-2">
                      <p>Based on your search for <span className="font-semibold text-blue-700">&quot;{query}&quot;</span>, I found {total} relevant health plan documents.</p>
                      <p className="text-sm">These include plan brochures, evidence of coverage (EOC), and summary of benefits covering various plan types across Texas counties. The documents contain detailed information about coverage, benefits, costs, and provider networks.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Panel - Search Results */}
              <main className="flex-1">
                {/* Results Header */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Found <span className="font-semibold text-gray-900">{total}</span> results for &quot;{query}&quot;
                  </p>
                </div>

                {/* Results List */}
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <a
                            href={result.document_url || result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-2 inline-block"
                          >
                            {result.plan_name || `${result.plan_id} Health Plan`}
                          </a>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {result.plan_id}
                            </span>
                            <span className="text-sm text-gray-600">
                              {result.plan_type?.replace(/_/g, ' ')}
                            </span>
                            {result.county_code && (
                              <span className="text-sm text-gray-500">County: {result.county_code}</span>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed line-clamp-3">
                            {result.extracted_text?.substring(0, 300)}...
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="text-sm text-gray-500">
                            Score: {result._score?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>

            {/* Right Panel - Recommendations */}
            <aside className="w-80 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-20">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Recommendations
                </h3>

                {/* Filters */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Refine Search</h4>

                  {/* Plan Type Filter */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Plan Type</p>
                    <div className="space-y-2">
                      {planTypes.map((type) => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPlanTypes.includes(type)}
                            onChange={() => toggleFilter('planType', type)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* County Filter */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">County Code</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {counties.map((county) => (
                        <label key={county} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCounties.includes(county)}
                            onChange={() => toggleFilter('county', county)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">County {county}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(selectedPlanTypes.length > 0 || selectedCounties.length > 0) && (
                    <button
                      onClick={() => {
                        setSelectedPlanTypes([])
                        setSelectedCounties([])
                      }}
                      className="mt-3 w-full px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {/* Related Searches */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Related Searches</h4>
                  <div className="space-y-2">
                    {[
                      'Preventive care',
                      'Emergency services',
                      'Specialist copays',
                      'Prescription drugs',
                      'Mental health'
                    ].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleRelatedSearch(topic)}
                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Search Stats</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Results:</span>
                      <span className="font-semibold text-gray-900">{total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plan Types:</span>
                      <span className="font-semibold text-gray-900">{new Set(results.map(r => r.plan_id)).size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Counties:</span>
                      <span className="font-semibold text-gray-900">{new Set(results.map(r => r.county_code)).size}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start searching</h3>
            <p className="text-gray-600">Enter a search term to find health plans</p>
          </div>
        )}
      </div>
    </div>
  )
}
