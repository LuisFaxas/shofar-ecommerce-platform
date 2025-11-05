export interface FeatureFlagAdapter {
  isEnabled(flagKey: string, defaultValue?: boolean): Promise<boolean>;
  getVariant(flagKey: string, defaultValue?: string): Promise<string | null>;
  getAllFlags(): Promise<Record<string, boolean>>;
}

export interface UserContext {
  userId?: string;
  email?: string;
  attributes?: Record<string, unknown>;
}

export type FeatureFlagConfig = {
  adapter: 'edge-config' | 'posthog' | 'multi';
  edgeConfigId?: string;
  posthogApiKey?: string;
  posthogHost?: string;
  userContext?: UserContext;
};