import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  NormalizedCacheObject,
} from '@apollo/client';

export interface ShopClientConfig {
  apiUrl?: string;
  channelToken?: string;
  withCredentials?: boolean;
}

/**
 * Creates a typed Apollo Client for the Vendure Shop API
 */
export function createShopClient(config: ShopClientConfig = {}): ApolloClient<NormalizedCacheObject> {
  const {
    apiUrl = process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL || 'http://localhost:3001/shop-api',
    channelToken,
    withCredentials = true,
  } = config;

  // Create the HTTP link
  const httpLink = createHttpLink({
    uri: apiUrl,
    credentials: withCredentials ? 'include' : 'same-origin',
  });

  // Create middleware to add channel token if provided
  const authMiddleware = new ApolloLink((operation, forward) => {
    if (channelToken) {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          'vendure-token': channelToken,
        },
      }));
    }
    return forward(operation);
  });

  // Combine the links
  const link = ApolloLink.from([authMiddleware, httpLink]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Product: {
          keyFields: ['id'],
        },
        ProductVariant: {
          keyFields: ['id'],
        },
        Order: {
          keyFields: ['id'],
        },
        OrderLine: {
          keyFields: ['id'],
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
}

// Default shop client instances for each channel
export const toolyShopClient = createShopClient({ channelToken: 'tooly' });
export const futureShopClient = createShopClient({ channelToken: 'future' });
export const defaultShopClient = createShopClient(); // Uses default channel