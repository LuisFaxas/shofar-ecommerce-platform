// Client exports
export {
  createShopClient,
  toolyShopClient,
  futureShopClient,
  defaultShopClient,
} from "./clients/shop-client";
export {
  createAdminClient,
  toolyAdminClient,
  futureAdminClient,
  defaultAdminClient,
} from "./clients/admin-client";
export {
  VendureClientFactory,
  vendureClientFactory,
  getShopClient,
  getAdminClient,
} from "./clients/client-factory";

// Import for use in getClient helper
import { getShopClient, getAdminClient } from "./clients/client-factory";

// Type exports
export type { ShopClientConfig } from "./clients/shop-client";
export type { AdminClientConfig } from "./clients/admin-client";
export type {
  ChannelToken,
  ClientFactoryOptions,
} from "./clients/client-factory";

// Re-export generated types as namespaces to avoid conflicts
// Both shop-types and admin-types export many of the same type names
export * as ShopTypes from "./generated/shop-types";
export * as AdminTypes from "./generated/admin-types";

// Re-export commonly used Shop types directly for convenience
export type {
  Product,
  ProductVariant,
  Collection,
  Order,
  OrderLine,
  Customer,
  Address,
  Asset,
  SearchResult,
  SearchResponse,
} from "./generated/shop-types";

// Re-export TOOLY-specific queries and documents
export {
  GetToolyProductDocument,
  GetProductGalleryDocument,
  GetAccessoriesCollectionDocument,
} from "./generated/shop-types";

export type {
  GetToolyProductQuery,
  GetToolyProductQueryVariables,
  GetProductGalleryQuery,
  GetProductGalleryQueryVariables,
  GetAccessoriesCollectionQuery,
  GetAccessoriesCollectionQueryVariables,
} from "./generated/shop-types";

// Helper function to get client with typed channel token
// Uses the getShopClient and getAdminClient functions from client-factory
export function getClient(
  channelToken: "tooly" | "future" | "peptide" | "default" = "default",
): {
  shop: ReturnType<typeof getShopClient>;
  admin: (authToken?: string) => ReturnType<typeof getAdminClient>;
} {
  return {
    shop: getShopClient(channelToken),
    admin: (authToken?: string) => getAdminClient(channelToken, authToken),
  };
}
