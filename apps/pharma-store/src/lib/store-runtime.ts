/**
 * PHARMA Store Runtime Resolution
 * Handles brand resolution for medical & research store
 *
 * CRITICAL INVARIANTS:
 * 1. Mode A (Production): BRAND_KEY env var only → enables SSG/ISR
 * 2. Mode B (Staging): Host-based resolution → SSR only
 * 3. NO production cookies for brand switching
 * 4. Dev override via signed cookie ONLY if ALLOW_BRAND_COOKIE_OVERRIDE=true
 */

import type { BrandConfig } from '@shofar/pharma-brand-config';
import {
  BrandKey,
  getBrandByKey,
  getBrandByHost,
  getDefaultBrand,
  isValidBrandKey,
  createBrandResolution
} from '@shofar/pharma-brand-config';
import { headers, cookies } from 'next/headers';
import * as jose from 'jose';

const getJwtSecret = (): Uint8Array => {
  const secret = process.env.JWT_SECRET || 'pharma-dev-secret-change-in-production';
  return new TextEncoder().encode(secret);
};

export async function resolveBrand(): Promise<BrandConfig> {
  // Mode A: Fixed brand via environment variable (enables SSG/ISR)
  if (process.env.BRAND_KEY) {
    const brand = getBrandByKey(process.env.BRAND_KEY);
    if (brand) {
      console.log(`[PHARMA Store] Resolved via BRAND_KEY env: ${brand.key}`);
      return brand;
    }
    console.warn(`[PHARMA Store] Invalid BRAND_KEY env: ${process.env.BRAND_KEY}`);
  }

  // Mode B: Dynamic resolution by host (SSR only)
  const headersList = await headers();
  const host = headersList.get('host');
  if (host) {
    const brand = getBrandByHost(host);
    if (brand) {
      console.log(`[PHARMA Store] Resolved via host '${host}': ${brand.key}`);
      return brand;
    }
    console.warn(`[PHARMA Store] Unknown host for brand resolution: ${host}`);
  }

  // Dev-only cookie override (NEVER use in production)
  if (process.env.NODE_ENV === 'development' &&
      process.env.ALLOW_BRAND_COOKIE_OVERRIDE === 'true') {
    try {
      const cookieStore = await cookies();
      const cookieValue = cookieStore.get('pharma-brand-override')?.value;
      if (cookieValue) {
        const secret = getJwtSecret();
        const { payload } = await jose.jwtVerify(cookieValue, secret);

        if (payload.brand && isValidBrandKey(payload.brand as string)) {
          const brand = getBrandByKey(payload.brand as BrandKey);
          if (brand) {
            console.log(`[PHARMA Store] DEV OVERRIDE via cookie: ${brand.key}`);
            return brand;
          }
        }
      }
    } catch (error) {
      console.error('[PHARMA Store] Failed to verify dev override cookie:', error);
    }
  }

  // Fallback to default brand (PEPTIDES)
  const defaultBrand = getDefaultBrand();
  console.log(`[PHARMA Store] Using fallback brand: ${defaultBrand.key}`);
  return defaultBrand;
}

export async function getBrandChannelToken(): Promise<string> {
  const brand = await resolveBrand();
  return brand.channelToken;
}

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

export function isBrandFixed(): boolean {
  return !!process.env.BRAND_KEY;
}

export function getFixedBrandKey(): BrandKey | null {
  if (process.env.BRAND_KEY && isValidBrandKey(process.env.BRAND_KEY)) {
    return process.env.BRAND_KEY as BrandKey;
  }
  return null;
}