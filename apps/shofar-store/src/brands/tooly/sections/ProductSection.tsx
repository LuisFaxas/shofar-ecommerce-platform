/**
 * ProductSection - Main product display with variant selector
 * WO 3.1 / 3.2 Implementation
 *
 * Features:
 * - Large ProductCard skeleton with variant selector area
 * - Fixed dimensions for zero CLS
 * - Accepts product data with variants from Vendure
 * - Dynamic variant selection with real pricing
 */

'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ButtonPrimary } from '../components/ui/ButtonPrimary';
import { useCart } from '@/contexts/CartContext';

interface VariantFacetValue {
  id: string;
  code: string;
  name: string;
  facet: {
    id: string;
    code: string;
    name: string;
  };
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  priceWithTax: number;
  currencyCode: string;
  stockLevel: string;
  featuredAsset?: {
    id: string;
    preview: string;
    source: string;
  } | null;
  facetValues: VariantFacetValue[];
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset?: {
    id: string;
    preview: string;
    source: string;
  } | null;
  variants: ProductVariant[];
}

interface ProductSectionProps {
  className?: string;
  /** Product data from Vendure */
  product?: ProductData | null;
}

// Color code to CSS color mapping
const COLOR_MAP: Record<string, string> = {
  gunmetal: '#4a5568',
  midnight: '#1a1a2e',
  arctic: '#e2e8f0',
  ember: '#ff6b35',
  cobalt: '#3b82f6',
  titanium: '#94a3b8',
};

// Default variants for placeholder display
const DEFAULT_VARIANT_COLORS = [
  { name: 'Gunmetal', color: '#4a5568', finish: 'DLC' },
  { name: 'Midnight', color: '#1a1a2e', finish: 'Cerakote' },
  { name: 'Arctic', color: '#e2e8f0', finish: 'Cerakote' },
  { name: 'Ember', color: '#ff6b35', finish: 'Cerakote' },
  { name: 'Cobalt', color: '#3b82f6', finish: 'Cerakote' },
  { name: 'Titanium', color: '#94a3b8', finish: 'Cerakote' },
];

/**
 * Format price with currency
 */
function formatPrice(priceInCents: number, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(priceInCents / 100);
}

/**
 * Get color from variant facet values
 */
function getVariantColor(facetValues: VariantFacetValue[]): string | null {
  const colorFacet = facetValues.find((fv) => fv.facet.code === 'color');
  return colorFacet?.code || null;
}

/**
 * Get finish from variant facet values
 */
function getVariantFinish(facetValues: VariantFacetValue[]): string | null {
  const finishFacet = facetValues.find((fv) => fv.facet.code === 'finish');
  return finishFacet?.name || null;
}

export function ProductSection({
  className,
  product,
}: ProductSectionProps): React.ReactElement {
  const { addToCart } = useCart();
  const hasProduct = !!product && product.variants.length > 0;

  // Track selected variant
  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);
  const selectedVariant = hasProduct
    ? product.variants[selectedVariantIndex]
    : null;

  // Get image to display - variant image or product image
  const displayImage =
    selectedVariant?.featuredAsset?.preview || product?.featuredAsset?.preview;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (selectedVariant) {
      await addToCart(selectedVariant.id, 1);
    }
  };

  // Get stock status display
  const getStockDisplay = (stockLevel: string) => {
    const level = stockLevel.toUpperCase();
    if (level === 'IN_STOCK' || level === 'IN STOCK') {
      return {
        color: 'bg-emerald-400',
        text: 'In Stock - Ships within 24h',
      };
    }
    if (level === 'LOW_STOCK' || level === 'LOW STOCK') {
      return { color: 'bg-yellow-400', text: 'Low Stock - Order Soon' };
    }
    return { color: 'bg-red-400', text: 'Out of Stock' };
  };

  const stockStatus = selectedVariant
    ? getStockDisplay(selectedVariant.stockLevel)
    : { color: 'bg-emerald-400', text: 'In Stock - Ships within 24h' };

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
            Available in {hasProduct ? product.variants.length : 6} premium
            finishes. Each one crafted to perfection.
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
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={selectedVariant?.name || product?.name || 'TOOLY Device'}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                /* Placeholder */
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
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Title & Price */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {product?.name || 'TOOLY Device'}
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">
                    {selectedVariant
                      ? formatPrice(
                          selectedVariant.priceWithTax,
                          selectedVariant.currencyCode
                        )
                      : '$149.00'}
                  </span>
                </div>
              </div>

              {/* Variant Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/70 mb-3">
                  Select Color
                  {selectedVariant && (
                    <span className="ml-2 text-white/50">
                      —{' '}
                      {selectedVariant.facetValues.find(
                        (fv) => fv.facet.code === 'color'
                      )?.name ||
                        selectedVariant.name}
                    </span>
                  )}
                </label>
                <div className="flex flex-wrap gap-3">
                  {hasProduct
                    ? product.variants.map((variant, index) => {
                        const colorCode = getVariantColor(variant.facetValues);
                        const colorHex =
                          COLOR_MAP[colorCode?.toLowerCase() || ''] || '#6b7280';
                        const finishName = getVariantFinish(variant.facetValues);
                        const colorName =
                          variant.facetValues.find(
                            (fv) => fv.facet.code === 'color'
                          )?.name || variant.name;

                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariantIndex(index)}
                            className={cn(
                              'group relative w-12 h-12 rounded-full',
                              'ring-2 ring-offset-2 ring-offset-[#0b0e14]',
                              'transition-all duration-200',
                              'hover:scale-110 focus-visible:scale-110',
                              'focus-visible:outline-none',
                              selectedVariantIndex === index
                                ? 'ring-[#02fcef]'
                                : 'ring-transparent hover:ring-white/40 focus-visible:ring-white/60'
                            )}
                            style={{ backgroundColor: colorHex }}
                            aria-label={`${colorName}${finishName ? ` ${finishName}` : ''}`}
                            aria-pressed={selectedVariantIndex === index}
                          >
                            <span
                              className={cn(
                                'absolute -bottom-8 left-1/2 -translate-x-1/2',
                                'px-2 py-1 rounded text-xs whitespace-nowrap',
                                'bg-white/10 text-white/80',
                                'opacity-0 group-hover:opacity-100',
                                'transition-opacity pointer-events-none'
                              )}
                            >
                              {colorName}
                            </span>
                          </button>
                        );
                      })
                    : DEFAULT_VARIANT_COLORS.map((variant, index) => (
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
                <span className={cn('w-2 h-2 rounded-full', stockStatus.color)} />
                <span className="text-sm text-white/60">{stockStatus.text}</span>
              </div>

              {/* Features List */}
              <ul className="space-y-2 mb-8 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#02fcef]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Precision CNC-machined aluminum body
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#02fcef]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Medical-grade stainless steel chamber
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[#02fcef]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  2-year warranty included
                </li>
              </ul>

              {/* Add to Cart */}
              <div className="mt-auto space-y-3">
                <ButtonPrimary
                  fullWidth
                  size="lg"
                  data-testid="add-to-cart"
                  onClick={handleAddToCart}
                  disabled={!hasProduct}
                >
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
