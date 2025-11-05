import { EdgeConfigAdapter } from './adapters/edge-config-adapter';
import { PostHogAdapter } from './adapters/posthog-adapter';
import type { FeatureFlagAdapter, FeatureFlagConfig, UserContext } from './types';

export * from './types';
export { EdgeConfigAdapter } from './adapters/edge-config-adapter';
export { PostHogAdapter } from './adapters/posthog-adapter';

class FeatureFlags {
  private adapter: FeatureFlagAdapter;

  constructor(config: FeatureFlagConfig) {
    switch (config.adapter) {
      case 'edge-config':
        this.adapter = new EdgeConfigAdapter(config.edgeConfigId);
        break;
      case 'posthog':
        if (!config.posthogApiKey) {
          throw new Error('PostHog API key is required');
        }
        this.adapter = new PostHogAdapter(
          config.posthogApiKey,
          config.posthogHost,
          config.userContext
        );
        break;
      default:
        throw new Error(`Unsupported adapter: ${config.adapter}`);
    }
  }

  async isEnabled(flagKey: string, defaultValue?: boolean): Promise<boolean> {
    return this.adapter.isEnabled(flagKey, defaultValue);
  }

  async getVariant(flagKey: string, defaultValue?: string): Promise<string | null> {
    return this.adapter.getVariant(flagKey, defaultValue);
  }

  async getAllFlags(): Promise<Record<string, boolean>> {
    return this.adapter.getAllFlags();
  }

  setUserContext(context: UserContext): void {
    if ('setUserContext' in this.adapter) {
      (this.adapter as PostHogAdapter).setUserContext(context);
    }
  }
}

export default FeatureFlags;