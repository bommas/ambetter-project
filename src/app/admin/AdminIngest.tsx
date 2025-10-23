'use client'

import { useState } from 'react'

export default function AdminIngest() {
  const [url, setUrl] = useState('')
  const [state, setState] = useState('')
  const [version, setVersion] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, state, version })
      })
      if (res.ok) {
        const data = await res.json()
        setStatus(data.message || 'Ingestion started/completed successfully.')
      } else {
        const d = await res.json().catch(() => ({} as any))
        setStatus(d.error || 'Failed to start ingestion')
      }
    } catch (e: any) {
      setStatus(e.message || 'Failed to start ingestion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
          name="url" 
          placeholder="https://www.ambetterhealth.com/en/fl/2025-brochures-epo/" 
          required
          style={{ flex: 1, height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px' }} 
        />
        <input 
          value={state} 
          onChange={e => setState(e.target.value)} 
          name="state" 
          placeholder="FL" 
          required
          style={{ width: 80, height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px' }} 
        />
        <input 
          value={version} 
          onChange={e => setVersion(e.target.value)} 
          name="version" 
          placeholder="2025-11" 
          required
          style={{ width: 100, height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px' }} 
        />
        <button 
          disabled={loading} 
          type="submit" 
          style={{ height: 36, padding: '0 12px', background: '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Ingesting...' : 'Ingest'}
        </button>
      </form>
      {status && (
        <div style={{ 
          padding: 12, 
          background: status.includes('success') ? '#dcfce7' : '#fee2e2', 
          color: status.includes('success') ? '#166534' : '#b91c1c', 
          borderRadius: 6, 
          fontSize: 14 
        }}>
          {status}
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>
        <strong>Example:</strong> State: TX, Version: 2025-10 → Creates index: health-plans-tx-2025-10
      </div>
    </div>
  )
}


