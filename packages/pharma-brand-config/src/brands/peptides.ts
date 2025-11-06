import type { BrandConfig } from '../types';
import { BrandKey } from '../types';

export const peptidesConfig: BrandConfig = {
  key: BrandKey.PEPTIDES,
  name: 'peptides',
  displayName: 'PEPTIDES',
  domain: 'peptides.com',
  subdomains: ['www', 'shop', 'research'],
  channelToken: 'future',  // Using 'future' channel for now

  theme: {
    primaryColor: '#6366F1',   // Indigo
    secondaryColor: '#8B5CF6', // Purple
    accentColor: '#10B981',    // Emerald
    backgroundColor: '#FAFAFA',
    foregroundColor: '#111827',
    borderRadius: 'lg',
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'SF Mono, monospace'
    },
    glassmorphism: {
      enabled: true,
      opacity: 0.05,
      blur: 'xl'
    }
  },

  seo: {
    title: 'PEPTIDES - Research Peptides & Laboratory Supplies',
    description: 'High-quality research peptides and laboratory supplies for scientific research. Purity guaranteed.',
    keywords: [
      'research peptides',
      'laboratory supplies',
      'scientific research',
      'peptide synthesis',
      'lab equipment',
      'research chemicals'
    ],
    ogImage: '/images/peptides-og.jpg',
    twitterHandle: '@peptidesresearch',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'MedicalBusiness',
      'name': 'PEPTIDES',
      'description': 'Research peptides and laboratory supplies'
    }
  },

  assets: {
    logo: {
      light: '/logos/peptides-light.svg',
      dark: '/logos/peptides-dark.svg',
      alt: 'PEPTIDES - Research & Laboratory'
    },
    favicon: '/favicons/peptides.ico'
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