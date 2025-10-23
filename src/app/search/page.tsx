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

interface Facet {
  value: string
  label: string
  count: number
  tier?: string
}

interface Facets {
  states: Facet[]
  counties: Facet[]
  documentTypes: Facet[]
  plans: Facet[]
  planIds: Facet[]
  planTypes: Facet[]
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams?.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [facets, setFacets] = useState<Facets>({ states: [], counties: [], documentTypes: [], plans: [], planIds: [], planTypes: [] })
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCounty, setSelectedCounty] = useState<string>('')
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('')
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
      loadFacets(initialQuery)
    }
  }, [initialQuery])

  const loadFacets = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/facets?query=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setFacets(data)
    } catch (error) {
      console.error('Failed to load facets:', error)
    }
  }

  const performSearch = async (searchQuery: string, filters?: {state?: string, county?: string, documentType?: string, plan?: string, planId?: string}) => {
    setLoading(true)
    setAiSummary(null)
    setResults([])

    try {
      // Build filters object
      const searchFilters: any = {}
      if (filters?.state) {
        searchFilters.state = filters.state
      }
      if (filters?.county) {
        searchFilters.county = filters.county
      }
      if (filters?.plan) {
        searchFilters.plan = filters.plan
      }
      if (filters?.documentType) {
        searchFilters.documentType = [filters.documentType]
      }
      if (filters?.planId) {
        searchFilters.planType = [filters.planId]
      }

      // Elasticsearch search
      const esResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery, 
          page: 1, 
          limit: 10,
          filters: searchFilters 
        })
      })
      const esData = await esResponse.json()
      const searchResults = esData.results || []
      setResults(searchResults)

      // Generate AI Summary using OpenAI
      const aiResponse = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, results: searchResults })
      })
      const aiData = await aiResponse.json()
      setAiSummary(aiData.summary)

    } catch (error) {
      console.error('Search error:', error)
      setAiSummary("An error occurred while searching. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = () => {
    performSearch(initialQuery, {
      state: selectedState,
      county: selectedCounty,
      plan: selectedPlan,
      documentType: selectedDocumentType,
      planId: selectedPlanId
    })
  }

  const clearFilters = () => {
    setSelectedState('')
    setSelectedCounty('')
    setSelectedDocumentType('')
    setSelectedPlan('')
    setSelectedPlanId('')
    performSearch(initialQuery, {})
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div style={styles.container}>
      {/* Top Header Ribbon */}
      <div style={styles.headerRibbon}>
        <div style={styles.ribbonContent}>
          <div style={styles.logoContainer} onClick={() => router.push('/')}>
            <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span style={styles.logoText}>Ambetter Health</span>
          </div>
        </div>
      </div>

      {/* Header with Search */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <form onSubmit={handleSearchSubmit} style={styles.headerSearchForm}>
            <div style={styles.headerSearchBox}>
              <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.headerSearchInput}
                placeholder="Search health plans..."
              />
            </div>
          </form>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <main style={styles.main}>
        <div style={styles.contentWithSidebar}>
          {/* Left Sidebar - Filters */}
          <aside style={styles.sidebar}>
            {/* Clear All Filters Button */}
            {(selectedState || selectedCounty || selectedDocumentType || selectedPlanId) && (
              <button onClick={clearFilters} style={styles.clearAllButton}>
                Clear All Filters
              </button>
            )}

            {/* State Filter - TOP OF LIST */}
            {facets.states.length > 0 && (
              <div style={styles.filterSection}>
                <div style={styles.filterHeader}>
                  <h3 style={styles.filterTitle}>State</h3>
                </div>
                
                <div style={styles.filterOptions}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="state"
                      value=""
                      checked={selectedState === ''}
                      onChange={(e) => {
                        setSelectedState('')
                        handleFilterChange()
                      }}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioText}>All States</span>
                    <span style={styles.countBadge}>{facets.states.reduce((sum, s) => sum + s.count, 0)}</span>
                  </label>

                  {facets.states.map((state) => (
                    <label key={state.value} style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="state"
                        value={state.value}
                        checked={selectedState === state.value}
                        onChange={(e) => {
                          setSelectedState(state.value)
                          setTimeout(handleFilterChange, 0)
                        }}
                        style={styles.radioInput}
                      />
                      <span style={styles.radioText}>{state.label}</span>
                      <span style={styles.countBadge}>{state.count}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Document Type Filter */}
            {facets.documentTypes.length > 0 && (
              <div style={styles.filterSection}>
                <div style={styles.filterHeader}>
                  <h3 style={styles.filterTitle}>Document Type</h3>
                </div>
                
                <div style={styles.filterOptions}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="documentType"
                      value=""
                      checked={selectedDocumentType === ''}
                      onChange={(e) => {
                        setSelectedDocumentType('')
                        handleFilterChange()
                      }}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioText}>All Types</span>
                    <span style={styles.countBadge}>{facets.documentTypes.reduce((sum, d) => sum + d.count, 0)}</span>
                  </label>

                  {facets.documentTypes.map((docType) => (
                    <label key={docType.value} style={styles.radioLabel}>
                      <input
                        type="radio"
                        name="documentType"
                        value={docType.value}
                        checked={selectedDocumentType === docType.value}
                        onChange={(e) => {
                          setSelectedDocumentType(docType.value)
                          setTimeout(handleFilterChange, 0)
                        }}
                        style={styles.radioInput}
                      />
                      <span style={styles.radioText}>{docType.label}</span>
                      <span style={styles.countBadge}>{docType.count}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Plans Filter (Dynamic, Grouped by Tier) */}
            {facets.plans && facets.plans.length > 0 && (
              <div style={styles.filterSection}>
                <div style={styles.filterHeader}>
                  <h3 style={styles.filterTitle}>Health Plans</h3>
                </div>
                
                <div style={styles.filterOptions}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="plan"
                      value=""
                      checked={selectedPlan === ''}
                      onChange={(e) => {
                        setSelectedPlan('')
                        handleFilterChange()
                      }}
                      style={styles.radioInput}
                    />
                    <span style={styles.radioText}>All Plans</span>
                    <span style={styles.countBadge}>{facets.plans.reduce((sum, p) => sum + p.count, 0)}</span>
                  </label>

                  {/* Group plans by tier with visual separators */}
                  {(() => {
                    let lastTier = ''
                    return facets.plans.slice(0, 15).map((plan, index) => {
                      const showTierHeader = plan.tier && plan.tier !== lastTier
                      lastTier = plan.tier || ''
                      
                      return (
                        <div key={plan.value}>
                          {showTierHeader && (
                            <div style={{
                              ...styles.radioText,
                              fontWeight: 'bold',
                              color: '#C61C71',
                              marginTop: index > 0 ? '12px' : '0',
                              marginBottom: '4px',
                              fontSize: '13px'
                            }}>
                              {plan.tier} Plans
                            </div>
                          )}
                          <label style={styles.radioLabel}>
                            <input
                              type="radio"
                              name="plan"
                              value={plan.value}
                              checked={selectedPlan === plan.value}
                              onChange={(e) => {
                                setSelectedPlan(plan.value)
                                setTimeout(handleFilterChange, 0)
                              }}
                              style={styles.radioInput}
                            />
                            <span style={{...styles.radioText, fontSize: '13px'}} title={plan.value}>
                              {plan.label}
                            </span>
                            <span style={styles.countBadge}>{plan.count}</span>
                          </label>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            )}
          </aside>

          {/* Right Content Area */}
          <div style={styles.content}>
            {loading && (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Searching and generating AI summary...</p>
              </div>
            )}

            {!loading && aiSummary && (
              <div style={styles.aiSummaryBox}>
                <div style={styles.aiHeader}>
                  <div style={styles.aiBadge}>AI Mode</div>
                  <h2 style={styles.aiTitle}>AI Summary</h2>
                </div>
                <p style={styles.aiText}>{aiSummary}</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div style={styles.resultsSection}>
                <p style={styles.resultCount}>
                  About {results.length} results
                  {selectedState && ` • State: ${selectedState}`}
                  {selectedDocumentType && ` • ${facets.documentTypes.find(d => d.value === selectedDocumentType)?.label}`}
                  {selectedPlanId && ` • ${facets.planIds.find(p => p.value === selectedPlanId)?.label}`}
                </p>
              
              {results.map((result, index) => (
                <div key={result.id} style={styles.resultCard}>
                  <div style={styles.resultHeader}>
                    <a 
                      href={result.document_url || result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.resultUrl}
                    >
                      {result.document_url || result.url}
                    </a>
                  </div>
                  <a 
                    href={result.document_url || result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.resultTitle}
                  >
                    {result.plan_name || result.plan_id}
                  </a>
                  <p style={styles.resultMeta}>
                    {result.plan_type} • County: {result.county_code}
                  </p>
                  <p style={styles.resultSnippet}>
                    {result.extracted_text?.substring(0, 200)}...
                  </p>
                </div>
              ))}
            </div>
          )}

            {!loading && !aiSummary && !results.length && initialQuery && (
              <div style={styles.noResults}>
                <p style={styles.noResultsText}>
                  No results found for "{initialQuery}"
                </p>
                <p style={styles.noResultsSuggestion}>
                  Try different keywords or check your spelling
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  headerRibbon: {
    backgroundColor: '#C61C71',
    padding: '12px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  ribbonContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '28px',
    height: '28px',
    color: '#ffffff',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  header: {
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 20px',
    backgroundColor: '#fff',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  headerLogo: {
    fontSize: '24px',
    fontWeight: '500',
    color: '#C61C71',
    margin: 0,
    cursor: 'pointer',
    flexShrink: 0,
  },
  headerSearchForm: {
    flex: 1,
    maxWidth: '600px',
  },
  headerSearchBox: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '40px',
    border: '1px solid #dfe1e5',
    borderRadius: '20px',
    padding: '0 16px',
    backgroundColor: '#fff',
  },
  searchIcon: {
    width: '18px',
    height: '18px',
    color: '#9aa0a6',
    marginRight: '10px',
    flexShrink: 0,
  },
  headerSearchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: '#202124',
    backgroundColor: 'transparent',
  },
  main: {
    padding: '20px',
  },
  contentWithSidebar: {
    display: 'flex',
    gap: '30px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  sidebar: {
    width: '280px',
    flexShrink: 0,
  },
  clearAllButton: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    backgroundColor: '#C61C71',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  filterSection: {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
  },
  filterHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  filterTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#202124',
    margin: 0,
  },
  clearButton: {
    fontSize: '13px',
    color: '#C61C71',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    textDecoration: 'underline',
  },
  filterOptions: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  radioInput: {
    marginRight: '10px',
    cursor: 'pointer',
    accentColor: '#C61C71',
  },
  radioText: {
    flex: 1,
    fontSize: '14px',
    color: '#202124',
  },
  countBadge: {
    fontSize: '12px',
    color: '#5f6368',
    backgroundColor: '#f1f3f4',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #C61C71',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#5f6368',
    fontSize: '14px',
  },
  aiSummaryBox: {
    backgroundColor: '#fce8f3',
    border: '1px solid #f9d5e8',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  aiBadge: {
    backgroundColor: '#C61C71',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '12px',
    marginRight: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  aiTitle: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#202124',
    margin: 0,
  },
  aiText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#3c4043',
    margin: 0,
    whiteSpace: 'pre-line',
  },
  resultsSection: {
    marginTop: '20px',
  },
  resultCount: {
    fontSize: '14px',
    color: '#5f6368',
    marginBottom: '20px',
  },
  resultCard: {
    marginBottom: '30px',
  },
  resultHeader: {
    marginBottom: '4px',
  },
  resultUrl: {
    fontSize: '12px',
    color: '#5f6368',
    textDecoration: 'none',
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  resultTitle: {
    fontSize: '20px',
    color: '#C61C71',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '4px',
    fontWeight: '400',
  },
  resultMeta: {
    fontSize: '13px',
    color: '#5f6368',
    marginBottom: '8px',
  },
  resultSnippet: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#3c4043',
    margin: 0,
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  noResultsText: {
    fontSize: '18px',
    color: '#202124',
    marginBottom: '10px',
  },
  noResultsSuggestion: {
    fontSize: '14px',
    color: '#5f6368',
  },
}
