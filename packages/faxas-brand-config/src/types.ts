/**
 * Brand keys enum - defines all available brands for FAXAS store (fashion)
 * This store is a placeholder for future fashion brands
 */
export enum BrandKey {
  // Future fashion brands will be added here
  // Examples: FAXAS_FASHION = 'faxas_fashion',
}

/**
 * Brand theme configuration
 */
export interface BrandTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  fontFamily: {
    sans: string;
    mono: string;
  };
  glassmorphism?: {
    enabled: boolean;
    opacity: number;
    blur: string;
  };
}

/**
 * Brand SEO configuration
 */
export interface BrandSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  twitterHandle?: string;
  structuredData?: Record<string, unknown>;
}

/**
 * Brand assets configuration
 */
export interface BrandAssets {
  logo: {
    light: string;
    dark: string;
    alt: string;
  };
  favicon: string;
  cdnPrefix?: string;
}

/**
 * Brand navigation configuration
 */
export interface BrandNavigation {
  mainMenu: {
    label: string;
    href: string;
    icon?: string;
  }[];
  footerLinks: {
    category: string;
    links: {
      label: string;
      href: string;
    }[];
  }[];
}

/**
 * Complete brand configuration
 */
export interface BrandConfig {
  key: BrandKey;
  name: string;
  displayName: string;
  domain: string;
  subdomains?: string[];
  channelToken: string;
  theme: BrandTheme;
  seo: BrandSEO;
  assets: BrandAssets;
  navigation: BrandNavigation;
  features?: Record<string, boolean>;
  analytics?: {
    gtmId?: string;
    gaId?: string;
    pixelId?: string;
  };
}

/**
 * Brand resolution result
 */
export interface BrandResolution {
  brand: BrandConfig;
  source: "env" | "host" | "cookie" | "fallback";
  timestamp: number;
}
