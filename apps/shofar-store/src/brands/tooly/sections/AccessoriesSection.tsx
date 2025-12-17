/**
 * AccessoriesSection - Upsell/cross-sell products
 * WO 3.1 / 3.2 Implementation
 *
 * Features:
 * - 4-card horizontal grid
 * - ProductCard skeletons with fixed dimensions
 * - Accepts accessories data from Vendure collection
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ButtonSecondary } from "../components/ui/ButtonSecondary";
import { useCart } from "@/contexts/CartContext";

interface AccessoryVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  priceWithTax: number;
  currencyCode: string;
  featuredAsset?: {
    id: string;
    preview: string;
    source: string;
  } | null;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    featuredAsset?: {
      id: string;
      preview: string;
      source: string;
    } | null;
  };
}

interface AccessoriesData {
  id: string;
  name: string;
  slug: string;
  description: string;
  productVariants: {
    items: AccessoryVariant[];
    totalItems: number;
  };
}

interface AccessoriesSectionProps {
  className?: string;
  /** Accessories collection data from Vendure */
  accessories?: AccessoriesData | null;
}

/**
 * Format price with currency
 */
function formatPrice(
  priceInCents: number,
  currencyCode: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(priceInCents / 100);
}

export function AccessoriesSection({
  className,
  accessories,
}: AccessoriesSectionProps): React.ReactElement {
  const { addToCart } = useCart();
  const variants = accessories?.productVariants?.items || [];
  const hasAccessories = variants.length > 0;

  const handleAddToCart = async (variant: AccessoryVariant) => {
    await addToCart(variant.id, 1);
  };

  return (
    <section
      id="accessories"
      className={cn("py-16 md:py-24 bg-[#0d1218]", className)}
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
              {accessories?.description ||
                "Premium accessories designed to enhance your TOOLY experience"}
            </p>
          </div>
          {hasAccessories && (
            <ButtonSecondary className="hidden md:flex mt-4 md:mt-0" showArrow>
              View All Accessories
            </ButtonSecondary>
          )}
        </div>

        {/* Accessories Grid or Coming Soon */}
        {hasAccessories ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {variants.slice(0, 4).map((variant) => {
              const imageUrl =
                variant.featuredAsset?.preview ||
                variant.product.featuredAsset?.preview;
              return (
                <div
                  key={variant.id}
                  className={cn(
                    "group p-4 rounded-xl",
                    "bg-white/[0.04] border border-white/[0.08]",
                    "hover:bg-white/[0.06] hover:border-white/[0.12]",
                    "transition-all duration-300",
                  )}
                >
                  {/* Image */}
                  <div
                    className={cn(
                      "aspect-square rounded-lg mb-4 relative",
                      "bg-white/[0.04] border border-white/[0.06]",
                      "overflow-hidden",
                    )}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={variant.product.name}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
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
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
                    {variant.product.name}
                  </h3>
                  <p className="text-xs text-white/50 mb-3 line-clamp-1">
                    {variant.product.description || variant.name}
                  </p>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">
                      {formatPrice(variant.priceWithTax, variant.currencyCode)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(variant)}
                      className={cn(
                        "p-2 rounded-lg",
                        "bg-white/[0.08] text-white/60",
                        "hover:bg-white/[0.12] hover:text-white",
                        "transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                      )}
                      aria-label={`Add ${variant.product.name} to cart`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
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
              );
            })}
          </div>
        ) : (
          /* Coming Soon Empty State */
          <div
            className={cn(
              "bg-white/[0.03] backdrop-blur-sm",
              "border border-white/[0.08] rounded-2xl",
              "p-12 md:p-16 text-center",
            )}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#02fcef]/10 to-[#a02bfe]/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#02fcef]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-3">
              Accessories Coming Soon
            </h3>
            <p className="text-white/50 max-w-md mx-auto">
              Premium add-ons to enhance your TOOLY experience. Sign up to be
              notified when they launch.
            </p>
          </div>
        )}

        {/* Mobile CTA - Only show when accessories exist */}
        {hasAccessories && (
          <div className="mt-8 md:hidden">
            <ButtonSecondary fullWidth showArrow>
              View All Accessories
            </ButtonSecondary>
          </div>
        )}
      </div>
    </section>
  );
}

AccessoriesSection.displayName = "AccessoriesSection";

export default AccessoriesSection;
