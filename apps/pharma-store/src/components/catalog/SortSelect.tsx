"use client";

/**
 * SortSelect Component
 *
 * Dropdown for selecting product sort order.
 * Follows the PEPTIDES design system.
 */

import React from "react";

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "name-asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export function SortSelect({
  value,
  onChange,
  className = "",
}: SortSelectProps): React.JSX.Element {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label
        htmlFor="sort-select"
        className="text-body-sm text-[var(--peptide-fg-muted)] whitespace-nowrap"
      >
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="
          px-3 py-2 pr-8
          text-body-sm text-[var(--peptide-fg)]
          bg-[var(--peptide-bg-elevated)]
          border border-[var(--peptide-border)]
          rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[var(--peptide-primary)]/30 focus:border-[var(--peptide-primary)]
          transition-all duration-200
          cursor-pointer
          appearance-none
          bg-no-repeat bg-right
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 0.5rem center",
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Export sort options for use in other components
 */
export { SORT_OPTIONS };
