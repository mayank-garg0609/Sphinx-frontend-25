// middleware.ts (in app root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const CSRF_SECRET = process.env.CSRF_SECRET || 'csrf-secret-key-change-in-production';

// Helper function to generate CSRF token
async function generateCSRFToken(): Promise<string> {
  const token = await new SignJWT({ purpose: 'csrf' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(CSRF_SECRET));
  
  return token;
}

// Helper function to verify CSRF token
async function verifyCSRFToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, new TextEncoder().encode(CSRF_SECRET));
    return true;
  } catch {
    return false;
  }
}

// Helper function to verify access token
async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Security headers for all requests
  const response = NextResponse.next();
  
  // Set security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://accounts.google.com " + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'),
    "frame-src 'self' https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);

  // Handle API routes
  if (pathname.startsWith('/api/auth/')) {
    return handleAuthAPI(request, response);
  }

  // Handle protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
    return handleProtectedRoute(request, response);
  }

  // Handle auth pages (redirect if already authenticated)
  if (pathname.startsWith('/login') || pathname.startsWith('/sign-up')) {
    return handleAuthPages(request, response);
  }

  return response;
}

async function handleAuthAPI(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;
  
  // CSRF Token endpoint
  if (pathname === '/api/auth/csrf-token' && request.method === 'GET') {
    const csrfToken = await generateCSRFToken();
    
    return NextResponse.json(
      { success: true, csrfToken },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(response.headers.entries()),
        },
      }
    );
  }

  // Store refresh token endpoint
  if (pathname === '/api/auth/store-refresh-token' && request.method === 'POST') {
    try {
      const { refreshToken } = await request.json();
      
      if (!refreshToken) {
        return NextResponse.json(
          { success: false, error: 'Refresh token required' },
          { status: 400 }
        );
      }

      const newResponse = NextResponse.json({ success: true });
      
      // Set httpOnly cookie for refresh token
      newResponse.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      // Copy security headers
      Object.entries(response.headers.entries()).forEach(([key, value]) => {
        newResponse.headers.set(key, value);
      });

      return newResponse;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      );
    }
  }

  // Refresh token endpoint
  if (pathname === '/api/auth/refresh' && request.method === 'POST') {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token not found'