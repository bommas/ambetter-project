'use client'

import { useEffect, useState } from 'react'

interface CurationItem { id: string; query: string; pins: string[]; excludes?: string[]; updated_at?: string }

export default function AdminCurations() {
  const [items, setItems] = useState<CurationItem[]>([])
  const [query, setQuery] = useState('')
  const [pinsText, setPinsText] = useState('')
  const [excludesText, setExcludesText] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await fetch('/api/admin/curations', { cache: 'no-store' })
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { load() }, [])

  const onEdit = (item: CurationItem) => {
    setQuery(item.query)
    setPinsText((item.pins || []).join('\n'))
    setExcludesText((item.excludes || []).join('\n'))
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    try {
      const pins = pinsText.split(/\n+/).map(s => s.trim()).filter(Boolean)
      const excludes = excludesText.split(/\n+/).map(s => s.trim()).filter(Boolean)
      const res = await fetch('/api/admin/curations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, pins, excludes })
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Save failed')
      }
      await load()
    } catch (e: any) {
      setError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const runQuery = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, page: 1, limit: 10 })
      })
      const data = await res.json()
      setResults(data.results || [])
    } catch (e: any) {
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (q: string) => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/curations?query=${encodeURIComponent(q)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      if (q === query) { setQuery(''); setPinsText(''); setExcludesText('') }
      await load()
    } catch (e: any) {
      setError(e.message || 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#475569', marginBottom: 6 }}>Query</label>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g., health plans for texas" style={{ width: '100%', height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px' }} />
          <label style={{ display: 'block', fontSize: 12, color: '#475569', margin: '12px 0 6px' }}>Pinned URLs (one per line)</label>
          <textarea value={pinsText} onChange={e => setPinsText(e.target.value)} rows={8} placeholder="https://api.centene.com/...pdf" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 6, padding: 10 }} />
          <label style={{ display: 'block', fontSize: 12, color: '#475569', margin: '12px 0 6px' }}>Exclude URLs (one per line)</label>
          <textarea value={excludesText} onChange={e => setExcludesText(e.target.value)} rows={6} placeholder="https://api.centene.com/...pdf" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 6, padding: 10 }} />
          {error && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{error}</div>}
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button disabled={saving} onClick={onSave} style={{ height: 36, padding: '0 12px', background: '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
            <button disabled={saving || !query} onClick={() => onDelete(query)} style={{ height: 36, padding: '0 12px', background: '#ef4444', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Existing Curations</div>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, maxHeight: 300, overflow: 'auto' }}>
            {items.map(item => (
              <div key={item.id} style={{ padding: 10, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.query}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{(item.pins || []).length} pins</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onEdit(item)} style={{ height: 30, padding: '0 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => onDelete(item.query)} style={{ height: 30, padding: '0 10px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={async () => {
              if (!confirm('Delete ALL curations and restore default Elastic behaviour?')) return
              setSaving(true)
              try {
                const res = await fetch('/api/admin/curations?all=true', { method: 'DELETE' })
                if (!res.ok) throw new Error('Delete all failed')
                setQuery(''); setPinsText(''); setExcludesText('')
                await load()
              } catch (e:any) {
                setError(e.message || 'Delete all failed')
              } finally { setSaving(false) }
            }} style={{ height: 32, padding: '0 10px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer' }}>Delete All Curations</button>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <button onClick={runQuery} disabled={!query || loading} style={{ height: 32, padding: '0 10px', background: '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>{loading ? 'Searching…' : 'Run Query'}</button>
              <span style={{ fontSize: 12, color: '#64748b' }}>Preview top 10 results and click to pin.</span>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, maxHeight: 320, overflow: 'auto' }}>
              {results.map((r, i) => {
                const url = r.document_url || r.url
                const isPinned = pinsText.split(/\n+/).some(line => line.trim() === url)
                const isExcluded = excludesText.split(/\n+/).some(line => line.trim() === url)
                return (
                  <div key={r.id || url} style={{ padding: 10, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12 }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.plan_name || r.title || `Result ${i+1}`}</div>
                      <div style={{ color: '#475569' }}>{url}</div>
                      <div style={{ color: '#64748b' }}>Score: {r._score}</div>
                    </div>
                    <div>
                      <button onClick={() => {
                        const lines = pinsText.split(/\n+/).map(s => s.trim()).filter(Boolean)
                        if (isPinned) {
                          setPinsText(lines.filter(l => l !== url).join('\n'))
                        } else {
                          setPinsText([...lines, url].join('\n'))
                        }
                      }} style={{ height: 30, padding: '0 10px', background: isPinned ? '#fee2e2' : '#ecfeff', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', marginRight: 8 }}>{isPinned ? 'Unpin' : 'Pin'}</button>
                      <button onClick={() => {
                        const lines = excludesText.split(/\n+/).map(s => s.trim()).filter(Boolean)
                        if (isExcluded) {
                          setExcludesText(lines.filter(l => l !== url).join('\n'))
                        } else {
                          setExcludesText([...lines, url].join('\n'))
                        }
                      }} style={{ height: 30, padding: '0 10px', background: isExcluded ? '#fee2e2' : '#fafaf9', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer' }}>{isExcluded ? 'Unexclude' : 'Exclude'}</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


