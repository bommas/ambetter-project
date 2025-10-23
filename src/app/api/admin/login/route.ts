import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ ok: true })
      // Set auth cookie scoped to /admin
      res.cookies.set('admin_auth', '1', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/admin',
        maxAge: 60 * 60 * 8 // 8 hours
      })
      return res
    }

    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })

  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
  }
}


