'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [homeMode, setHomeMode] = useState<'semantic' | 'keyword'>('semantic')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}&mode=${homeMode}`)
    }
  }

  const quickSearches = [
    'preventive care',
    'emergency services', 
    'prescription coverage',
    'mental health',
    'maternity care'
  ]

  return (
    <div style={styles.container}>
      {/* Top Header Ribbon */}
      <div style={styles.headerRibbon}>
        <div style={styles.headerContent}>
          <div style={styles.logoContainer}>
            <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span style={styles.logoText}>Ambetter Health</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.searchContainer}>
          {/* Logo/Title */}
          <h1 style={styles.logo}>Ambetter Health</h1>
          <p style={styles.subtitle}>Powered by Elastic AI</p>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={{ ...styles.searchBox, position: 'relative' }}>
              <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for health plans, coverage, benefits..."
                style={styles.searchInput}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5f6368', cursor: 'pointer' }}>
                  <input type="radio" name="mode" value="semantic" checked={homeMode === 'semantic'} onChange={() => setHomeMode('semantic')} />
                  Semantic
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5f6368', cursor: 'pointer' }}>
                  <input type="radio" name="mode" value="keyword" checked={homeMode === 'keyword'} onChange={() => setHomeMode('keyword')} />
                  Keyword
                </label>
              </div>
              <button type="submit" style={styles.searchButton}>
                Search
              </button>
            </div>
          </form>

          {/* Quick Search Pills */}
          <div style={styles.pillContainer}>
            {quickSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => router.push(`/search?q=${encodeURIComponent(search)}`)}
                style={styles.pill}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Powered by Elasticsearch & OpenAI | 
          <a href="/analytics" style={styles.footerLink}> Analytics</a> | 
          <a href="/admin" style={styles.footerLink}> Admin</a>
        </p>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  headerRibbon: {
    backgroundColor: '#C61C71',
    padding: '12px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    color: '#ffffff',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  searchContainer: {
    width: '100%',
    maxWidth: '680px',
    textAlign: 'center',
  },
  logo: {
    fontSize: '64px',
    fontWeight: '400',
    color: '#C61C71',
    margin: '0 0 10px 0',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#5f6368',
    margin: '0 0 40px 0',
    fontWeight: '400',
  },
  searchForm: {
    marginBottom: '30px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '48px',
    border: '1px solid #dfe1e5',
    borderRadius: '24px',
    padding: '0 20px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 6px rgba(32,33,36,.28)',
    transition: 'box-shadow 0.2s',
  },
  searchIcon: {
    width: '20px',
    height: '20px',
    color: '#9aa0a6',
    marginRight: '12px',
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: '#202124',
    backgroundColor: 'transparent',
    padding: '0',
  },
  searchButton: {
    backgroundColor: '#C61C71',
    color: '#fff',
    border: 'none',
    borderRadius: '18px',
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginLeft: '8px',
    flexShrink: 0,
    transition: 'background-color 0.2s',
  },
  pillContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  pill: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#f3f4f6',
    color: '#5f6368',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: '400',
  },
  footer: {
    padding: '20px',
    textAlign: 'center',
    borderTop: '1px solid #e5e7eb',
  },
  footerText: {
    fontSize: '14px',
    color: '#5f6368',
    margin: 0,
  },
  footerLink: {
    color: '#C61C71',
    textDecoration: 'none',
    marginLeft: '5px',
  },
}
