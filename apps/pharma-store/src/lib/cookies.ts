/**
 * Cookie utilities for PEPTIDES pharma-store
 *
 * Security requirements (per CLAUDE.md Peptide Addendum):
 * - __Host- prefix for all cookies
 * - SameSite=Strict
 * - Secure=true
 * - httpOnly: true for session/cart, false for consent (client-readable)
 */

export const COOKIE_NAMES = {
  SESSION: '__Host-peptide-session',
  CART: '__Host-peptide-cart',
  CONSENT: '__Host-peptide-consent',
  VIEW_PREFERENCE: '__Host-peptide-view',
} as const;

export type CookieName = (typeof COOKIE_NAMES)[keyof typeof COOKIE_NAMES];

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge?: number;
}

/**
 * Cookie options by type
 * - session/cart: httpOnly for security
 * - consent/preferences: client-readable
 */
export const COOKIE_OPTIONS: Record<string, CookieOptions> = {
  session: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  cart: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  consent: {
    httpOnly: false, // Client needs to read this for consent banner
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
  preference: {
    httpOnly: false, // Client needs to read view preferences
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
};

/**
 * Get options for a specific cookie name
 */
export function getCookieOptions(cookieName: CookieName): CookieOptions {
  if (cookieName === COOKIE_NAMES.SESSION) {
    return COOKIE_OPTIONS.session;
  }
  if (cookieName === COOKIE_NAMES.CART) {
    return COOKIE_OPTIONS.cart;
  }
  if (cookieName === COOKIE_NAMES.CONSENT) {
    return COOKIE_OPTIONS.consent;
  }
  if (cookieName === COOKIE_NAMES.VIEW_PREFERENCE) {
    return COOKIE_OPTIONS.preference;
  }
  return COOKIE_OPTIONS.session; // Default to most secure
}

/**
 * Format cookie options for Set-Cookie header
 */
export function formatCookieOptions(options: CookieOptions): string {
  const parts: string[] = [];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  parts.push(`Path=${options.path}`);
  parts.push(`SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`);

  if (options.secure) {
    parts.push('Secure');
  }
  if (options.httpOnly) {
    parts.push('HttpOnly');
  }

  return parts.join('; ');
}

/**
 * Create a Set-Cookie header value
 */
export function createSetCookieHeader(
  name: CookieName,
  value: string,
  options?: Partial<CookieOptions>
): string {
  const defaultOptions = getCookieOptions(name);
  const mergedOptions = { ...defaultOptions, ...options };
  return `${name}=${encodeURIComponent(value)}; ${formatCookieOptions(mergedOptions)}`;
}

/**
 * Create a cookie deletion header (expires immediately)
 */
export function createDeleteCookieHeader(name: CookieName): string {
  return `${name}=; Path=/; Max-Age=0; SameSite=Strict; Secure`;
}

/**
 * Parse cookies from a cookie header string
 */
export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(';').forEach((cookie) => {
    const [name, ...valueParts] = cookie.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(valueParts.join('='));
    }
  });

  return cookies;
}

/**
 * Get a specific cookie value from a cookie header
 */
export function getCookieValue(cookieHeader: string, name: CookieName): string | undefined {
  const cookies = parseCookies(cookieHeader);
  return cookies[name];
}

/**
 * Check if consent cookie is set and valid
 */
export function hasConsent(cookieHeader: string): boolean {
  const consent = getCookieValue(cookieHeader, COOKIE_NAMES.CONSENT);
  return consent === 'true' || consent === 'accepted';
}
