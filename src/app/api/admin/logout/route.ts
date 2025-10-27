import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const loginUrl = new URL('/admin/login', request.url)
  const res = NextResponse.redirect(loginUrl, 303)
  res.cookies.set('admin_auth', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/', // Match the login route path
    maxAge: 0
  })
  return res
}


