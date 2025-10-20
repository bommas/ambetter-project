'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface SearchFilters {
  county?: string
  planType?: string[]
  documentType?: string[]
  tobaccoUse?: boolean
}

interface SearchResult {
  id: string
  title: string
  plan_name: string
  plan_type: string
  county_code: string
  extracted_text: string
  url: string
  _score: number
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          filters,
          page: 1,
          limit: 20,
        }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Ambetter Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[80%] mx-auto">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold" style={{ color: '#C61C71' }}>
                Ambetter Health
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/search" className="text-[#333333] hover:text-[#C61C71] font-medium text-base">
                Shop Plans
              </Link>
              <Link href="/search" className="text-[#333333] hover:text-[#C61C71] font-medium text-base">
                For Members
              </Link>
              <Link href="/search" className="text-[#333333] hover:text-[#C61C71] font-medium text-base">
                Programs & Savings
              </Link>
              <Link href="/search" className="text-[#333333] hover:text-[#C61C71] font-medium text-base">
                Find a Doctor
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search"
                className="px-4 py-2 border border-gray-300 rounded text-sm w-48"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 rounded text-white text-sm font-medium disabled:opacity-50 hover:opacity-90"
                style={{ backgroundColor: '#C61C71' }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Search Hero */}
        <div style={{ backgroundColor: '#C61C71' }} className="py-16">
          <div className="max-w-[80%] mx-auto">
            <div className="text-center text-white mb-8">
              <h1 className="text-[32px] font-bold mb-4">Shop and Compare Plans</h1>
              <p className="text-[18px] mb-8">
                Find the perfect health plan for you and your family
              </p>
            </div>

            <div className="space-y-6">
              {/* Search Input */}
              <div className="max-w-2xl mx-auto">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for health plans, coverage, benefits..."
                  className="w-full px-6 py-4 border border-gray-300 rounded text-[18px]"
                  style={{ color: '#333333' }}
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <select
                  value={filters.county || ''}
                  onChange={(e) => setFilters({ ...filters, county: e.target.value || undefined })}
                  className="px-4 py-3 border border-gray-300 rounded text-[16px]"
                  style={{ color: '#333333' }}
                >
                  <option value="">All Counties</option>
                  <option value="2941">2941</option>
                </select>

                <select
                  value={filters.planType?.[0] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    planType: e.target.value ? [e.target.value] : undefined 
                  })}
                  className="px-4 py-3 border border-gray-300 rounded text-[16px]"
                  style={{ color: '#333333' }}
                >
                  <option value="">All Plan Types</option>
                  <option value="TX014">TX014</option>
                  <option value="TX016">TX016</option>
                  <option value="TX017">TX017</option>
                </select>

                <select
                  value={filters.documentType?.[0] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    documentType: e.target.value ? [e.target.value] : undefined 
                  })}
                  className="px-4 py-3 border border-gray-300 rounded text-[16px]"
                  style={{ color: '#333333' }}
                >
                  <option value="">All Document Types</option>
                  <option value="summary_of_benefits">Summary of Benefits</option>
                  <option value="evidence_of_coverage">Evidence of Coverage</option>
                  <option value="out_of_coverage">Out of Coverage</option>
                  <option value="brochure">Brochure</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="px-10 py-3 rounded text-base font-medium disabled:opacity-50 hover:opacity-90"
                  style={{ backgroundColor: '#FFFFFF', color: '#C61C71' }}
                >
                  {loading ? 'Searching...' : 'Search Plans'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="py-12 bg-white">
          <div className="max-w-[80%] mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                <p className="text-[16px]" style={{ color: '#DC2626' }}>
                  {error}
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div>
                <h2 className="text-[29px] font-bold mb-6" style={{ color: '#333333' }}>
                  Search Results ({results.length})
                </h2>
                <div className="space-y-6">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="border border-gray-200 rounded p-6"
                    >
                      <h3 className="text-[23px] font-semibold mb-3" style={{ color: '#6E6E6E' }}>
                        {result.title}
                      </h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="px-3 py-1 rounded text-[14px]" style={{ backgroundColor: '#F7E0EC', color: '#C61C71' }}>
                          {result.plan_type}
                        </span>
                        <span className="px-3 py-1 bg-green-100 rounded text-[14px]" style={{ color: '#059669' }}>
                          County: {result.county_code}
                        </span>
                        <span className="text-[14px]" style={{ color: '#9CA3AF' }}>
                          Score: {result._score.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[18px] mb-4" style={{ color: '#6E6E6E' }}>
                        {result.extracted_text.substring(0, 300)}...
                      </p>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2 border border-gray-300 rounded text-[16px] font-medium"
                        style={{ color: '#333333' }}
                      >
                        View PDF
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && results.length === 0 && query && (
              <div className="text-center py-12">
                <h3 className="text-[23px] font-semibold mb-2" style={{ color: '#6E6E6E' }}>
                  No results found
                </h3>
                <p className="text-[18px]" style={{ color: '#6E6E6E' }}>
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
