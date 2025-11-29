/**
 * ProductSection - Main product display with variant selector
 * WO 3.1 Implementation
 *
 * Features:
 * - Large ProductCard skeleton with variant selector area
 * - Fixed dimensions for zero CLS
 * - Will be wired to Vendure data in Phase 2
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ButtonPrimary } from '../components/ui/ButtonPrimary';

interface ProductSectionProps {
  className?: string;
}

const VARIANT_COLORS = [
  { name: 'Gunmetal', color: '#4a5568', finish: 'DLC' },
  { name: 'Midnight', color: '#1a1a2e', finish: 'Cerakote' },
  { name: 'Arctic', color: '#e2e8f0', finish: 'Cerakote' },
  { name: 'Ember', color: '#ff6b35', finish: 'Cerakote' },
  { name: 'Cobalt', color: '#3b82f6', finish: 'Cerakote' },
  { name: 'Titanium', color: '#94a3b8', finish: 'Cerakote' },
];

export function ProductSection({ className }: ProductSectionProps): React.ReactElement {
  return (
    <section
      id="product"
      className={cn('py-16 md:py-24', className)}
      aria-labelledby="product-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            id="product-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Choose Your TOOLY
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Available in 6 premium finishes. Each one crafted to perfection.
          </p>
        </div>

        {/* Product Card */}
        <div className="max-w-4xl mx-auto">
          <div
            className={cn(
              'grid md:grid-cols-2 gap-8 p-6 md:p-8',
              'rounded-2xl',
              'bg-white/[0.04] border border-white/[0.08]',
              'backdrop-blur-sm'
            )}
          >
            {/* Product Image */}
            <div className="relative aspect-square rounded-xl bg-white/[0.04] border border-white/[0.08] overflow-hidden">
              {/* Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#02fcef]/10 to-[#a02bfe]/10 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-white/30"
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
                  <p className="text-white/40 text-sm">Product Image</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Title & Price */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">TOOLY Device</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">$149.00</span>
                  <span className="text-lg text-white/40 line-through">$199.00</span>
                  <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                    Save 25%
                  </span>
                </div>
              </div>

              {/* Variant Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/70 mb-3">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {VARIANT_COLORS.map((variant, index) => (
                    <button
                      key={variant.name}
                      className={cn(
                        'group relative w-12 h-12 rounded-full',
                        'ring-2 ring-offset-2 ring-offset-[#0b0e14]',
                        'transition-all duration-200',
                        'hover:scale-110 focus-visible:scale-110',
                        'focus-visible:outline-none',
                        index === 0
                          ? 'ring-[#02fcef]'
                          : 'ring-transparent hover:ring-white/40 focus-visible:ring-white/60'
                      )}
                      style={{ backgroundColor: variant.color }}
                      aria-label={`${variant.name} ${variant.finish}`}
                      aria-pressed={index === 0}
                    >
                      {/* Tooltip */}
                      <span
                        className={cn(
                          'absolute -bottom-8 left-1/2 -translate-x-1/2',
                          'px-2 py-1 rounded text-xs whitespace-nowrap',
                          'bg-white/10 text-white/80',
                          'opacity-0 group-hover:opacity-100',
                          'transition-opacity pointer-events-none'
                        )}
                      >
                        {variant.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-white/60">In Stock - Ships within 24h</span>
              </div>

              {/* Features List */}
              <ul className="space-y-2 mb-8 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#02fcef]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Precision CNC-machined aluminum body
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#02fcef]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Medical-grade stainless steel chamber
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#02fcef]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  2-year warranty included
                </li>
              </ul>

              {/* Add to Cart */}
              <div className="mt-auto space-y-3">
                <ButtonPrimary fullWidth size="lg" data-testid="add-to-cart">
                  Add to Cart
                </ButtonPrimary>
                <p className="text-xs text-white/40 text-center">
                  Free shipping on orders over $100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ProductSection.displayName = 'ProductSection';

export default ProductSection;
