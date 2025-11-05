import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createShopClient, ShopClientConfig } from './shop-client';
import { createAdminClient, AdminClientConfig } from './admin-client';

export type ChannelToken = 'tooly' | 'future' | 'default';

export interface ClientFactoryOptions {
  shopConfig?: Omit<ShopClientConfig, 'channelToken'>;
  adminConfig?: Omit<AdminClientConfig, 'channelToken'>;
}

/**
 * Factory class for creating typed Vendure API clients
 */
export class VendureClientFactory {
  private shopClients: Map<string, ApolloClient<NormalizedCacheObject>> = new Map();
  private adminClients: Map<string, ApolloClient<NormalizedCacheObject>> = new Map();
  private options: ClientFactoryOptions;

  constructor(options: ClientFactoryOptions = {}) {
    this.options = options;
  }

  /**
   * Get or create a Shop API client for a specific channel
   */
  getShopClient(channelToken: ChannelToken = 'default'): ApolloClient<NormalizedCacheObject> {
    const token = channelToken === 'default' ? '' : channelToken;

    if (!this.shopClients.has(token)) {
      const client = createShopClient({
        ...this.options.shopConfig,
        channelToken: token || undefined,
      });
      this.shopClients.set(token, client);
    }

    return this.shopClients.get(token)!;
  }

  /**
   * Get or create an Admin API client for a specific channel
   */
  getAdminClient(channelToken: ChannelToken = 'default', authToken?: string): ApolloClient<NormalizedCacheObject> {
    const token = channelToken === 'default' ? '' : channelToken;
    const key = `${token}-${authToken || 'no-auth'}`;

    if (!this.adminClients.has(key)) {
      const client = createAdminClient({
        ...this.options.adminConfig,
        channelToken: token || undefined,
        authToken,
      });
      this.adminClients.set(key, client);
    }

    return this.adminClients.get(key)!;
  }

  /**
   * Clear all cached clients
   */
  clearClients(): void {
    this.shopClients.clear();
    this.adminClients.clear();
  }

  /**
   * Clear cache for all clients
   */
  async clearAllCaches(): Promise<void> {
    const clearPromises: Promise<void>[] = [];

    this.shopClients.forEach((client) => {
      clearPromises.push(client.clearStore());
    });

    this.adminClients.forEach((client) => {
      clearPromises.push(client.clearStore());
    });

    await Promise.all(clearPromises);
  }
}

// Default factory instance
export const vendureClientFactory = new VendureClientFactory();

// Convenience functions
export function getShopClient(channelToken: ChannelToken = 'default'): ApolloClient<NormalizedCacheObject> {
  return vendureClientFactory.getShopClient(channelToken);
}

export function getAdminClient(channelToken: ChannelToken = 'default', authToken?: string): ApolloClient<NormalizedCacheObject> {
  return vendureClientFactory.getAdminClient(channelToken, authToken);
}