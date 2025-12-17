"use client";

/**
 * CatalogContent Component
 *
 * Client component that handles product filtering and sorting.
 * Receives initial products from server component and filters client-side.
 */

import React, { useState, useMemo } from "react";
import { ProductGrid } from "../../../components/catalog/ProductGrid";
import { FilterBar } from "../../../components/catalog/FilterPanel";
import {
  SortSelect,
  type SortOption,
} from "../../../components/catalog/SortSelect";
import type { PeptideProduct, ResearchGoal } from "../../../lib/mock-peptides";
import { getLowestPrice, isInStock } from "../../../lib/queries/products";

interface CatalogContentProps {
  initialProducts: PeptideProduct[];
}

export function CatalogContent({
  initialProducts,
}: CatalogContentProps): React.JSX.Element {
  // Filter state
  const [selectedGoals, setSelectedGoals] = useState<ResearchGoal[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("recommended");

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by categories
    if (selectedGoals.length > 0) {
      result = result.filter((p) => selectedGoals.includes(p.category));
    }

    // Filter by stock status
    if (inStockOnly) {
      result = result.filter((p) => isInStock(p));
    }

    // Sort
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case "price-desc":
        result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recommended":
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.popularity || 0) - (a.popularity || 0);
        });
        break;
    }

    return result;
  }, [initialProducts, selectedGoals, inStockOnly, sortOption]);

  // Count active filters
  const activeFilterCount = selectedGoals.length + (inStockOnly ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Toolbar: Filters + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Bar */}
        <div className="flex-1 min-w-0">
          <FilterBar
            selectedGoals={selectedGoals}
            onGoalsChange={setSelectedGoals}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
          />
        </div>

        {/* Sort + Results Count */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-body-sm text-[var(--peptide-fg-muted)] hidden md:block">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
            {activeFilterCount > 0 && (
              <span className="ml-1">
                ({activeFilterCount}{" "}
                {activeFilterCount === 1 ? "filter" : "filters"})
              </span>
            )}
          </span>
          <SortSelect value={sortOption} onChange={setSortOption} />
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} variant="thumbnail" />

      {/* Results summary for mobile */}
      <div className="text-center md:hidden">
        <span className="text-body-sm text-[var(--peptide-fg-muted)]">
          Showing {filteredProducts.length} of {initialProducts.length} products
        </span>
      </div>
    </div>
  );
}
