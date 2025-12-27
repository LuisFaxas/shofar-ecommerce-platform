/**
 * TOOLY Brand - Tools & Hardware Store
 * WO 3.1 / 3.2 Implementation - Page Shell & Cart Context
 *
 * Features:
 * - CartProvider wraps all content
 * - Navbar with anchor links and cart integration
 * - 9 styled sections with Vendure data integration
 * - CartDrawer with focus trap
 * - Smooth scroll navigation
 * - Server-side data fetching with graceful fallbacks
 */

"use client";

import React from "react";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { Navbar } from "./components/ui/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import {
  HeroSection,
  CredibilitySection,
  TechnologySection,
  GallerySection,
  ProductSection,
  AccessoriesSection,
  ReviewsSection,
  FaqSection,
  FooterSection,
} from "./sections";
import type { ToolyPageData } from "./lib/fetchers";
import {
  isDebugMockEnabled,
  augmentWithMockData,
  getDebugBannerProps,
} from "./lib/debug-mock";
import { getDefaultStorefrontContent } from "./lib/storefront-content";

// Import design tokens
import "./styles/tokens.css";

interface ToolyAppProps {
  /** Page data fetched server-side from Vendure */
  pageData?: ToolyPageData | null;
}

// Inner component that uses the cart context
function ToolyAppInner({ pageData }: ToolyAppProps): React.ReactElement {
  const { itemCount, toggleDrawer } = useCart();

  // Debug mock mode - DEV ONLY
  const [effectiveData, setEffectiveData] = React.useState(pageData);
  const [debugBanner, setDebugBanner] = React.useState({
    show: false,
    message: "",
  });

  React.useEffect(() => {
    // Check for debug mock mode on client side only
    if (isDebugMockEnabled()) {
      setEffectiveData(augmentWithMockData(pageData ?? null));
      setDebugBanner(getDebugBannerProps());
    } else {
      setEffectiveData(pageData);
      setDebugBanner({ show: false, message: "" });
    }
  }, [pageData]);

  return (
    <div className="min-h-screen bg-[#0b0e14]">
      {/* Debug Mock Banner - DEV ONLY */}
      {debugBanner.show && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black px-4 py-2 text-center text-sm font-medium">
          {debugBanner.message}
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar cartCount={itemCount} onCartClick={toggleDrawer} />

      {/* Main Content */}
      <main id="main" tabIndex={-1} className={debugBanner.show ? "pt-10" : ""}>
        <HeroSection
          heroImage={effectiveData?.heroImage}
          heroImageMobile={effectiveData?.heroImageMobile}
          featuredAsset={effectiveData?.product?.featuredAsset}
          productName={effectiveData?.product?.name}
          content={
            effectiveData?.storefrontContent?.hero ??
            getDefaultStorefrontContent().hero
          }
        />
        <CredibilitySection
          trustBadges={
            effectiveData?.storefrontContent?.trustBadges ??
            getDefaultStorefrontContent().trustBadges
          }
        />
        <TechnologySection
          features={
            effectiveData?.storefrontContent?.features ??
            getDefaultStorefrontContent().features
          }
        />
        <GallerySection
          assets={effectiveData?.gallery?.assets}
          channelGalleryAssets={effectiveData?.homeGalleryAssets}
          content={
            effectiveData?.storefrontContent?.gallery ??
            getDefaultStorefrontContent().gallery
          }
        />
        <ProductSection
          product={effectiveData?.product}
          shopContent={
            effectiveData?.storefrontContent?.shop ??
            getDefaultStorefrontContent().shop
          }
        />
        <AccessoriesSection accessories={effectiveData?.accessories} />
        <ReviewsSection />
        <FaqSection
          content={
            effectiveData?.storefrontContent?.faq ??
            getDefaultStorefrontContent().faq
          }
        />
      </main>

      {/* Footer */}
      <FooterSection
        disclaimer={
          effectiveData?.storefrontContent?.disclaimer ??
          getDefaultStorefrontContent().disclaimer
        }
      />

      {/* Cart Drawer (renders as portal-like overlay) */}
      <CartDrawer />
    </div>
  );
}

export default function ToolyApp({
  pageData,
}: ToolyAppProps): React.ReactElement {
  return (
    <CartProvider>
      <ToolyAppInner pageData={pageData} />
    </CartProvider>
  );
}
