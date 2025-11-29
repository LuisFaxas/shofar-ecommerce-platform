import { NextRequest, NextResponse } from 'next/server';

/**
 * Vendure Shop API Proxy
 *
 * Proxies requests to Vendure, injecting the channel token and forwarding cookies.
 * Rate-limiting will be added in Phase 7.
 */

const VENDURE_API = process.env.VENDURE_INTERNAL_URL || 'http://localhost:3001';
const MAX_BODY_SIZE = 1_000_000; // 1 MB

/**
 * POST /api/shop - Proxy GraphQL mutations/queries to Vendure
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Read and validate body size
    const body = await request.text();
    if (body.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request body too large' },
        { status: 413 }
      );
    }

    // Forward request to Vendure
    const response = await fetch(`${VENDURE_API}/shop-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'vendure-token': 'tooly', // Inject channel token
        Cookie: request.headers.get('cookie') || '',
      },
      body,
    });

    // Parse response
    const data = await response.json();
    const res = NextResponse.json(data, { status: response.status });

    // Forward Set-Cookie headers for session persistence
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.headers.set('set-cookie', setCookie);
    }

    return res;
  } catch (error) {
    console.error('[API Proxy] POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/shop - Support introspection queries
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Missing query parameter' },
        { status: 400 }
      );
    }

    // Forward request to Vendure
    const response = await fetch(
      `${VENDURE_API}/shop-api?query=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'vendure-token': 'tooly',
          Cookie: request.headers.get('cookie') || '',
        },
      }
    );

    const data = await response.json();
    const res = NextResponse.json(data, { status: response.status });

    // Forward Set-Cookie headers
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      res.headers.set('set-cookie', setCookie);
    }

    return res;
  } catch (error) {
    console.error('[API Proxy] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
