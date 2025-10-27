'use client'

export default function ClearCookiesPage() {
  const clearAllCookies = () => {
    // Clear all cookies by setting them to expire
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      // Set cookie to expire in the past
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/admin`
    })
    alert('All cookies cleared! Redirecting to login...')
    window.location.href = '/admin/login'
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Clear All Cookies</h1>
      <p>This will clear all cookies and redirect you to the login page.</p>
      <button 
        onClick={clearAllCookies}
        style={{
          padding: '12px 24px',
          background: '#C61C71',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 600
        }}
      >
        Clear All Cookies & Logout
      </button>
    </div>
  )
}
