/**
 * HeroSection - Landing hero with main CTAs
 * WO 3.1 / 3.2 Implementation
 *
 * Features:
 * - "TOOLY by SHOFAR" headline
 * - Rainbow ButtonPrimary "Shop Now" (scrolls to #product)
 * - ButtonSecondary "Learn More" (scrolls to #technology)
 * - Fixed dimensions for zero CLS
 * - Accepts optional product data for hero image
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ButtonPrimary } from '../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../components/ui/ButtonSecondary';

interface ProductAsset {
  id: string;
  preview: string;
  source: string;
}

interface HeroSectionProps {
  className?: string;
  /** Product featured asset for hero image */
  featuredAsset?: ProductAsset | null;
  /** Product name for alt text */
  productName?: string;
}

export function HeroSection({
  className,
  featuredAsset,
  productName = 'TOOLY Device',
}: HeroSectionProps): React.ReactElement {
  const handleShopNow = () => {
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMore = () => {
    const techSection = document.getElementById('technology');
    if (techSection) {
      techSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className={cn(
        'relative min-h-[80vh] flex items-center justify-center',
        'py-20 md:py-28 lg:py-32',
        'overflow-hidden',
        className
      )}
      aria-labelledby="hero-heading"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0b0e14] via-[#0d1218] to-[#0b0e14]"
        aria-hidden="true"
      />

      {/* Decorative elements */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#02fcef]/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a02bfe]/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 md:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/[0.08] border border-white/[0.14]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/70">Premium Professional Tools</span>
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
          Experience the next generation of precision tools. Engineered for professionals,
          designed for perfection.
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

        {/* Hero product preview */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div
            className={cn(
              'aspect-video rounded-2xl',
              'bg-white/[0.04] border border-white/[0.08]',
              'flex items-center justify-center',
              'overflow-hidden',
              'relative'
            )}
          >
            {featuredAsset?.preview ? (
              <Image
                src={featuredAsset.preview}
                alt={productName}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            ) : (
              /* Placeholder when no image available */
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#02fcef]/20 to-[#a02bfe]/20 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                    />
                  </svg>
                </div>
                <p className="text-white/40 text-sm">TOOLY Device Preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

HeroSection.displayName = 'HeroSection';

export default HeroSection;
