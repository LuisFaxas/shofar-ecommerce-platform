import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * PEPTIDES brand metadata
 * SEO-optimized for research peptides market
 */
export const metadata: Metadata = {
  title: {
    default: 'PEPTIDES - Research Peptides & Laboratory Supplies',
    template: '%s | PEPTIDES',
  },
  description:
    'High-quality research peptides and laboratory supplies for scientific research. Purity guaranteed. For Research Use Only.',
  keywords: [
    'research peptides',
    'laboratory supplies',
    'scientific research',
    'peptide synthesis',
    'lab equipment',
    'research chemicals',
  ],
  authors: [{ name: 'PEPTIDES Research' }],
  creator: 'PEPTIDES',
  publisher: 'PEPTIDES',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'PEPTIDES',
    title: 'PEPTIDES - Research Peptides & Laboratory Supplies',
    description:
      'High-quality research peptides and laboratory supplies for scientific research.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEPTIDES - Research Peptides & Laboratory Supplies',
    description:
      'High-quality research peptides and laboratory supplies for scientific research.',
  },
};

/**
 * Root Layout
 *
 * Applies to all routes. Route groups handle specific layouts:
 * - (shop)/* - Public store pages with PageShell
 * - (internal)/* - Internal pages (design system, etc.)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
