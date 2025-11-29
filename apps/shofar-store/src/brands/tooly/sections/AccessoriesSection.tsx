/**
 * AccessoriesSection - Upsell/cross-sell products
 * WO 3.1 Implementation
 *
 * Features:
 * - 4-card horizontal grid
 * - ProductCard skeletons with fixed dimensions
 * - Will be wired to Vendure accessories collection in Phase 2
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ButtonSecondary } from '../components/ui/ButtonSecondary';

interface AccessoriesSectionProps {
  className?: string;
}

const ACCESSORIES = [
  {
    id: 1,
    name: 'Silicone Case + Glass Vial',
    price: '$24.99',
    description: 'Premium protection for your TOOLY',
  },
  {
    id: 2,
    name: 'Carry Chain - Gold',
    price: '$19.99',
    description: '18K gold-plated stainless steel',
  },
  {
    id: 3,
    name: 'Carry Chain - Silver',
    price: '$19.99',
    description: 'Brushed stainless steel finish',
  },
  {
    id: 4,
    name: 'Cleaning Kit',
    price: '$9.99',
    description: 'Complete maintenance solution',
  },
];

export function AccessoriesSection({ className }: AccessoriesSectionProps): React.ReactElement {
  return (
    <section
      id="accessories"
      className={cn('py-16 md:py-24 bg-[#0d1218]', className)}
      aria-labelledby="accessories-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2
              id="accessories-heading"
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Complete Your Setup
            </h2>
            <p className="text-lg text-white/60 max-w-xl">
              Premium accessories designed to enhance your TOOLY experience
            </p>
          </div>
          <ButtonSecondary className="hidden md:flex mt-4 md:mt-0" showArrow>
            View All Accessories
          </ButtonSecondary>
        </div>

        {/* Accessories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {ACCESSORIES.map((accessory) => (
            <div
              key={accessory.id}
              className={cn(
                'group p-4 rounded-xl',
                'bg-white/[0.04] border border-white/[0.08]',
                'hover:bg-white/[0.06] hover:border-white/[0.12]',
                'transition-all duration-300'
              )}
            >
              {/* Image Placeholder */}
              <div
                className={cn(
                  'aspect-square rounded-lg mb-4',
                  'bg-white/[0.04] border border-white/[0.06]',
                  'flex items-center justify-center',
                  'overflow-hidden'
                )}
              >
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/[0.06] flex items-center justify-center text-white/30">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-white/30">Image</p>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                {accessory.name}
              </h3>
              <p className="text-xs text-white/50 mb-3 line-clamp-1">
                {accessory.description}
              </p>

              {/* Price & Action */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">{accessory.price}</span>
                <button
                  className={cn(
                    'p-2 rounded-lg',
                    'bg-white/[0.08] text-white/60',
                    'hover:bg-white/[0.12] hover:text-white',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
                  )}
                  aria-label={`Add ${accessory.name} to cart`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden">
          <ButtonSecondary fullWidth showArrow>
            View All Accessories
          </ButtonSecondary>
        </div>
      </div>
    </section>
  );
}

AccessoriesSection.displayName = 'AccessoriesSection';

export default AccessoriesSection;
