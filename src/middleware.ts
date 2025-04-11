import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTokenFromCookie, verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth/login']
  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Check if the route requires authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify the token
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 
