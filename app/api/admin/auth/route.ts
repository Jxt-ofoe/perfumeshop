import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Passwords match, issue JWT
    const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);
    const alg = 'HS256';

    const jwt = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Create the response and set the cookie
    const response = NextResponse.json({ success: true });
    
    response.cookies.set({
      name: 'admin_token',
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
