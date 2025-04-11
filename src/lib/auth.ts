import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'

type JwtPayload = {
  id: string
  email: string
  role: string
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export async function createToken(payload: JwtPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  })
}

export async function removeTokenCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

export async function getTokenFromCookie() {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function getCurrentUser() {
  const token = await getTokenFromCookie()
  if (!token) return null

  const payload = await verifyToken(token)
  return payload
} 
