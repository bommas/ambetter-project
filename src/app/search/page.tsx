'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen bg-white">
      {/* Header matching Ambetter's exact design */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo area */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="text-2xl font-bold text-blue-600">
                  Ambetter Health
                </div>
              </Link>
            </div>

            {/* Navigation matching Ambetter's exact menu structure */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  Shop Plans
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Health Plans</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dental and Vision</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">How to Enroll</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Shop and Compare Plans</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  For Members
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Find a Doctor</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Drug Coverage</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Member Login</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pay Now</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  Programs & Savings
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Health Pays Rewards®</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Ways to Save</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">24hr Nurse Line</Link>
                    <Link href="/search" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Virtual 24/7 Care</Link>
                  </div>
                </div>
              </div>

              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
                Find a Doctor
              </Link>
            </nav>

            {/* Search bar in header */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Keyword Search"
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section matching modern Ambetter style */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-12 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Shop and Compare Plans
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Use your ZIP Code to find your personal plan. See coverage in your area, find doctors and hospitals, 
              view pharmacy program benefits, and view essential health benefits.
            </p>
          </div>

          <div className="space-y-6">
            {/* Main Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for health plans, coverage, benefits..."
                className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg leading-6 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* County Filter */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  County
                </label>
                <select
                  value={filters.county || ''}
                  onChange={(e) => setFilters({ ...filters, county: e.target.value || undefined })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Counties</option>
                  <option value="2941">2941</option>
                </select>
              </div>

              {/* Plan Type Filter */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Plan Type
                </label>
                <select
                  value={filters.planType?.[0] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    planType: e.target.value ? [e.target.value] : undefined 
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Plan Types</option>
                  <option value="TX014">TX014</option>
                  <option value="TX016">TX016</option>
                  <option value="TX017">TX017</option>
                </select>
              </div>

              {/* Document Type Filter */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Document Type
                </label>
                <select
                  value={filters.documentType?.[0] || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    documentType: e.target.value ? [e.target.value] : undefined 
                  })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Document Types</option>
                  <option value="summary_of_benefits">Summary of Benefits</option>
                  <option value="evidence_of_coverage">Evidence of Coverage</option>
                  <option value="out_of_coverage">Out of Coverage</option>
                  <option value="brochure">Brochure</option>
                  <option value="policy">Policy</option>
                  <option value="disclosure">Disclosure</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="inline-flex items-center px-10 py-4 border border-transparent text-lg font-semibold rounded-xl text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    Search Plans
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Search Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Search Results ({results.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {result.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {result.plan_type}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          County: {result.county_code}
                        </span>
                        <span className="text-gray-400">
                          Score: {result._score.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-700 line-clamp-3">
                        {result.extracted_text.substring(0, 300)}...
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View PDF
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
