import { get } from '@vercel/edge-config';
import type { FeatureFlagAdapter } from '../types';

export class EdgeConfigAdapter implements FeatureFlagAdapter {
  constructor(private readonly configId?: string) {}

  async isEnabled(flagKey: string, defaultValue = false): Promise<boolean> {
    try {
      const value = await get<boolean>(flagKey);
      return value ?? defaultValue;
    } catch (error) {
      console.error(`Error fetching flag ${flagKey} from Edge Config:`, error);
      return defaultValue;
    }
  }

  async getVariant(flagKey: string, defaultValue?: string): Promise<string | null> {
    try {
      const value = await get<string>(flagKey);
      return value ?? defaultValue ?? null;
    } catch (error) {
      console.error(`Error fetching variant ${flagKey} from Edge Config:`, error);
      return defaultValue ?? null;
    }
  }

  async getAllFlags(): Promise<Record<string, boolean>> {
    try {
      const all = await get<Record<string, unknown>>();
      const flags: Record<string, boolean> = {};

      if (all) {
        Object.entries(all).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            flags[key] = value;
          }
        });
      }

      return flags;
    } catch (error) {
      console.error('Error fetching all flags from Edge Config:', error);
      return {};
    }
  }
}