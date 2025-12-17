/**
 * SpecsTable Component
 *
 * Lab datasheet-style specifications display for peptide products.
 * Two-column grid on desktop, stacked on mobile.
 * Handles missing fields gracefully.
 */

import React from "react";
import type { PeptideProduct } from "../../lib/mock-peptides";

interface SpecsTableProps {
  product: PeptideProduct;
  className?: string;
}

interface SpecRow {
  label: string;
  value: string | undefined;
  highlight?: boolean;
}

/**
 * Build specification rows from product data
 */
function buildSpecRows(product: PeptideProduct): SpecRow[] {
  const rows: SpecRow[] = [];

  // Always show CAS Number prominently
  if (product.casNumber) {
    rows.push({
      label: "CAS Number",
      value: product.casNumber,
      highlight: true,
    });
  }

  // Purity is critical for research
  if (product.purity) {
    rows.push({ label: "Purity", value: product.purity, highlight: true });
  }

  // Molecular weight
  if (product.molecularWeight) {
    rows.push({ label: "Molecular Weight", value: product.molecularWeight });
  }

  // Sequence for peptides
  if (product.sequence) {
    rows.push({ label: "Sequence", value: product.sequence });
  }

  // Storage conditions
  if (product.storage) {
    rows.push({ label: "Storage", value: product.storage });
  }

  // Administration route (research context)
  if (product.administrationRoute) {
    rows.push({ label: "Administration", value: product.administrationRoute });
  }

  // Form factor
  if (product.form) {
    rows.push({ label: "Form", value: product.form });
  }

  return rows;
}

/**
 * Individual specification row
 */
function SpecRowItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3
        border-b border-[var(--peptide-border-light)] last:border-b-0
      `}
    >
      <dt
        className={`
          text-body-sm font-medium sm:w-40 flex-shrink-0
          ${highlight ? "text-[var(--peptide-fg-strong)]" : "text-[var(--peptide-fg-muted)]"}
        `}
      >
        {label}
      </dt>
      <dd
        className={`
          text-body-sm font-mono
          ${highlight ? "text-[var(--peptide-primary)] font-medium" : "text-[var(--peptide-fg)]"}
        `}
      >
        {value}
      </dd>
    </div>
  );
}

export function SpecsTable({
  product,
  className = "",
}: SpecsTableProps): React.JSX.Element {
  const specRows = buildSpecRows(product);

  if (specRows.length === 0) {
    return (
      <div
        className={`text-body-sm text-[var(--peptide-fg-muted)] ${className}`}
      >
        No specifications available.
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-[var(--peptide-fg-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-h4 text-[var(--peptide-fg-strong)]">
          Technical Specifications
        </h3>
      </div>

      {/* Specs List */}
      <dl className="solid-card p-4 sm:p-6">
        {specRows.map((row) =>
          row.value ? (
            <SpecRowItem
              key={row.label}
              label={row.label}
              value={row.value}
              highlight={row.highlight}
            />
          ) : null,
        )}
      </dl>

      {/* COA/SDS Links */}
      {(product.coaUrl || product.sdsUrl) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {product.coaUrl && (
            <a
              href={product.coaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-4 py-2
                text-body-sm font-medium
                text-[var(--peptide-primary)]
                bg-[var(--peptide-primary)]/5
                border border-[var(--peptide-primary)]/20
                rounded-lg
                hover:bg-[var(--peptide-primary)]/10
                transition-colors
              "
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Certificate of Analysis
            </a>
          )}
          {product.sdsUrl && (
            <a
              href={product.sdsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-4 py-2
                text-body-sm font-medium
                text-[var(--peptide-fg-muted)]
                bg-[var(--peptide-bg-alt)]
                border border-[var(--peptide-border)]
                rounded-lg
                hover:border-[var(--peptide-border-hover)]
                transition-colors
              "
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Safety Data Sheet
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact specs display for use in cards or previews
 */
export function SpecsCompact({
  product,
  className = "",
}: SpecsTableProps): React.JSX.Element {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1 ${className}`}>
      {product.purity && (
        <span className="text-body-sm">
          <span className="text-[var(--peptide-fg-muted)]">Purity:</span>{" "}
          <span className="font-medium text-[var(--peptide-accent)]">
            {product.purity}
          </span>
        </span>
      )}
      {product.casNumber && (
        <span className="text-body-sm">
          <span className="text-[var(--peptide-fg-muted)]">CAS:</span>{" "}
          <span className="font-mono text-[var(--peptide-fg)]">
            {product.casNumber}
          </span>
        </span>
      )}
      {product.molecularWeight && (
        <span className="text-body-sm">
          <span className="text-[var(--peptide-fg-muted)]">MW:</span>{" "}
          <span className="font-mono text-[var(--peptide-fg)]">
            {product.molecularWeight}
          </span>
        </span>
      )}
    </div>
  );
}
