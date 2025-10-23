'use client'

import { useEffect, useState } from 'react'

interface BoostDoc { weights?: Record<string, number>; numeric_boosts?: { field: string; type: 'log'|'sigmoid'; factor?: number }[] }
interface FieldInfo { name: string; type: string }

export default function AdminBoosts() {
  const [doc, setDoc] = useState<BoostDoc>({ weights: {}, numeric_boosts: [] })
  const [saving, setSaving] = useState(false)
  const [fields, setFields] = useState<FieldInfo[]>([])
  const [error, setError] = useState('')
  const numericTypes = new Set(['long','integer','float','double','date'])

  const load = async () => {
    try {
      const res = await fetch('/api/admin/boosts', { cache: 'no-store' })
      const data = await res.json()
      setDoc({ weights: data.weights || {}, numeric_boosts: data.numeric_boosts || [] })
    } catch (e) {
      // ignore
    }
    try {
      const res2 = await fetch('/api/admin/boosts/fields', { cache: 'no-store' })
      const data2 = await res2.json()
      setFields(data2.fields || [])
    } catch (e) { /* ignore */ }
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
      <div style={{ border: '1px solid #e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, background: '#f8fafc', padding: '8px 10px', borderBottom: '1px solid #e2e8f0', fontSize: 12, color: '#475569' }}>
          <div>Field (type)</div>
          <div>Text weight</div>
          <div>Numeric boost</div>
          <div>Factor</div>
        </div>
        <div style={{ maxHeight: 480, overflow: 'auto' }}>
          {fields.map((f) => {
            const isText = f.type === 'text' || f.type === 'keyword'
            const isNum = numericTypes.has(f.type)
            const weightVal = (doc.weights || {})[f.name] ?? (isText ? 1 : '')
            const nb = (doc.numeric_boosts || []).find(b => b.field === f.name)
            const nbType = nb?.type || ''
            const nbFactor = nb?.factor ?? ''
            return (
              <div key={f.name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, alignItems: 'center', padding: '8px 10px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 600 }}>{f.name}</div>
                  <div style={{ color: '#64748b' }}>{f.type}</div>
                </div>
                <div>
                  <input
                    disabled={!isText}
                    value={weightVal as any}
                    onChange={e => {
                      const v = e.target.value
                      setDoc(prev => {
                        const weights = { ...(prev.weights || {}) }
                        if (!isText || v === '' || Number.isNaN(Number(v))) delete weights[f.name]
                        else weights[f.name] = Number(v)
                        return { ...prev, weights }
                      })
                    }}
                    placeholder={isText ? '1.0' : 'N/A'}
                    style={{ width: '90%', height: 32, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 8px', background: isText ? '#fff' : '#f1f5f9' }}
                  />
                </div>
                <div>
                  <select
                    disabled={!isNum}
                    value={nbType}
                    onChange={e => {
                      const t = e.target.value as any
                      setDoc(prev => {
                        const arr = [...(prev.numeric_boosts || [])]
                        const idx = arr.findIndex(b => b.field === f.name)
                        if (!t) {
                          if (idx >= 0) arr.splice(idx, 1)
                        } else {
                          if (idx >= 0) arr[idx] = { ...arr[idx], field: f.name, type: t }
                          else arr.push({ field: f.name, type: t, factor: 1 })
                        }
                        return { ...prev, numeric_boosts: arr }
                      })
                    }}
                    style={{ width: '90%', height: 32, border: '1px solid #cbd5e1', borderRadius: 6, background: isNum ? '#fff' : '#f1f5f9' }}
                  >
                    <option value="">None</option>
                    <option value="log">log</option>
                    <option value="sigmoid">sigmoid</option>
                  </select>
                </div>
                <div>
                  <input
                    disabled={!isNum || !nbType}
                    value={nbFactor as any}
                    onChange={e => {
                      const v = Number(e.target.value)
                      setDoc(prev => {
                        const arr = [...(prev.numeric_boosts || [])]
                        const idx = arr.findIndex(b => b.field === f.name)
                        if (idx >= 0) arr[idx] = { ...arr[idx], factor: Number.isNaN(v) ? undefined : v }
                        else if (nbType) arr.push({ field: f.name, type: nbType as any, factor: Number.isNaN(v) ? undefined : v })
                        return { ...prev, numeric_boosts: arr }
                      })
                    }}
                    placeholder={isNum ? '1.0' : 'N/A'}
                    style={{ width: '90%', height: 32, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 8px', background: (isNum && nbType) ? '#fff' : '#f1f5f9' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {error && <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{error}</div>}
      <div style={{ marginTop: 10 }}>
        <button disabled={saving} onClick={onSave} style={{ height: 36, padding: '0 12px', background: '#0ea5e9', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save Changes'}</button>
      </div>
    </div>
  )
}


