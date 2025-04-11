import { NextResponse } from 'next/server'
import { login } from '@/services/requests/auth'
import { setTokenCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    const response = await login(email, password);
    const { access_token, user } = response;
    
    if (!!access_token && !!user) {
      setTokenCookie(access_token)

      return NextResponse.json({ 
        success: true,
        user: user,
      })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
