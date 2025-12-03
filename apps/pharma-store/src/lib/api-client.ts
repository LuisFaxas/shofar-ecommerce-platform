/**
 * Peptide API Client
 *
 * Wraps @shofar/api-client with the correct channel token for pharma-store.
 *
 * Per CLAUDE.md Peptide Addendum:
 * All Shop API calls must include header: vendure-token: peptide
 */

import { createShopClient, createAdminClient } from '@shofar/api-client';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';

/**
 * Channel token for PEPTIDES brand
 * This is sent as the 'vendure-token' header on all API requests
 */
const PEPTIDE_CHANNEL_TOKEN = 'peptide';

/**
 * Singleton instance of the Peptide shop client
 */
let peptideShopClientInstance: ApolloClient<NormalizedCacheObject> | null = null;

/**
 * Get the Peptide shop client (singleton)
 *
 * @returns Apollo Client configured for the peptide channel
 *
 * @example
 * ```typescript
 * const client = getPeptideClient();
 * const { data } = await client.query({ query: GET_PRODUCTS });
 * ```
 */
export function getPeptideClient(): ApolloClient<NormalizedCacheObject> {
  if (!peptideShopClientInstance) {
    peptideShopClientInstance = createShopClient({
      channelToken: PEPTIDE_CHANNEL_TOKEN,
      apiUrl: process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL,
      withCredentials: true,
    });
  }
  return peptideShopClientInstance;
}

/**
 * Create a new Peptide shop client instance (non-singleton)
 * Use this if you need a fresh client without caching
 *
 * @param options - Optional configuration overrides
 * @returns New Apollo Client instance
 */
export function createPeptideClient(options?: {
  apiUrl?: string;
  withCredentials?: boolean;
}): ApolloClient<NormalizedCacheObject> {
  return createShopClient({
    channelToken: PEPTIDE_CHANNEL_TOKEN,
    apiUrl: options?.apiUrl ?? process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL,
    withCredentials: options?.withCredentials ?? true,
  });
}

/**
 * Get a Peptide admin client for authenticated operations
 *
 * @param authToken - Admin authentication token
 * @returns Apollo Client configured for admin API with peptide channel
 *
 * @example
 * ```typescript
 * const adminClient = getPeptideAdminClient('auth-token-here');
 * const { data } = await adminClient.query({ query: GET_ADMIN_PRODUCTS });
 * ```
 */
export function getPeptideAdminClient(authToken: string): ApolloClient<NormalizedCacheObject> {
  return createAdminClient({
    channelToken: PEPTIDE_CHANNEL_TOKEN,
    authToken,
    apiUrl: process.env.VENDURE_ADMIN_API_URL,
    withCredentials: true,
  });
}

/**
 * Clear the cached client instance
 * Useful for testing or when configuration changes
 */
export function clearPeptideClient(): void {
  peptideShopClientInstance = null;
}

/**
 * Re-export the channel token for use in other modules
 */
export { PEPTIDE_CHANNEL_TOKEN };
