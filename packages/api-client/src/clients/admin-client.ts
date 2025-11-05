import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  NormalizedCacheObject,
} from '@apollo/client';

export interface AdminClientConfig {
  apiUrl?: string;
  channelToken?: string;
  authToken?: string;
  withCredentials?: boolean;
}

/**
 * Creates a typed Apollo Client for the Vendure Admin API
 */
export function createAdminClient(config: AdminClientConfig = {}): ApolloClient<NormalizedCacheObject> {
  const {
    apiUrl = process.env.NEXT_PUBLIC_VENDURE_ADMIN_API_URL || 'http://localhost:3001/admin-api',
    channelToken,
    authToken,
    withCredentials = true,
  } = config;

  // Create the HTTP link
  const httpLink = createHttpLink({
    uri: apiUrl,
    credentials: withCredentials ? 'include' : 'same-origin',
  });

  // Create middleware to add headers
  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => {
      const newHeaders = { ...headers };

      if (channelToken) {
        newHeaders['vendure-token'] = channelToken;
      }

      if (authToken) {
        newHeaders['Authorization'] = `Bearer ${authToken}`;
      }

      return { headers: newHeaders };
    });

    return forward(operation);
  });

  // Combine the links
  const link = ApolloLink.from([authMiddleware, httpLink]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Administrator: {
          keyFields: ['id'],
        },
        Role: {
          keyFields: ['id'],
        },
        Channel: {
          keyFields: ['id'],
        },
        Product: {
          keyFields: ['id'],
        },
        ProductVariant: {
          keyFields: ['id'],
        },
        Collection: {
          keyFields: ['id'],
        },
        Customer: {
          keyFields: ['id'],
        },
        Order: {
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

// Admin client instances for each channel
export const toolyAdminClient = createAdminClient({ channelToken: 'tooly' });
export const futureAdminClient = createAdminClient({ channelToken: 'future' });
export const defaultAdminClient = createAdminClient(); // Uses default channel