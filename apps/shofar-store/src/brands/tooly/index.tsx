/**
 * TOOLY Brand - Tools & Hardware Store
 * WO 3.1 Implementation - Page Shell & Cart Context
 *
 * Features:
 * - CartProvider wraps all content
 * - Navbar with anchor links and cart integration
 * - 9 styled placeholder sections
 * - CartDrawer with focus trap
 * - Smooth scroll navigation
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

// Import design tokens
import './styles/tokens.css';

// Inner component that uses the cart context
function ToolyAppInner(): React.ReactElement {
  const { itemCount, toggleDrawer } = useCart();

  return (
    <div className="min-h-screen bg-[#0b0e14]">
      {/* Sticky Navigation */}
      <Navbar cartCount={itemCount} onCartClick={toggleDrawer} />

      {/* Main Content */}
      <main>
        <HeroSection />
        <CredibilitySection />
        <TechnologySection />
        <GallerySection />
        <ProductSection />
        <AccessoriesSection />
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

export default function ToolyApp(): React.ReactElement {
  return (
    <CartProvider>
      <ToolyAppInner />
    </CartProvider>
  );
}
