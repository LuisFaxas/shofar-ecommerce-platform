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

'use client';

import React from 'react';
import { CartProvider, useCart } from '@/contexts/CartContext';
import { Navbar } from './components/ui/Navbar';
import { CartDrawer } from './components/CartDrawer';
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
} from './sections';
import type { ToolyPageData } from './lib/fetchers';

// Import design tokens
import './styles/tokens.css';

interface ToolyAppProps {
  /** Page data fetched server-side from Vendure */
  pageData?: ToolyPageData | null;
}

// Inner component that uses the cart context
function ToolyAppInner({ pageData }: ToolyAppProps): React.ReactElement {
  const { itemCount, toggleDrawer } = useCart();

  return (
    <div className="min-h-screen bg-[#0b0e14]">
      {/* Sticky Navigation */}
      <Navbar cartCount={itemCount} onCartClick={toggleDrawer} />

      {/* Main Content */}
      <main>
        <HeroSection
          featuredAsset={pageData?.product?.featuredAsset}
          productName={pageData?.product?.name}
        />
        <CredibilitySection />
        <TechnologySection />
        <GallerySection assets={pageData?.gallery?.assets} />
        <ProductSection product={pageData?.product} />
        <AccessoriesSection accessories={pageData?.accessories} />
        <ReviewsSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Cart Drawer (renders as portal-like overlay) */}
      <CartDrawer />
    </div>
  );
}

export default function ToolyApp({ pageData }: ToolyAppProps): React.ReactElement {
  return (
    <CartProvider>
      <ToolyAppInner pageData={pageData} />
    </CartProvider>
  );
}
