/**
 * Minimal Middleware
 *
 * Brand resolution happens in brand-runtime.ts
 * This middleware is kept minimal for performance
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log unknown hosts for monitoring (only in production)
  if (process.env.NODE_ENV === 'production') {
    const host = request.headers.get('host');
    const knownHosts = [
      'tooly.com',
      'www.tooly.com',
      'shop.tooly.com',
      'peptides.com',
      'www.peptides.com',
      'shop.peptides.com'
    ];

    if (host && !knownHosts.some(known => host.includes(known))) {
      // In production, you'd send this to your monitoring service
      console.warn(`[Middleware] Unknown host accessed: ${host}`);
    }
  }

  // Pass through - brand resolution happens at runtime
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
};