import posthog, { PostHog } from 'posthog-js';
import type { FeatureFlagAdapter, UserContext } from '../types';

export class PostHogAdapter implements FeatureFlagAdapter {
  private client: PostHog;

  constructor(
    apiKey: string,
    host = 'https://app.posthog.com',
    private userContext?: UserContext
  ) {
    if (typeof window !== 'undefined') {
      this.client = posthog.init(apiKey, {
        api_host: host,
        loaded: (posthog) => {
          if (this.userContext?.userId) {
            posthog.identify(this.userContext.userId, this.userContext.attributes);
          }
        },
      }) as PostHog;
    } else {
      // Server-side: we'll need to use posthog-node for this
      throw new Error('PostHog adapter currently only supports client-side usage');
    }
  }

  async isEnabled(flagKey: string, defaultValue = false): Promise<boolean> {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    const value = this.client.isFeatureEnabled(flagKey);
    return value ?? defaultValue;
  }

  async getVariant(flagKey: string, defaultValue?: string): Promise<string | null> {
    if (typeof window === 'undefined') {
      return defaultValue ?? null;
    }

    const value = this.client.getFeatureFlag(flagKey);
    if (typeof value === 'string') {
      return value;
    }
    return defaultValue ?? null;
  }

  async getAllFlags(): Promise<Record<string, boolean>> {
    if (typeof window === 'undefined') {
      return {};
    }

    const flags = this.client.isFeatureEnabled.toString();
    // PostHog doesn't provide a direct way to get all flags
    // This would need to be implemented with a custom API call
    console.warn('getAllFlags is not fully implemented for PostHog adapter');
    return {};
  }

  setUserContext(context: UserContext): void {
    this.userContext = context;
    if (context.userId && typeof window !== 'undefined') {
      this.client.identify(context.userId, context.attributes);
    }
  }
}