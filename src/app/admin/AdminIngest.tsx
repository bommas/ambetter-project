'use client'

import { useState } from 'react'

export default function AdminIngest() {
  const [url, setUrl] = useState('')
  const [state, setState] = useState('')
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
        body: JSON.stringify({ url, state })
      })
      if (res.ok) {
        setStatus('Ingestion started/completed successfully.')
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
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input value={url} onChange={e => setUrl(e.target.value)} name="url" placeholder="https://www.ambetterhealth.com/en/fl/2025-brochures-epo/" style={{ flex: 1, height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px' }} />
      <input value={state} onChange={e => setState(e.target.value)} name="state" placeholder="FL" style={{ width: 80, height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px' }} />
      <button disabled={loading} type="submit" style={{ height: 36, padding: '0 12px', background: '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>{loading ? 'Ingesting...' : 'Ingest'}</button>
      {status && <span style={{ marginLeft: 8, fontSize: 12, color: '#64748b' }}>{status}</span>}
    </form>
  )
}


