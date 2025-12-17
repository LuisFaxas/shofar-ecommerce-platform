/**
 * ProductGrid Component
 *
 * Responsive grid layout for displaying product cards.
 * Supports both thumbnail and detail view variants.
 */

import React from "react";
import { ProductCard } from "./ProductCard";
import type { PeptideProduct } from "../../lib/mock-peptides";
import {
  getPriceRange,
  isInStock,
  getDefaultVariant,
} from "../../lib/queries/products";

interface ProductGridProps {
  products: PeptideProduct[];
  variant?: "thumbnail" | "detail";
  className?: string;
}

/**
 * Empty state component
 */
function EmptyState(): React.JSX.Element {
  return (
    <div className="col-span-full py-16 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--peptide-bg-alt)] flex items-center justify-center">
        <svg
          className="w-8 h-8 text-[var(--peptide-fg-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-h4 text-[var(--peptide-fg-strong)] mb-2">
        No products found
      </h3>
      <p className="text-body-sm text-[var(--peptide-fg-muted)] max-w-sm mx-auto">
        Try adjusting your filters or search criteria to find what you&apos;re
        looking for.
      </p>
    </div>
  );
}

/**
 * Map PeptideProduct to ProductCard props
 */
function mapToProductCardProps(product: PeptideProduct) {
  const defaultVariant = getDefaultVariant(product);

  return {
    id: product.id,
    name: product.shortName || product.name,
    slug: product.slug,
    price: defaultVariant.price / 100, // Convert cents to dollars
    currency: "USD",
    description: product.description,
    category: product.category,
    inStock: isInStock(product),
    purity: product.purity,
    weight: defaultVariant.size,
    image: product.featuredImage,
  };
}

export function ProductGrid({
  products,
  variant = "thumbnail",
  className = "",
}: ProductGridProps): React.JSX.Element {
  if (products.length === 0) {
    return <EmptyState />;
  }

  const gridClasses =
    variant === "detail"
      ? "grid gap-4" // Single column for detail view
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

  return (
    <div className={`${gridClasses} ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={mapToProductCardProps(product)}
          variant={variant}
        />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for ProductGrid
 */
export function ProductGridSkeleton({
  count = 8,
  variant = "thumbnail",
}: {
  count?: number;
  variant?: "thumbnail" | "detail";
}): React.JSX.Element {
  const gridClasses =
    variant === "detail"
      ? "grid gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="solid-card overflow-hidden animate-pulse">
          {/* Image skeleton */}
          <div className="aspect-square bg-[var(--peptide-bg-alt)]" />
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-4 w-16 bg-[var(--peptide-bg-alt)] rounded" />
            <div className="h-5 w-3/4 bg-[var(--peptide-bg-alt)] rounded" />
            <div className="flex gap-2">
              <div className="h-4 w-12 bg-[var(--peptide-bg-alt)] rounded" />
              <div className="h-4 w-12 bg-[var(--peptide-bg-alt)] rounded" />
            </div>
            <div className="h-6 w-20 bg-[var(--peptide-bg-alt)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
