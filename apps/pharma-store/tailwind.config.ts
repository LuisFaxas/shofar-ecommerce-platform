import type { Config } from 'tailwindcss';

/**
 * PEPTIDES Brand Tailwind Configuration
 *
 * Theme colors imported from @shofar/pharma-brand-config:
 * - Primary: Indigo (#6366F1)
 * - Secondary: Purple (#8B5CF6)
 * - Accent: Emerald (#10B981)
 */
const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        peptide: {
          primary: '#6366F1',
          'primary-dark': '#4F46E5',
          'primary-light': '#818CF8',
          secondary: '#8B5CF6',
          'secondary-dark': '#7C3AED',
          'secondary-light': '#A78BFA',
          accent: '#10B981',
          'accent-dark': '#059669',
          'accent-light': '#34D399',
          bg: '#FAFAFA',
          'bg-alt': '#F3F4F6',
          fg: '#111827',
          'fg-muted': '#6B7280',
          border: '#E5E7EB',
          'border-light': '#F3F4F6',
        },
      },
      borderRadius: {
        peptide: '0.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'monospace'],
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-sm': '0 2px 15px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
