'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, width: 360, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 20 }}>Admin Login</h1>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#475569', marginBottom: 6 }}>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#475569', marginBottom: 6 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', height: 36, border: '1px solid #cbd5e1', borderRadius: 6, padding: '0 10px' }} />
        </div>
        {error && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 10 }}>{error}</div>}
        <button disabled={loading} type="submit" style={{ width: '100%', height: 38, background: '#C61C71', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}


