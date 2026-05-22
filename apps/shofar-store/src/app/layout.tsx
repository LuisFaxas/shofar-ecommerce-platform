import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { resolveBrand, getBrandThemeVars } from "@/lib/store-runtime";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// High-contrast Garamond revival for cinematic / engraved-feel hero copy.
// Weight contrast (thin hairlines, thick stems) gives the carved-inscription
// look the hero choreography needs.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export async function generateMetadata(): Promise<Metadata> {
  const brand = await resolveBrand();

  return {
    title: brand.seo.title,
    description: brand.seo.description,
    keywords: brand.seo.keywords,
    openGraph: {
      title: brand.seo.title,
      description: brand.seo.description,
      type: "website",
      siteName: brand.displayName,
    },
    twitter: {
      card: "summary_large_image",
      title: brand.seo.title,
      description: brand.seo.description,
      creator: brand.seo.twitterHandle,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeVars = await getBrandThemeVars();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}
        style={themeVars as React.CSSProperties}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  );
}
