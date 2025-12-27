/**
 * HeroSection - Full Background Hero with Frosted Overlay
 * WO-FRONTEND-01 Redesign
 *
 * Features:
 * - Full-width background image (from Vendure Channel heroImage)
 * - Layered frosted overlay for text readability
 * - Gradient edges for seamless integration
 * - Same headline/buttons, dramatic new presentation
 * - Responsive: same design, just scaled
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ButtonPrimary } from "../components/ui/ButtonPrimary";
import { ButtonSecondary } from "../components/ui/ButtonSecondary";
import type { HeroContent } from "../lib/storefront-content";

interface ProductAsset {
  id: string;
  preview: string;
  source: string;
}

interface HeroSectionProps {
  className?: string;
  /** Hero background image URL from Channel customFields (desktop) */
  heroImage?: string | null;
  /** Hero background image for mobile (< 768px) */
  heroImageMobile?: string | null;
  /** Product featured asset as fallback */
  featuredAsset?: ProductAsset | null;
  /** Product name for alt text */
  productName?: string;
  /** Content from Vendure Channel customFields */
  content?: HeroContent;
}

export function HeroSection({
  className,
  heroImage,
  heroImageMobile,
  featuredAsset,
  productName = "TOOLY Device",
  content,
}: HeroSectionProps): React.ReactElement {
  // Desktop: heroImage, fallback to product featuredAsset
  const desktopImage = heroImage || featuredAsset?.preview || null;
  // Mobile: heroImageMobile, fallback to desktop image
  const mobileImage = heroImageMobile || desktopImage;

  const handleShopNow = () => {
    // WO-ANCHOR-DENSITY-01: Scroll to #product-buy (conversion intent)
    const buySection = document.getElementById("product-buy");
    if (buySection) {
      buySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLearnMore = () => {
    const techSection = document.getElementById("technology");
    if (techSection) {
      techSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className={cn(
        "relative flex items-center justify-center",
        // Mobile: 100svh (stable viewport for iOS Safari, full screen)
        // Desktop: 90svh (leaves room for nav awareness)
        "min-h-[100svh] md:min-h-[90svh]",
        "overflow-hidden",
        className,
      )}
      aria-labelledby="hero-heading"
    >
      {/* ================================================================== */}
      {/* Background Layer - Desktop (absolute, viewport fill) */}
      {/* ================================================================== */}
      <div className="hidden md:block absolute inset-0">
        {desktopImage ? (
          <Image
            src={desktopImage}
            alt={productName}
            fill
            className="object-cover object-bottom scale-105"
            priority
            sizes="(min-width: 768px) 100vw, 0vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b0e14] via-[#0d1218] to-[#0b0e14]" />
        )}
        {/* Frosted Overlay */}
        <div className="absolute inset-0 bg-[#0b0e14]/25" aria-hidden="true" />
      </div>

      {/* ================================================================== */}
      {/* Background Layer - Mobile (anchored to bottom, crops from top) */}
      {/* ================================================================== */}
      <div className="md:hidden absolute inset-0">
        {mobileImage ? (
          <Image
            src={mobileImage}
            alt={productName}
            fill
            className="object-cover object-bottom"
            priority
            sizes="(max-width: 768px) 100vw, 0vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b0e14] via-[#0d1218] to-[#0b0e14]" />
        )}
        {/* Frosted Overlay */}
        <div className="absolute inset-0 bg-[#0b0e14]/25" aria-hidden="true" />
      </div>

      {/* Shared overlays for both viewports */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Overlays - Top and bottom fade for seamless integration */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/80 via-transparent to-[#0b0e14]/90"
          aria-hidden="true"
        />

        {/* Subtle radial glow for premium feel */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(2, 252, 239, 0.08) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ================================================================== */}
      {/* Content Layer */}
      {/* ================================================================== */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-20 md:py-28 lg:py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/[0.08] border border-white/[0.14] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/70">
            {content?.pill ?? "Precision Aroma Delivery"}
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6"
        >
          <span className="block">
            {content?.headlineLine1 ?? "Precision."}
          </span>
          <span className="block bg-gradient-to-r from-[#02fcef] via-[#ffb52b] to-[#a02bfe] bg-clip-text text-transparent">
            {content?.headlineAccent ?? "Aroma."}
          </span>
          <span className="block">
            {content?.headlineLine3 ?? "Perfection."}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto mb-10">
          {content?.subhead ??
            "Experience the art of precision aroma delivery. Crafted for connoisseurs, designed for ritual."}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonPrimary
            size="lg"
            onClick={handleShopNow}
            showArrow
            data-testid="cta-shop-now"
          >
            {content?.primaryCtaLabel ?? "Shop Now"}
          </ButtonPrimary>
          <ButtonSecondary size="lg" onClick={handleLearnMore}>
            {content?.secondaryCtaLabel ?? "Learn More"}
          </ButtonSecondary>
        </div>
      </div>
    </section>
  );
}

HeroSection.displayName = "HeroSection";

export default HeroSection;
