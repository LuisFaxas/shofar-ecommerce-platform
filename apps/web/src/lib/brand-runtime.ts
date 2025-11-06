/**
 * Brand Runtime Resolution
 *
 * CRITICAL INVARIANTS:
 * 1. Mode A (Production): BRAND_KEY env var only → enables SSG/ISR
 * 2. Mode B (Staging): Host-based resolution → SSR only
 * 3. NO production cookies for brand switching
 * 4. Dev override via signed cookie ONLY if ALLOW_BRAND_COOKIE_OVERRIDE=true
 */

import type { BrandConfig } from '@shofar/brand-config';
import {
  BrandKey,
  getBrandByKey,
  getBrandByHost,
  getDefaultBrand,
  isValidBrandKey,
  createBrandResolution
} from '@shofar/brand-config';
import { headers, cookies } from 'next/headers';
import * as jose from 'jose';

// JWT secret for dev cookie override (only used in dev)
const getJwtSecret = (): Uint8Array => {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
};

/**
 * Resolve the current brand based on environment and request
 *
 * Resolution order:
 * 1. BRAND_KEY environment variable (Mode A - Production)
 * 2. Host-based resolution (Mode B - Staging/Multi-domain)
 * 3. Dev cookie override (ONLY if explicitly enabled)
 * 4. Default brand fallback
 */
export async function resolveBrand(): Promise<BrandConfig> {
  // Mode A: Fixed brand via environment variable (enables SSG/ISR)
  // This is the RECOMMENDED production mode - one deployment per brand
  if (process.env.BRAND_KEY) {
    const brand = getBrandByKey(process.env.BRAND_KEY);
    if (brand) {
      console.log(`[Brand] Resolved via BRAND_KEY env: ${brand.key}`);
      return brand;
    }
    console.warn(`[Brand] Invalid BRAND_KEY env: ${process.env.BRAND_KEY}`);
  }

  // Mode B: Dynamic resolution by host (SSR only)
  // Used for staging or multi-domain single deployment
  const host = headers().get('host');
  if (host) {
    const brand = getBrandByHost(host);
    if (brand) {
      console.log(`[Brand] Resolved via host '${host}': ${brand.key}`);
      return brand;
    }
    console.warn(`[Brand] Unknown host for brand resolution: ${host}`);
  }

  // Dev-only cookie override (NEVER use in production)
  // Only check if explicitly enabled via environment variable
  if (process.env.NODE_ENV === 'development' &&
      process.env.ALLOW_BRAND_COOKIE_OVERRIDE === 'true') {
    try {
      const cookieValue = cookies().get('brand-override')?.value;
      if (cookieValue) {
        // Verify JWT signature
        const secret = getJwtSecret();
        const { payload } = await jose.jwtVerify(cookieValue, secret);

        if (payload.brand && isValidBrandKey(payload.brand as string)) {
          const brand = getBrandByKey(payload.brand as BrandKey);
          if (brand) {
            console.log(`[Brand] DEV OVERRIDE via cookie: ${brand.key}`);
            return brand;
          }
        }
      }
    } catch (error) {
      console.error('[Brand] Failed to verify dev override cookie:', error);
      // Continue to fallback
    }
  }

  // Fallback to default brand
  const defaultBrand = getDefaultBrand();
  console.log(`[Brand] Using fallback brand: ${defaultBrand.key}`);
  return defaultBrand;
}

/**
 * Get brand-specific channel token for Vendure API
 */
export async function getBrandChannelToken(): Promise<string> {
  const brand = await resolveBrand();
  return brand.channelToken;
}

/**
 * Get brand-specific theme CSS variables
 */
export async function getBrandThemeVars(): Promise<Record<string, string>> {
  const brand = await resolveBrand();
  const { theme } = brand;

  return {
    '--brand-primary': theme.primaryColor,
    '--brand-secondary': theme.secondaryColor,
    '--brand-accent': theme.accentColor,
    '--brand-background': theme.backgroundColor,
    '--brand-foreground': theme.foregroundColor,
    '--brand-radius': theme.borderRadius,
    '--brand-font-sans': theme.fontFamily.sans,
    '--brand-font-mono': theme.fontFamily.mono,
    '--brand-glass-opacity': String(theme.glassmorphism?.opacity || 0.1),
    '--brand-glass-blur': theme.glassmorphism?.blur || 'md'
  };
}

/**
 * Create a signed JWT for dev brand override (DEV ONLY)
 */
export async function createBrandOverrideCookie(brandKey: BrandKey): Promise<string> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Brand override cookies are only available in development');
  }

  const secret = getJwtSecret();
  const jwt = await new jose.SignJWT({ brand: brandKey })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret);

  return jwt;
}

/**
 * Check if we're in SSG/ISR mode (Mode A)
 */
export function isBrandFixed(): boolean {
  return !!process.env.BRAND_KEY;
}

/**
 * Get the fixed brand key if in Mode A
 */
export function getFixedBrandKey(): BrandKey | null {
  if (process.env.BRAND_KEY && isValidBrandKey(process.env.BRAND_KEY)) {
    return process.env.BRAND_KEY as BrandKey;
  }
  return null;
}