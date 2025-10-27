'use client'

import { useState, useEffect } from 'react'

interface IndexInfo {
  name: string
  docCount: number
  size: string
  createdDate: string
  inAlias: boolean
  health: 'green' | 'yellow' | 'red'
}

export default function AdminIndices() {
  const [indices, setIndices] = useState<IndexInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchIndices()
  }, [])

  const fetchIndices = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/indices', {
        credentials: 'include' // Send cookies with the request
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch indices')
      }
      
      setIndices(data.indices || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (indexName: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/indices/${encodeURIComponent(indexName)}`, {
        method: 'DELETE',
        credentials: 'include' // Send cookies with the request
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete index')
      }
      
      // Refresh the list
      await fetchIndices()
      setDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAliasToggle = async (indexName: string, currentlyInAlias: boolean) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/aliases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: currentlyInAlias ? 'remove' : 'add',
          index: indexName,
          alias: 'health-plans'
        }),
        credentials: 'include' // Send cookies with the request
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update alias')
      }
      
      // Refresh the list
      await fetchIndices()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'green': return '#10b981'
      case 'yellow': return '#f59e0b'
      case 'red': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Index Management</h2>
        <button
          onClick={fetchIndices}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: '#0ea5e9',
            color: '#fff',
            border: 0,
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div style={{
          padding: 12,
          background: '#fee2e2',
          color: '#b91c1c',
          borderRadius: 6,
          marginBottom: 16,
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      <div style={{
        border: '1px solid #e2e8f0',
        borderRadius: 6,
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 1fr 1fr 1.5fr 1fr 2fr',
          gap: 8,
          padding: '12px 16px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: 12,
          fontWeight: 600,
          color: '#475569'
        }}>
          <div>Index Name</div>
          <div>Documents</div>
          <div>Size</div>
          <div>Created</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Rows */}
        <div style={{ maxHeight: 500, overflow: 'auto' }}>
          {indices.length === 0 && !loading && (
            <div style={{
              padding: 32,
              textAlign: 'center',
              color: '#64748b',
              fontSize: 14
            }}>
              No indices found matching pattern "health-plans-*"
            </div>
          )}

          {indices.map((index) => (
            <div
              key={index.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr 1fr 1.5fr 1fr 2fr',
                gap: 8,
                padding: '12px 16px',
                borderBottom: '1px solid #f1f5f9',
                alignItems: 'center',
                fontSize: 13
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 500 }}>{index.name}</span>
                {index.inAlias && (
                  <span style={{
                    padding: '2px 8px',
                    background: '#dbeafe',
                    color: '#1e40af',
                    fontSize: 11,
                    borderRadius: 4,
                    fontWeight: 600
                  }}>
                    ALIAS
                  </span>
                )}
              </div>
              <div>{index.docCount.toLocaleString()}</div>
              <div>{index.size}</div>
              <div>{new Date(index.createdDate).toLocaleDateString()}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: getHealthColor(index.health)
                  }}
                />
                <span style={{ textTransform: 'capitalize' }}>{index.health}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleAliasToggle(index.name, index.inAlias)}
                  disabled={loading}
                  style={{
                    padding: '6px 12px',
                    background: index.inAlias ? '#fee2e2' : '#dbeafe',
                    color: index.inAlias ? '#b91c1c' : '#1e40af',
                    border: 0,
                    borderRadius: 4,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: 12,
                    fontWeight: 500
                  }}
                >
                  {index.inAlias ? 'Remove Alias' : 'Add Alias'}
                </button>
                {/* Prevent deletion of indices that are in the health-plans alias */}
                {index.inAlias && (
                  <span style={{
                    padding: '6px 12px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: 0,
                    borderRadius: 4,
                    fontSize: 12,
                    fontStyle: 'italic'
                  }}>
                    Protected
                  </span>
                )}
                {!index.inAlias && (
                  <button
                    onClick={() => setDeleteConfirm(index.name)}
                    disabled={loading}
                    style={{
                      padding: '6px 12px',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      border: 0,
                      borderRadius: 4,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: 12,
                      fontWeight: 500
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: 24,
            borderRadius: 8,
            maxWidth: 500,
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600 }}>
              Confirm Deletion
            </h3>
            <p style={{ margin: '0 0 20px 0', color: '#475569', fontSize: 14 }}>
              Are you sure you want to delete index <strong>{deleteConfirm}</strong>?
              This action cannot be undone and will permanently delete all documents in this index.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '8px 16px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 0,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  padding: '8px 16px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 0,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Delete Index
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

