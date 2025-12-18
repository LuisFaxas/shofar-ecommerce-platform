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

interface ProductAsset {
  id: string;
  preview: string;
  source: string;
}

interface HeroSectionProps {
  className?: string;
  /** Hero background image URL from Channel customFields */
  heroImage?: string | null;
  /** Product featured asset as fallback */
  featuredAsset?: ProductAsset | null;
  /** Product name for alt text */
  productName?: string;
}

export function HeroSection({
  className,
  heroImage,
  featuredAsset,
  productName = "TOOLY Device",
}: HeroSectionProps): React.ReactElement {
  // Use heroImage if available, fallback to product featuredAsset
  const backgroundImage = heroImage || featuredAsset?.preview || null;

  const handleShopNow = () => {
    const productSection = document.getElementById("product");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
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
        "relative min-h-[90vh] flex items-center justify-center",
        "overflow-hidden",
        className,
      )}
      aria-labelledby="hero-heading"
    >
      {/* ================================================================== */}
      {/* Background Layer */}
      {/* ================================================================== */}
      <div className="absolute inset-0">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={productName}
            fill
            className="object-cover object-center scale-105"
            priority
            sizes="100vw"
          />
        ) : (
          /* Gradient fallback when no image */
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b0e14] via-[#0d1218] to-[#0b0e14]" />
        )}

        {/* Frosted Overlay - Creates depth and ensures text readability */}
        <div
          className="absolute inset-0 bg-[#0b0e14]/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Gradient Overlays - Top and bottom fade for seamless integration */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0b0e14] via-transparent to-[#0b0e14]/95"
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
            Premium Professional Tools
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6"
        >
          <span className="block">Precision.</span>
          <span className="block bg-gradient-to-r from-[#02fcef] via-[#ffb52b] to-[#a02bfe] bg-clip-text text-transparent">
            Airflow.
          </span>
          <span className="block">Perfection.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-2xl mx-auto mb-10">
          Experience the next generation of precision tools. Engineered for
          professionals, designed for perfection.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <ButtonPrimary
            size="lg"
            onClick={handleShopNow}
            showArrow
            data-testid="cta-shop-now"
          >
            Shop Now
          </ButtonPrimary>
          <ButtonSecondary size="lg" onClick={handleLearnMore}>
            Learn More
          </ButtonSecondary>
        </div>
      </div>
    </section>
  );
}

HeroSection.displayName = "HeroSection";

export default HeroSection;
