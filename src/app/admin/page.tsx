import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'

const AdminCurations = dynamic(() => import('./AdminCurations'), { ssr: false })
const AdminBoosts = dynamic(() => import('./AdminBoosts'), { ssr: false })
const AdminIngest = dynamic(() => import('./AdminIngest'), { ssr: false })

export default async function AdminHome() {
  const auth = (await cookies()).get('admin_auth')?.value
  if (!auth) {
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
        <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
          <a href="#tab-ingest" style={{ padding: '8px 12px', display: 'inline-block' }}>New Documents</a>
          <a href="#tab-curations" style={{ padding: '8px 12px', display: 'inline-block' }}>Curations</a>
          <a href="#tab-boosts" style={{ padding: '8px 12px', display: 'inline-block' }}>Boosting</a>
        </div>

        <section id="tab-ingest" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>New Documents</h2>
          <AdminIngest />
          <p style={{ color: '#64748b', fontSize: 12, marginTop: 6 }}>Runs the crawler and PDF extractor on the provided Ambetter URL.</p>
        </section>

        <section id="tab-curations" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Curations</h2>
          <AdminCurations />
        </section>

        <section id="tab-boosts">
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Boosting</h2>
          <AdminBoosts />
        </section>
      </div>
    </div>
  )
}


