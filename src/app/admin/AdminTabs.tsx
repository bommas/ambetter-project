'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const AdminIngest = dynamic(() => import('./AdminIngest'), { ssr: false })
const AdminCurations = dynamic(() => import('./AdminCurations'), { ssr: false })
const AdminBoosts = dynamic(() => import('./AdminBoosts'), { ssr: false })
const AdminIndices = dynamic(() => import('./AdminIndices'), { ssr: false })
const AdminChat = dynamic(() => import('./AdminChat'), { ssr: false })

export default function AdminTabs() {
  const [active, setActive] = useState<'ingest' | 'indices' | 'curations' | 'boosts' | 'chat'>('ingest')

  const tabStyle = (key: string) => ({
    padding: '8px 12px',
    display: 'inline-block',
    cursor: 'pointer',
    borderBottom: active === key ? '2px solid #C61C71' : '2px solid transparent',
    color: active === key ? '#C61C71' : '#334155'
  } as React.CSSProperties)

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
        <div style={tabStyle('ingest')} onClick={() => setActive('ingest')}>New Documents</div>
        <div style={tabStyle('indices')} onClick={() => setActive('indices')}>Indices</div>
        <div style={tabStyle('curations')} onClick={() => setActive('curations')}>Curations</div>
        <div style={tabStyle('boosts')} onClick={() => setActive('boosts')}>Boosting</div>
        <div style={tabStyle('chat')} onClick={() => setActive('chat')}>Chat Assistant</div>
      </div>

      {active === 'ingest' && (
        <section>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>New Documents</h2>
          <AdminIngest />
          <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>Runs the crawler and PDF extractor on the provided Ambetter URL.</p>
        </section>
      )}

      {active === 'indices' && (
        <section>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Index Management</h2>
          <AdminIndices />
          <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>Manage Elasticsearch indices and aliases for health plan data.</p>
        </section>
      )}

      {active === 'curations' && (
        <section>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Curations</h2>
          <AdminCurations />
        </section>
      )}

      {active === 'boosts' && (
        <section>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Boosting</h2>
          <AdminBoosts />
        </section>
      )}

      {active === 'chat' && (
        <section>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Search Relevancy Assistant</h2>
          <AdminChat />
        </section>
      )}
    </div>
  )
}


