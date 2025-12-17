"use client";

/**
 * FilterPanel Component
 *
 * Filter controls for the product catalog:
 * - Goal category chips (multi-select)
 * - In-stock toggle
 *
 * v1: Client-side filtering with mock data
 * TODO: Integrate with Vendure facet queries for server-side filtering
 */

import React from "react";
import type { ResearchGoal } from "../../lib/mock-peptides";

/**
 * Goal category configuration with colors
 */
const GOAL_CONFIG: Record<ResearchGoal, { label: string; color: string }> = {
  Recovery: {
    label: "Recovery",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  Metabolic: {
    label: "Metabolic",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  Longevity: {
    label: "Longevity",
    color: "bg-violet-100 text-violet-700 border-violet-200",
  },
  Cognitive: {
    label: "Cognitive",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  Cosmetic: {
    label: "Cosmetic",
    color: "bg-pink-100 text-pink-700 border-pink-200",
  },
  Research: {
    label: "Research",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
};

const ALL_GOALS: ResearchGoal[] = [
  "Recovery",
  "Metabolic",
  "Longevity",
  "Cognitive",
  "Cosmetic",
  "Research",
];

interface FilterPanelProps {
  selectedGoals: ResearchGoal[];
  onGoalsChange: (goals: ResearchGoal[]) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  className?: string;
}

export function FilterPanel({
  selectedGoals,
  onGoalsChange,
  inStockOnly,
  onInStockChange,
  className = "",
}: FilterPanelProps): React.JSX.Element {
  const toggleGoal = (goal: ResearchGoal): void => {
    if (selectedGoals.includes(goal)) {
      onGoalsChange(selectedGoals.filter((g) => g !== goal));
    } else {
      onGoalsChange([...selectedGoals, goal]);
    }
  };

  const clearFilters = (): void => {
    onGoalsChange([]);
    onInStockChange(false);
  };

  const hasActiveFilters = selectedGoals.length > 0 || inStockOnly;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Goal Filter Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-overline">Research Goals</span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="
                text-xs text-[var(--peptide-primary)]
                hover:text-[var(--peptide-primary-dark)]
                transition-colors
              "
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal);
            const config = GOAL_CONFIG[goal];

            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`
                  inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium
                  border transition-all duration-200
                  ${
                    isSelected
                      ? `${config.color} ring-2 ring-offset-1 ring-[var(--peptide-primary)]/30`
                      : "bg-[var(--peptide-bg-alt)] text-[var(--peptide-fg-muted)] border-[var(--peptide-border-light)] hover:border-[var(--peptide-border)] hover:text-[var(--peptide-fg)]"
                  }
                `}
                aria-pressed={isSelected}
              >
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center gap-3 pt-2 border-t border-[var(--peptide-border-light)]">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="
                w-9 h-5 rounded-full
                bg-[var(--peptide-border)]
                peer-checked:bg-[var(--peptide-accent)]
                transition-colors duration-200
              "
            />
            <div
              className="
                absolute left-0.5 top-0.5
                w-4 h-4 rounded-full
                bg-white shadow-sm
                peer-checked:translate-x-4
                transition-transform duration-200
              "
            />
          </div>
          <span className="text-body-sm text-[var(--peptide-fg)]">
            In Stock Only
          </span>
        </label>
      </div>
    </div>
  );
}

/**
 * Compact filter bar variant for mobile/horizontal layout
 */
export function FilterBar({
  selectedGoals,
  onGoalsChange,
  inStockOnly,
  onInStockChange,
  className = "",
}: FilterPanelProps): React.JSX.Element {
  const toggleGoal = (goal: ResearchGoal): void => {
    if (selectedGoals.includes(goal)) {
      onGoalsChange(selectedGoals.filter((g) => g !== goal));
    } else {
      onGoalsChange([...selectedGoals, goal]);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 overflow-x-auto pb-2 ${className}`}
    >
      {/* In-stock chip */}
      <button
        onClick={() => onInStockChange(!inStockOnly)}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
          border whitespace-nowrap transition-all duration-200
          ${
            inStockOnly
              ? "bg-emerald-100 text-emerald-700 border-emerald-200 ring-2 ring-offset-1 ring-emerald-200"
              : "bg-[var(--peptide-bg-alt)] text-[var(--peptide-fg-muted)] border-[var(--peptide-border-light)] hover:border-[var(--peptide-border)]"
          }
        `}
        aria-pressed={inStockOnly}
      >
        <span
          className={`w-2 h-2 rounded-full ${inStockOnly ? "bg-emerald-500" : "bg-[var(--peptide-fg-muted)]"}`}
        />
        In Stock
      </button>

      <span className="w-px h-5 bg-[var(--peptide-border-light)]" />

      {/* Goal chips */}
      {ALL_GOALS.map((goal) => {
        const isSelected = selectedGoals.includes(goal);
        const config = GOAL_CONFIG[goal];

        return (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium
              border whitespace-nowrap transition-all duration-200
              ${
                isSelected
                  ? `${config.color}`
                  : "bg-[var(--peptide-bg-alt)] text-[var(--peptide-fg-muted)] border-[var(--peptide-border-light)] hover:border-[var(--peptide-border)]"
              }
            `}
            aria-pressed={isSelected}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
}

export { ALL_GOALS, GOAL_CONFIG };
