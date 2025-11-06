/**
 * Test API route for brand resolution
 * Access at: /api/test-brand
 */

import { NextResponse } from 'next/server';
import { resolveBrand, getBrandChannelToken, isBrandFixed } from '@/lib/brand-runtime';

export async function GET() {
  try {
    const brand = await resolveBrand();
    const channelToken = await getBrandChannelToken();
    const isFixed = isBrandFixed();

    return NextResponse.json({
      success: true,
      brand: {
        key: brand.key,
        name: brand.name,
        displayName: brand.displayName,
        domain: brand.domain,
        channelToken: channelToken
      },
      mode: isFixed ? 'Mode A (Fixed via BRAND_KEY)' : 'Mode B (Dynamic via host)',
      environment: {
        BRAND_KEY: process.env.BRAND_KEY || 'not set',
        NODE_ENV: process.env.NODE_ENV,
        ALLOW_BRAND_COOKIE_OVERRIDE: process.env.ALLOW_BRAND_COOKIE_OVERRIDE || 'not set'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}