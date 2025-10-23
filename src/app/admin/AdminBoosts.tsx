'use client'

import { useEffect, useState } from 'react'

interface BoostDoc { weights?: Record<string, number>; numeric_boosts?: { field: string; type: 'log'|'sigmoid'; factor?: number }[] }

export default function AdminBoosts() {
  const [doc, setDoc] = useState<BoostDoc>({ weights: {}, numeric_boosts: [] })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await fetch('/api/admin/boosts', { cache: 'no-store' })
      const data = await res.json()
      setDoc({ weights: data.weights || {}, numeric_boosts: data.numeric_boosts || [] })
    } catch (e) {
      // ignore
    }
  }

  useEffect(() => { load() }, [])

  const onAddNumeric = () => {
    setDoc(prev => ({ ...prev, numeric_boosts: [...(prev.numeric_boosts || []), { field: '', type: 'log', factor: 1 }] }))
  }

  const onSave = async () => {
    setSaving(true)
    setError('')
    try {
      const clean = {
        weights: doc.weights || {},
        numeric_boosts: (doc.numeric_boosts || []).filter(n => n.field && n.type)
      }
      const res = await fetch('/api/admin/boosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clean)
      })
      if (!res.ok) throw new Error('Save failed')
      await load()
    } catch (e: any) {
      setError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8 }}>Text Field Weights</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10 }}>
            {Object.entries(doc.weights || {}).map(([field, val]) => (
              <div key={field} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input value={field} disabled style={{ width: 240, height: 32, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 8px' }} />
                <input type="number" value={val as number} onChange={e => setDoc(prev => ({ ...prev, weights: { ...(prev.weights || {}), [field]: Number(e.target.value) } }))} style={{ width: 120, height: 32, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 8px' }} />
                <button onClick={() => setDoc(prev => { const nw = { ...(prev.weights || {}) }; delete nw[field]; return { ...prev, weights: nw } })} style={{ height: 32, padding: '0 10px' }}>Remove</button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="field name" id="new-weight-field" style={{ flex: 1, height: 32, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 8px' }} />
              <input placeholder="weight" id="new-weight-value" type="number" style={{ width: 140, height: 32, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 8px' }} />
              <button onClick={() => {
                const f = (document.getElementById('new-weight-field') as HTMLInputElement).value.trim()
                const v = Number((document.getElementById('new-weight-value') as HTMLInputElement).value)
                if (f && !Number.isNaN(v)) setDoc(prev => ({ ...prev, weights: { ...(prev.weights || {}), [f]: v } }))
              }}>Add</button>
            </div>
          </div>
        </div>
        <div>
          <h3 style={{ margin: 0, marginBottom: 8 }}>Numeric Boosts</h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: 10 }}>
            {(doc.numeric_boosts || []).map((nb, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input placeholder="field" value={nb.field} onChange={e => setDoc(prev => { const arr = [...(prev.numeric_boosts || [])]; arr[idx] = { ...arr[idx], field: e.target.value }; return { ...prev, numeric_boosts: arr } })} style={{ width: 240, height: 32, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 8px' }} />
                <select value={nb.type} onChange={e => setDoc(prev => { const arr = [...(prev.numeric_boosts || [])]; arr[idx] = { ...arr[idx], type: e.target.value as any }; return { ...prev, numeric_boosts: arr } })} style={{ height: 32, border: '1px solid #cbd5e1', borderRadius: 6 }}>
                  <option value="log">log</option>
                  <option value="sigmoid">sigmoid</option>
                </select>
                <input placeholder="factor" type="number" value={nb.factor ?? 1} onChange={e => setDoc(prev => { const arr = [...(prev.numeric_boosts || [])]; arr[idx] = { ...arr[idx], factor: Number(e.target.value) }; return { ...prev, numeric_boosts: arr } })} style={{ width: 120, height: 32, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 8px' }} />
                <button onClick={() => setDoc(prev => { const arr = [...(prev.numeric_boosts || [])]; arr.splice(idx, 1); return { ...prev, numeric_boosts: arr } })}>Remove</button>
              </div>
            ))}
            <button onClick={onAddNumeric}>Add numeric boost</button>
          </div>
        </div>
      </div>
      {error && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{error}</div>}
      <div style={{ marginTop: 10 }}>
        <button disabled={saving} onClick={onSave} style={{ height: 36, padding: '0 12px', background: '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </div>
  )
}


