'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AdminChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId] = useState(() => Math.random().toString(36).substring(7))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reset session when component is mounted or user navigates away
  useEffect(() => {
    return () => {
      // Cleanup: reset session when navigating away
      resetSession()
    }
  }, [])

  const resetSession = () => {
    setMessages([])
    setInput('')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          sessionId,
          conversationHistory: messages
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err: any) {
      setError(err.message || 'Failed to get response')
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 800 }}>
      {/* Header */}
      <div style={{ 
        padding: 16, 
        borderBottom: '1px solid #e2e8f0',
        background: '#f8fafc',
        borderRadius: '8px 8px 0 0'
      }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1e293b' }}>
          Search Relevancy Assistant
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b' }}>
          Ask questions about search performance, query analysis, and relevancy tuning
        </p>
        <button
          onClick={resetSession}
          style={{
            marginTop: 8,
            padding: '6px 12px',
            background: '#ef4444',
            color: 'white',
            border: 0,
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500
          }}
        >
          Clear Session
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        background: '#ffffff'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: '#94a3b8',
            padding: '40px 20px',
            fontSize: 14
          }}>
            <p style={{ fontWeight: 500, marginBottom: 8 }}>Start a conversation</p>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              Ask me questions like:<br />
              "Show me queries with no results"<br />
              "Analyze search performance"<br />
              "How to improve relevancy?"
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: 8,
              background: msg.role === 'user' ? '#3b82f6' : '#f1f5f9',
              color: msg.role === 'user' ? 'white' : '#1e293b',
              fontSize: 14,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {msg.content}
            </div>
            <span style={{
              fontSize: 11,
              color: '#94a3b8',
              marginTop: 4,
              padding: '0 4px'
            }}>
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}

        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#64748b',
            fontSize: 14,
            padding: 16
          }}>
            <div style={{
              width: 12,
              height: 12,
              border: '2px solid #3b82f6',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span>Thinking...</span>
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 14px',
            background: '#fee2e2',
            color: '#b91c1c',
            borderRadius: 8,
            fontSize: 13,
            marginTop: 12
          }}>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        padding: 16,
        borderTop: '1px solid #e2e8f0',
        background: '#f8fafc',
        borderRadius: '0 0 8px 8px'
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about search performance, query analysis, or relevancy tuning..."
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: 6,
              fontSize: 14,
              outline: 'none'
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              padding: '10px 20px',
              background: loading || !input.trim() ? '#cbd5e1' : '#3b82f6',
              color: 'white',
              border: 0,
              borderRadius: 6,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 500
            }}
          >
            Send
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

