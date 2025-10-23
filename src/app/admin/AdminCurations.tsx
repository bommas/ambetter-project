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

  const getPinsArray = () => pinsText.split(/\n+/).map(s => s.trim()).filter(Boolean)
  const getExcludesArray = () => excludesText.split(/\n+/).map(s => s.trim()).filter(Boolean)

  const movePin = (index: number, direction: number) => {
    const arr = getPinsArray()
    if (index + direction < 0 || index + direction >= arr.length) return
    const temp = arr[index]
    arr[index] = arr[index + direction]
    arr[index + direction] = temp
    setPinsText(arr.join('\n'))
  }

  const removePin = (index: number) => {
    const arr = getPinsArray()
    arr.splice(index, 1)
    setPinsText(arr.join('\n'))
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    try {
      const pins = getPinsArray()
      const excludes = getExcludesArray()
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* LEFT COLUMN: Query Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Query</label>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g., health plans for texas" style={{ width: '100%', height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px', fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Pinned URLs (one per line)</label>
            <textarea value={pinsText} onChange={e => setPinsText(e.target.value)} rows={6} placeholder="https://api.centene.com/...pdf" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 6, padding: 10, fontSize: 13, fontFamily: 'monospace' }} />
          </div>

          {/* Ordered Pins with Up/Down/Remove controls */}
          {getPinsArray().length > 0 && (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '8px 10px', fontSize: 12, fontWeight: 600, color: '#475569' }}>Pinned Order</div>
              <div style={{ maxHeight: 200, overflow: 'auto' }}>
                {getPinsArray().map((u, i) => (
                  <div key={u + i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <div style={{ fontSize: 12, color: '#334155', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={u}>
                      <span style={{ fontWeight: 600, color: '#0ea5e9', marginRight: 6 }}>{i + 1}.</span>
                      {u.split('/').pop()?.substring(0, 40)}...
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => movePin(i, -1)} disabled={i === 0} style={{ height: 26, padding: '0 8px', fontSize: 11, background: i === 0 ? '#f1f5f9' : '#e0f2fe', border: '1px solid #cbd5e1', borderRadius: 4, cursor: i === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
                      <button onClick={() => movePin(i, 1)} disabled={i === getPinsArray().length - 1} style={{ height: 26, padding: '0 8px', fontSize: 11, background: i === getPinsArray().length - 1 ? '#f1f5f9' : '#e0f2fe', border: '1px solid #cbd5e1', borderRadius: 4, cursor: i === getPinsArray().length - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
                      <button onClick={() => removePin(i)} style={{ height: 26, padding: '0 8px', fontSize: 11, background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 4, cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Exclude URLs (one per line)</label>
            <textarea value={excludesText} onChange={e => setExcludesText(e.target.value)} rows={4} placeholder="https://api.centene.com/...pdf" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 6, padding: 10, fontSize: 13, fontFamily: 'monospace' }} />
          </div>

          {error && <div style={{ color: '#b91c1c', fontSize: 12, padding: 8, background: '#fee2e2', borderRadius: 6 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 8 }}>
            <button disabled={saving || !query} onClick={onSave} style={{ height: 36, padding: '0 14px', background: saving || !query ? '#cbd5e1' : '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: saving || !query ? 'not-allowed' : 'pointer', fontWeight: 600 }}>{saving ? 'Saving...' : 'Save Curation'}</button>
            <button disabled={saving || !query} onClick={() => onDelete(query)} style={{ height: 36, padding: '0 14px', background: saving || !query ? '#fecaca' : '#ef4444', color: '#fff', border: 0, borderRadius: 6, cursor: saving || !query ? 'not-allowed' : 'pointer', fontWeight: 600 }}>Delete</button>
          </div>
        </div>

        {/* RIGHT COLUMN: Existing Curations + Query Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Existing Curations</div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, maxHeight: 280, overflow: 'auto' }}>
              {items.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No curations yet</div>
              ) : (
                items.map(item => (
                  <div key={item.id} style={{ padding: 10, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>{item.query}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                        {(item.pins || []).length} pins · {(item.excludes || []).length} excludes
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => onEdit(item)} style={{ height: 28, padding: '0 10px', fontSize: 12, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => onDelete(item.query)} style={{ height: 28, padding: '0 10px', fontSize: 12, background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
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
              }} style={{ height: 32, padding: '0 10px', fontSize: 12, background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer' }}>Delete All Curations</button>
            </div>
          </div>

          {/* Query Results Preview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <button onClick={runQuery} disabled={!query || loading} style={{ height: 32, padding: '0 12px', fontSize: 12, fontWeight: 600, background: !query || loading ? '#cbd5e1' : '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: !query || loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Searching…' : 'Run Query'}</button>
              <span style={{ fontSize: 11, color: '#64748b' }}>Preview top 10 results</span>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, maxHeight: 360, overflow: 'auto', background: '#fafafa' }}>
              {results.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Run a query to preview results</div>
              ) : (
                results.map((r, i) => {
                  const url = r.document_url || r.url
                  const isPinned = getPinsArray().includes(url)
                  const isExcluded = getExcludesArray().includes(url)
                  return (
                    <div key={r.id || url} style={{ padding: 10, borderBottom: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 12, color: '#0f172a', marginBottom: 2 }}>{r.plan_name || r.title || `Result ${i+1}`}</div>
                        <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={url}>{url}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Score: {r._score?.toFixed(2)}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button onClick={() => {
                          const lines = getPinsArray()
                          if (isPinned) {
                            setPinsText(lines.filter(l => l !== url).join('\n'))
                          } else {
                            setPinsText([url, ...lines].join('\n'))
                          }
                        }} style={{ height: 26, padding: '0 8px', fontSize: 11, fontWeight: 600, background: isPinned ? '#fee2e2' : '#ecfeff', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>{isPinned ? 'Unpin' : 'Pin Top'}</button>
                        <button onClick={() => {
                          const lines = getExcludesArray()
                          if (isExcluded) {
                            setExcludesText(lines.filter(l => l !== url).join('\n'))
                          } else {
                            setExcludesText([...lines, url].join('\n'))
                          }
                        }} style={{ height: 26, padding: '0 8px', fontSize: 11, fontWeight: 600, background: isExcluded ? '#fee2e2' : '#fef3c7', border: '1px solid #e2e8f0', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap' }}>{isExcluded ? 'Include' : 'Exclude'}</button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


