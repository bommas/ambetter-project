'use client'

import { useEffect, useState } from 'react'

interface CurationItem { id: string; query: string; pins: string[]; updated_at?: string }

export default function AdminCurations() {
  const [items, setItems] = useState<CurationItem[]>([])
  const [query, setQuery] = useState('')
  const [pinsText, setPinsText] = useState('')
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
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    try {
      const pins = pinsText.split(/\n+/).map(s => s.trim()).filter(Boolean)
      const res = await fetch('/api/admin/curations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, pins })
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

  const onDelete = async (q: string) => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/curations?query=${encodeURIComponent(q)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      if (q === query) { setQuery(''); setPinsText('') }
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
        </div>
      </div>
    </div>
  )
}


