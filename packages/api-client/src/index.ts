// Client exports
export { createShopClient, toolyShopClient, futureShopClient, defaultShopClient } from './clients/shop-client';
export { createAdminClient, toolyAdminClient, futureAdminClient, defaultAdminClient } from './clients/admin-client';
export { VendureClientFactory, vendureClientFactory, getShopClient, getAdminClient } from './clients/client-factory';

// Type exports
export type { ShopClientConfig } from './clients/shop-client';
export type { AdminClientConfig } from './clients/admin-client';
export type { ChannelToken, ClientFactoryOptions } from './clients/client-factory';

// Re-export generated types (will be available after codegen)
export * from './generated/shop-types';
export * from './generated/admin-types';

// Helper function to get client with typed channel token
export function getClient(channelToken: 'tooly' | 'future' | 'default' = 'default') {
  return {
    shop: getShopClient(channelToken),
    admin: (authToken?: string) => getAdminClient(channelToken, authToken),
  };
}