/**
 * SHOFAR Store Brand Configuration Package
 * Handles brand resolution for tools & hardware store
 */

export * from './types';
import type { BrandConfig, BrandResolution } from './types';
import { BrandKey } from './types';
import { toolyConfig } from './brands/tooly';

// Brand configuration registry for SHOFAR store
const brands: Record<BrandKey, BrandConfig> = {
  [BrandKey.TOOLY]: toolyConfig,
  // Future tool brands will be added here
};

// Host to brand mapping for SHOFAR store brands
const hostToBrand: Map<string, BrandKey> = new Map([
  // TOOLY domains
  ['tooly.com', BrandKey.TOOLY],
  ['www.tooly.com', BrandKey.TOOLY],
  ['shop.tooly.com', BrandKey.TOOLY],
  ['tools.tooly.com', BrandKey.TOOLY],
  ['tooly.localhost', BrandKey.TOOLY],
  ['localhost', BrandKey.TOOLY], // Default for development
  // Future tool brand domains will be added here
]);

/**
 * Get brand configuration by key
 */
export function getBrandByKey(key: string | BrandKey): BrandConfig | null {
  // Validate key
  if (!Object.values(BrandKey).includes(key as BrandKey)) {
    console.warn(`[SHOFAR Store] Invalid brand key: ${key}`);
    return null;
  }

  return brands[key as BrandKey] || null;
}

/**
 * Get brand configuration by host/domain
 */
export function getBrandByHost(host: string): BrandConfig | null {
  if (!host) {
    return null;
  }

  // Remove port if present
  const hostname = (host.split(':')[0] || host).toLowerCase();

  // Check exact match first
  const brandKey = hostToBrand.get(hostname);
  if (brandKey) {
    return brands[brandKey];
  }

  // Check if it's a subdomain of any configured domain
  for (const [domain, key] of hostToBrand.entries()) {
    if (hostname.endsWith(`.${domain}`) || hostname === domain) {
      return brands[key];
    }
  }

  // Log unknown host for monitoring
  console.warn(`[SHOFAR Store] Unknown host for brand resolution: ${host}`);
  return null;
}

/**
 * Get all available brand keys
 */
export function getAllBrandKeys(): BrandKey[] {
  return Object.values(BrandKey);
}

/**
 * Get all brand configurations
 */
export function getAllBrands(): BrandConfig[] {
  return Object.values(brands);
}

/**
 * Validate if a string is a valid brand key
 */
export function isValidBrandKey(key: string): key is BrandKey {
  return Object.values(BrandKey).includes(key as BrandKey);
}

/**
 * Get brand by channel token (Vendure integration)
 */
export function getBrandByChannelToken(token: string): BrandConfig | null {
  return Object.values(brands).find(brand => brand.channelToken === token) || null;
}

/**
 * Create a brand resolution result
 */
export function createBrandResolution(
  brand: BrandConfig | null,
  source: 'env' | 'host' | 'cookie' | 'fallback'
): BrandResolution | null {
  if (!brand) {
    return null;
  }

  return {
    brand,
    source,
    timestamp: Date.now()
  };
}

/**
 * Default/fallback brand for SHOFAR store
 */
export const DEFAULT_BRAND = BrandKey.TOOLY;

/**
 * Get default brand configuration
 */
export function getDefaultBrand(): BrandConfig {
  return brands[DEFAULT_BRAND];
}

/**
 * Export individual brand configs for direct access if needed
 */
export { toolyConfig } from './brands/tooly';