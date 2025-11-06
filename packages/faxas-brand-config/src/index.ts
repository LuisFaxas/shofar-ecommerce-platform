/**
 * FAXAS Store Brand Configuration Package
 * Handles brand resolution for fashion store (placeholder for future brands)
 */

export * from './types';
import type { BrandConfig, BrandResolution } from './types';
import { BrandKey } from './types';

// Brand configuration registry for FAXAS store
// Currently empty - will be populated with fashion brands
const brands: Record<string, BrandConfig> = {
  // Future fashion brands will be added here
};

// Host to brand mapping for FAXAS store brands
const hostToBrand: Map<string, string> = new Map([
  // Future fashion brand domains will be added here
  // Example: ['faxas.com', 'faxas_fashion'],
]);

/**
 * Get brand configuration by key
 */
export function getBrandByKey(key: string | BrandKey): BrandConfig | null {
  // Since BrandKey enum is empty, always return null
  console.warn(`[FAXAS Store] No brands configured yet. Requested: ${key}`);
  return null;
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
    return brands[brandKey] || null;
  }

  // Check if it's a subdomain of any configured domain
  for (const [domain, key] of hostToBrand.entries()) {
    if (hostname.endsWith(`.${domain}`) || hostname === domain) {
      return brands[key] || null;
    }
  }

  // Log unknown host for monitoring
  console.warn(`[FAXAS Store] Unknown host for brand resolution: ${host}`);
  return null;
}

/**
 * Get all available brand keys
 */
export function getAllBrandKeys(): BrandKey[] {
  // Return empty array since no brands are configured
  return [];
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
export function isValidBrandKey(_key: string): boolean {
  // Always false since no brands are configured
  return false;
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
 * Default/fallback brand for FAXAS store
 * Currently null as no brands are configured yet
 */
export const DEFAULT_BRAND = null;

/**
 * Get default brand configuration
 */
export function getDefaultBrand(): BrandConfig | null {
  // Return null until fashion brands are added
  return null;
}