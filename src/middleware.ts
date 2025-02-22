import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // If the request is for an API route, return 401
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For other routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For API routes, just pass the token validation to the route handler
  if (request.nextUrl.pathname.startsWith('/api')) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-auth-token', token);
    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  // For page routes, redirect to login
  // The actual token verification will happen in the page
  return NextResponse.next();
} 