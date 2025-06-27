// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ DO NOT VERIFY THE TOKEN HERE (Edge Runtime limitation)
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/invoices/:path*', '/users/:path*'],
}
