/**
 * ProductSection - Main product display with variant selector
 * WO 3.1 / 3.2 Implementation + WO-ANCHOR-DENSITY-01
 *
 * Features:
 * - Large ProductCard skeleton with variant selector area
 * - Fixed dimensions for zero CLS
 * - Accepts product data with variants from Vendure
 * - Dynamic variant selection with real pricing
 * - Dual anchors: #product (title) + #product-buy (CTA)
 * - Short-height density mode via CSS class
 */

"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ButtonPrimary } from "../components/ui/ButtonPrimary";
import { ProductCarousel } from "../components/ui/ProductCarousel";
import { useCart } from "@/contexts/CartContext";
import type { ShopContent } from "../lib/storefront-content";
import type { GetToolyProductQuery } from "@shofar/api-client";

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

interface ProductAsset {
  id: string;
  preview: string;
  source?: string;
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
  assets?: ProductAsset[];
  variants: ProductVariant[];
}

interface ProductSectionProps {
  className?: string;
  /** Product data from Vendure */
  product?: ProductData | null;
  /** Shop content from Vendure Channel customFields */
  shopContent?: ShopContent;
}

// Use codegen types for variant-aware media selection
type ToolyProduct = NonNullable<GetToolyProductQuery["product"]>;
type ToolyVariant = ToolyProduct["variants"][number];
type ToolyAsset = NonNullable<ToolyProduct["featuredAsset"]>;

/**
 * Get media list for the selected variant
 * Priority: variant.assets > variant.featuredAsset > product.assets
 */
function getVariantMedia(
  product: ToolyProduct | null | undefined,
  selectedVariant: ToolyVariant | null,
): ToolyAsset[] {
  if (!product) return [];

  // If variant has its own assets, use them
  if (selectedVariant?.assets && selectedVariant.assets.length > 0) {
    // Ensure featuredAsset is first if present
    const assets = [...selectedVariant.assets] as ToolyAsset[];
    if (selectedVariant.featuredAsset) {
      const featuredIdx = assets.findIndex(
        (a) => a.id === selectedVariant.featuredAsset!.id,
      );
      if (featuredIdx > 0) {
        const [featured] = assets.splice(featuredIdx, 1);
        assets.unshift(featured);
      } else if (featuredIdx === -1) {
        // featuredAsset not in assets array, prepend it
        assets.unshift(selectedVariant.featuredAsset as ToolyAsset);
      }
    }
    return assets;
  }

  // Fallback to product-level assets
  if (product.assets && product.assets.length > 0) {
    const assets = [...product.assets] as ToolyAsset[];
    if (product.featuredAsset) {
      const featuredIdx = assets.findIndex(
        (a) => a.id === product.featuredAsset!.id,
      );
      if (featuredIdx > 0) {
        const [featured] = assets.splice(featuredIdx, 1);
        assets.unshift(featured);
      }
    }
    return assets;
  }

  // Last resort: just featuredAsset
  if (product.featuredAsset) {
    return [product.featuredAsset];
  }

  return [];
}

// Color code to CSS color mapping
const COLOR_MAP: Record<string, string> = {
  gunmetal: "#4a5568",
  midnight: "#1a1a2e",
  arctic: "#e2e8f0",
  ember: "#ff6b35",
  cobalt: "#3b82f6",
  titanium: "#94a3b8",
};

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

/**
 * Get color from variant facet values
 */
function getVariantColor(facetValues: VariantFacetValue[]): string | null {
  const colorFacet = facetValues.find((fv) => fv.facet.code === "color");
  return colorFacet?.code || null;
}

/**
 * Get finish from variant facet values
 */
function getVariantFinish(facetValues: VariantFacetValue[]): string | null {
  const finishFacet = facetValues.find((fv) => fv.facet.code === "finish");
  return finishFacet?.name || null;
}

