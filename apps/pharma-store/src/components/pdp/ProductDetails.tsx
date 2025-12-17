"use client";

/**
 * ProductDetails Component
 *
 * Full PDP (Product Detail Page) layout for peptide products.
 * Includes image, product info, variant selection, specs, and compliance.
 *
 * v1: Single image, Add to Cart is stub only
 */

import React, { useState, useMemo } from "react";
import Image from "next/image";
import type { PeptideProduct, PeptideVariant } from "../../lib/mock-peptides";
import { SpecsTable } from "./SpecsTable";
import { ResearchDisclaimer } from "../compliance/ResearchDisclaimer";
import { Badge } from "../ui/Badge";

interface ProductDetailsProps {
  product: PeptideProduct;
  className?: string;
}

/**
 * Goal category badge colors
 */
const GOAL_COLORS: Record<string, string> = {
  Recovery: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Metabolic: "bg-amber-100 text-amber-700 border-amber-200",
  Longevity: "bg-violet-100 text-violet-700 border-violet-200",
  Cognitive: "bg-blue-100 text-blue-700 border-blue-200",
  Cosmetic: "bg-pink-100 text-pink-700 border-pink-200",
  Research: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

/**
 * Format price from cents to display string
 */
function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Variant selector button
 */
function VariantButton({
  variant,
  isSelected,
  onSelect,
}: {
  variant: PeptideVariant;
  isSelected: boolean;
  onSelect: () => void;
}): React.JSX.Element {
  return (
    <button
      onClick={onSelect}
      disabled={!variant.inStock}
      className={`
        relative px-4 py-3 rounded-lg border text-left transition-all
        ${
          isSelected
            ? "border-[var(--peptide-primary)] bg-[var(--peptide-primary)]/5 ring-2 ring-[var(--peptide-primary)]/20"
            : variant.inStock
              ? "border-[var(--peptide-border)] hover:border-[var(--peptide-border-hover)] bg-[var(--peptide-bg-elevated)]"
              : "border-[var(--peptide-border-light)] bg-[var(--peptide-bg-alt)] opacity-60 cursor-not-allowed"
        }
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-body-sm font-medium text-[var(--peptide-fg-strong)]">
          {variant.size}
        </span>
        {!variant.inStock && (
          <span className="text-xs text-[var(--peptide-fg-muted)]">
            Out of stock
          </span>
        )}
      </div>
      <div className="mt-1 text-body font-semibold text-[var(--peptide-fg)]">
        {formatPrice(variant.price)}
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <svg
            className="w-4 h-4 text-[var(--peptide-primary)]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

export function ProductDetails({
  product,
  className = "",
}: ProductDetailsProps): React.JSX.Element {
  // Select first in-stock variant by default, or first variant if none in stock
  const defaultVariant = useMemo(() => {
    return product.variants.find((v) => v.inStock) || product.variants[0];
  }, [product.variants]);

  const [selectedVariant, setSelectedVariant] =
    useState<PeptideVariant>(defaultVariant);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const goalColor = GOAL_COLORS[product.category] || GOAL_COLORS.Research;

  // TODO: Replace with actual cart implementation
  const handleAddToCart = async (): Promise<void> => {
    setIsAddingToCart(true);
    // Simulate network delay for UI feedback
    await new Promise((resolve) => setTimeout(resolve, 500));
    // eslint-disable-next-line no-console
    console.log("Add to cart:", {
      product: product.slug,
      variant: selectedVariant.id,
    });
    setIsAddingToCart(false);
    // TODO: Integrate with cart context/API
    alert("Added to cart! (This is a stub - cart functionality coming soon)");
  };

  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[var(--peptide-bg-alt)] border border-[var(--peptide-border-light)]">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-[var(--peptide-fg-muted)]/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery (v1: hidden, single image only) */}
          {product.images && product.images.length > 1 && (
            <div className="hidden">
              {/* TODO: Implement image gallery in v2 */}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="space-y-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${goalColor}`}
            >
              {product.category}
            </span>
            {product.featured && <Badge variant="primary">Featured</Badge>}
          </div>

          {/* Product Name */}
          <div>
            <h1 className="text-h1 text-[var(--peptide-fg-strong)]">
              {product.name}
            </h1>
            {product.shortName && product.shortName !== product.name && (
              <p className="mt-1 text-body text-[var(--peptide-fg-muted)]">
                Also known as: {product.shortName}
              </p>
            )}
          </div>

          {/* Quick Specs */}
          <div className="flex flex-wrap gap-3">
            {product.purity && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--peptide-accent)]/10 border border-[var(--peptide-accent)]/20">
                <svg
                  className="w-4 h-4 text-[var(--peptide-accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-body-sm font-medium text-[var(--peptide-accent)]">
                  {product.purity} Purity
                </span>
              </div>
            )}
            {product.casNumber && (
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[var(--peptide-bg-alt)] border border-[var(--peptide-border-light)]">
                <span className="text-body-sm text-[var(--peptide-fg-muted)]">
                  CAS:{" "}
                  <span className="font-mono text-[var(--peptide-fg)]">
                    {product.casNumber}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-body text-[var(--peptide-fg)]">
            {product.description}
          </p>

          {/* Variant Selection */}
          <div>
            <label className="block text-overline mb-3">Select Size</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.variants.map((variant) => (
                <VariantButton
                  key={variant.id}
                  variant={variant}
                  isSelected={selectedVariant.id === variant.id}
                  onSelect={() => setSelectedVariant(variant)}
                />
              ))}
            </div>
          </div>

          {/* Price & Add to Cart */}
          <div className="p-6 rounded-xl bg-[var(--peptide-bg-alt)] border border-[var(--peptide-border-light)]">
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-body-sm text-[var(--peptide-fg-muted)]">
                  Price
                </span>
                <div className="text-h2 text-[var(--peptide-fg-strong)]">
                  {formatPrice(selectedVariant.price)}
                </div>
              </div>
              <div className="text-right">
                {selectedVariant.inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-body-sm text-[var(--peptide-accent)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--peptide-accent)]" />
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-body-sm text-[var(--peptide-fg-muted)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--peptide-fg-muted)]" />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant.inStock || isAddingToCart}
              className={`
                w-full py-3 px-6 rounded-lg font-medium text-body
                transition-all duration-200
                ${
                  selectedVariant.inStock
                    ? "bg-[var(--peptide-primary)] text-white hover:bg-[var(--peptide-primary-dark)] active:scale-[0.98]"
                    : "bg-[var(--peptide-bg-elevated)] text-[var(--peptide-fg-muted)] cursor-not-allowed"
                }
                ${isAddingToCart ? "opacity-70 cursor-wait" : ""}
              `}
            >
              {isAddingToCart ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : selectedVariant.inStock ? (
                "Add to Cart"
              ) : (
                "Out of Stock"
              )}
            </button>

            <p className="mt-3 text-xs text-center text-[var(--peptide-fg-muted)]">
              SKU: {selectedVariant.sku}
            </p>
          </div>

          {/* Inline Research Disclaimer */}
          <ResearchDisclaimer variant="inline" />
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="mt-12 pt-8 border-t border-[var(--peptide-border-light)]">
        <SpecsTable product={product} />
      </div>

      {/* Full Compliance Notice */}
      <div className="mt-12">
        <ResearchDisclaimer variant="card">
          This product is intended solely for legitimate scientific research
          conducted by qualified researchers. {product.name} is not for human
          consumption, therapeutic use, veterinary use, or any other
          non-research purpose. By purchasing this product, you confirm that you
          are a qualified researcher and that the product will be used only for
          lawful research purposes.
        </ResearchDisclaimer>
      </div>
    </div>
  );
}
