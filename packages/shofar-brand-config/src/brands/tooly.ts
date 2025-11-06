import type { BrandConfig } from '../types';
import { BrandKey } from '../types';

export const toolyConfig: BrandConfig = {
  key: BrandKey.TOOLY,
  name: 'tooly',
  displayName: 'TOOLY',
  domain: 'tooly.com',
  subdomains: ['www', 'shop', 'tools'],
  channelToken: 'tooly',

  theme: {
    primaryColor: '#FF6B35',  // Orange
    secondaryColor: '#004E89', // Blue
    accentColor: '#FFC107',    // Amber
    backgroundColor: '#FFFFFF',
    foregroundColor: '#1A1A1A',
    borderRadius: 'md',
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    glassmorphism: {
      enabled: true,
      opacity: 0.1,
      blur: 'md'
    }
  },

  seo: {
    title: 'TOOLY - Professional Tools & Equipment',
    description: 'Premium professional tools and equipment for contractors, builders, and DIY enthusiasts. Quality tools that last a lifetime.',
    keywords: [
      'professional tools',
      'power tools',
      'hand tools',
      'construction equipment',
      'tool shop',
      'contractor tools',
      'DIY tools'
    ],
    ogImage: '/images/tooly-og.jpg',
    twitterHandle: '@toolyshop',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Store',
      'name': 'TOOLY',
      'description': 'Professional tools and equipment retailer'
    }
  },

  assets: {
    logo: {
      light: '/logos/tooly-light.svg',
      dark: '/logos/tooly-dark.svg',
      alt: 'TOOLY - Professional Tools'
    },
    favicon: '/favicons/tooly.ico'
  },

  // Navigation will be defined in brand-specific frontend
  navigation: {
    mainMenu: [],
    footerLinks: []
  },

  // Features will be implemented per-brand as needed
  features: {},

  // Analytics will be configured when actually set up
  analytics: {}
};