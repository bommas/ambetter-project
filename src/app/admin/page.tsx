import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'

const AdminTabs = dynamic(() => import('./AdminTabs'), { ssr: false })

export default async function AdminHome() {
  const authCookie = (await cookies()).get('admin_auth')
  
  // Check if authenticated
  if (!authCookie || authCookie.value !== '1') {
    redirect('/admin/login')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Admin Dashboard</h1>
      <p style={{ color: '#475569', marginBottom: 16 }}>Welcome, admin.</p>
      <form action="/api/admin/logout" method="POST">
        <button type="submit" style={{ height: 36, padding: '0 12px', background: '#C61C71', color: '#fff', border: 0, borderRadius: 6, cursor: 'pointer' }}>Logout</button>
      </form>
      <div style={{ marginTop: 24 }}>
        <AdminTabs />
      </div>
    </div>
  )
}


