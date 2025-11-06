import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { resolveBrand, getBrandThemeVars } from '@/lib/brand-runtime';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

// Dynamic metadata based on brand
export async function generateMetadata(): Promise<Metadata> {
  const brand = await resolveBrand();

  return {
    title: brand.seo.title,
    description: brand.seo.description,
    keywords: brand.seo.keywords,
    openGraph: {
      title: brand.seo.title,
      description: brand.seo.description,
      images: brand.seo.ogImage ? [brand.seo.ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: brand.seo.title,
      description: brand.seo.description,
      images: brand.seo.ogImage ? [brand.seo.ogImage] : [],
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  const themeVars = await getBrandThemeVars();

  // Convert theme vars to inline style string
  const themeStyle = Object.entries(themeVars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ cssText: themeStyle } as React.CSSProperties}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}