export function ProductSection({
  className,
  product,
  shopContent,
}: ProductSectionProps): React.ReactElement {
  const { addToCart } = useCart();
  const hasProduct = !!product && product.variants.length > 0;

  // Track selected variant
  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);
  const selectedVariant = hasProduct
    ? product.variants[selectedVariantIndex]
    : null;

  // Get variant-aware media for carousel (uses codegen types)
  const carouselMedia = getVariantMedia(
    product as ToolyProduct | null,
    selectedVariant as ToolyVariant | null,
  );

  // Handle add to cart
  const handleAddToCart = async () => {
    if (selectedVariant) {
      await addToCart(selectedVariant.id, 1);
    }
  };

  // Get stock status display (uses shopContent labels)
  const getStockDisplay = (stockLevel: string) => {
    const level = stockLevel.toUpperCase();
    const inStockLabel = shopContent?.inStockLabel ?? "In Stock";
    const outOfStockLabel = shopContent?.outOfStockLabel ?? "Out of Stock";
    const deliveryEstimate =
      shopContent?.deliveryEstimate ?? "Ships within 3-5 business days";

    if (level === "IN_STOCK" || level === "IN STOCK") {
      return {
        color: "bg-emerald-400",
        text: `${inStockLabel} - ${deliveryEstimate}`,
      };
    }
    if (level === "LOW_STOCK" || level === "LOW STOCK") {
      return { color: "bg-yellow-400", text: "Low Stock - Order Soon" };
    }
    return { color: "bg-red-400", text: outOfStockLabel };
  };

  const stockStatus = selectedVariant
    ? getStockDisplay(selectedVariant.stockLevel)
    : {
        color: "bg-emerald-400",
        text: `${shopContent?.inStockLabel ?? "In Stock"} - ${shopContent?.deliveryEstimate ?? "Ships within 3-5 business days"}`,
      };

  return (
    <section
      className={cn("py-10 md:py-24 tooly-product-section", className)}
      aria-labelledby="product-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Navigation anchor - lands on section title */}
        <span id="product" className="block" aria-hidden="true" />

        {/* Section Header */}
        <div className="text-center mb-6 md:mb-12 tooly-product-heading">
          <h2
            id="product-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Choose Your TOOLY
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            {hasProduct && product.variants.length === 1
              ? "Premium craftsmanship, perfected."
              : `Available in ${hasProduct ? product.variants.length : 6} premium finishes. Each one crafted to perfection.`}
          </p>
        </div>

        {/* Conversion anchor - lands on product card */}
        <span id="product-buy" className="block" aria-hidden="true" />

        {/* Product Card */}
        <div className="max-w-4xl mx-auto">
          <div
            className={cn(
              "grid md:grid-cols-2 gap-8 p-6 md:p-8",
              "rounded-2xl",
              "bg-white/[0.04] border border-white/[0.08]",
              "backdrop-blur-sm",
            )}
          >
            {/* Product Image Carousel - key forces reset on variant change */}
            <ProductCarousel
              key={selectedVariant?.id || "default"}
              images={carouselMedia}
              altPrefix={product?.name || "TOOLY"}
            />

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Title & Price */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {product?.name || "TOOLY Device"}
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">
                    {selectedVariant
                      ? formatPrice(
                          selectedVariant.priceWithTax,
                          selectedVariant.currencyCode,
                        )
                      : "$149.00"}
                  </span>
                </div>
              </div>

              {/* Variant Selector - Only show if more than 1 variant */}
              {hasProduct && product.variants.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-3">
                    Select Color
                    {selectedVariant && (
                      <span className="ml-2 text-white/50">
                        —{" "}
                        {selectedVariant.facetValues.find(
                          (fv) => fv.facet.code === "color",
                        )?.name || selectedVariant.name}
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant, index) => {
                      const colorCode = getVariantColor(variant.facetValues);
                      const colorHex =
                        COLOR_MAP[colorCode?.toLowerCase() || ""] || "#6b7280";
                      const finishName = getVariantFinish(variant.facetValues);
                      const colorName =
                        variant.facetValues.find(
                          (fv) => fv.facet.code === "color",
                        )?.name || variant.name;

                      // Get swatch image: variant.featuredAsset or first asset
                      const swatchImage =
                        variant.featuredAsset?.preview ||
                        (variant as unknown as ToolyVariant).assets?.[0]
                          ?.preview;

                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariantIndex(index)}
                          className={cn(
                            "group relative w-12 h-12 rounded-full overflow-hidden",
                            "ring-2 ring-offset-2 ring-offset-[#0b0e14]",
                            "transition-all duration-200",
                            "hover:scale-110 focus-visible:scale-110",
                            "focus-visible:outline-none",
                            selectedVariantIndex === index
                              ? "ring-[#02fcef]"
                              : "ring-transparent hover:ring-white/40 focus-visible:ring-white/60",
                          )}
                          style={
                            swatchImage
                              ? undefined
                              : { backgroundColor: colorHex }
                          }
                          aria-label={`${colorName}${finishName ? ` ${finishName}` : ""}`}
                          aria-pressed={selectedVariantIndex === index}
                        >
                          {swatchImage ? (
                            <Image
                              src={swatchImage}
                              alt={colorName}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : null}
                          <span
                            className={cn(
                              "absolute -bottom-8 left-1/2 -translate-x-1/2 z-10",
                              "px-2 py-1 rounded text-xs whitespace-nowrap",
                              "bg-white/10 text-white/80",
                              "opacity-0 group-hover:opacity-100",
                              "transition-opacity pointer-events-none",
                            )}
                          >
                            {colorName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <span
                  className={cn("w-2 h-2 rounded-full", stockStatus.color)}
                />
                <span className="text-sm text-white/60">
                  {stockStatus.text}
                </span>
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
                  {shopContent?.shippingBlurb ??
                    "Shipping calculated at checkout"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

ProductSection.displayName = "ProductSection";

export default ProductSection;
