/**
 * ResearchDisclaimer Component
 *
 * CRITICAL COMPLIANCE REQUIREMENT (per CLAUDE.md):
 * "For Research Use Only / Not for human use."
 * must appear on all product-related pages.
 *
 * Variants:
 * - banner: Full-width persistent header banner
 * - inline: Compact inline text with icon
 * - footer: Subtle footer disclaimer
 * - card: Standalone card for product pages
 */

import type { ReactNode } from "react";

const DISCLAIMER_TEXT = "For Research Use Only / Not for human use.";

type DisclaimerVariant = "banner" | "inline" | "footer" | "card";

interface ResearchDisclaimerProps {
  variant?: DisclaimerVariant;
  className?: string;
  children?: ReactNode;
}

/**
 * Flask/beaker icon for scientific context
 */
function ScienceIcon({ className = "" }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 3h6v8l4 9H5l4-9V3z" />
      <path d="M9 3h6" />
      <path d="M6 21h12" />
    </svg>
  );
}

/**
 * Banner variant - Full-width gradient banner at top of page
 */
function BannerDisclaimer({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <div
      role="banner"
      aria-label="Research use disclaimer"
      className={`compliance-banner flex items-center justify-center gap-2 ${className}`}
    >
      <ScienceIcon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{DISCLAIMER_TEXT}</span>
    </div>
  );
}

/**
 * Inline variant - Compact text with icon for inline use
 */
function InlineDisclaimer({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs text-[var(--peptide-fg-muted)] ${className}`}
    >
      <ScienceIcon className="w-3 h-3 flex-shrink-0" />
      <span className="font-medium">{DISCLAIMER_TEXT}</span>
    </div>
  );
}

/**
 * Footer variant - Subtle text for page footers
 */
function FooterDisclaimer({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <p
      className={`text-xs text-[var(--peptide-fg-muted)] text-center ${className}`}
    >
      <ScienceIcon className="inline-block w-3 h-3 mr-1 -mt-0.5" />
      {DISCLAIMER_TEXT}
    </p>
  );
}

/**
 * Card variant - Standalone card for prominent display on product pages
 */
function CardDisclaimer({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}): JSX.Element {
  return (
    <div
      className={`
        rounded-lg border border-[var(--peptide-border)]
        bg-gradient-to-r from-[var(--peptide-secondary)]/5 to-[var(--peptide-primary)]/5
        shadow-elevated p-4 ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--peptide-secondary)]/10 flex items-center justify-center">
          <ScienceIcon className="w-4 h-4 text-[var(--peptide-secondary)]" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm text-[var(--peptide-fg-strong)]">
            {DISCLAIMER_TEXT}
          </p>
          {children && (
            <p className="mt-1 text-xs text-[var(--peptide-fg)]">{children}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main ResearchDisclaimer component
 *
 * @param variant - Display variant (banner, inline, footer, card)
 * @param className - Additional CSS classes
 * @param children - Additional content (only for card variant)
 *
 * @example
 * ```tsx
 * // Banner at top of page
 * <ResearchDisclaimer variant="banner" />
 *
 * // Inline in product info
 * <ResearchDisclaimer variant="inline" />
 *
 * // Card on PDP
 * <ResearchDisclaimer variant="card">
 *   This product is intended for laboratory research only.
 * </ResearchDisclaimer>
 * ```
 */
export function ResearchDisclaimer({
  variant = "banner",
  className = "",
  children,
}: ResearchDisclaimerProps): JSX.Element {
  switch (variant) {
    case "banner":
      return <BannerDisclaimer className={className} />;
    case "inline":
      return <InlineDisclaimer className={className} />;
    case "footer":
      return <FooterDisclaimer className={className} />;
    case "card":
      return <CardDisclaimer className={className}>{children}</CardDisclaimer>;
    default:
      return <BannerDisclaimer className={className} />;
  }
}

/**
 * Export the disclaimer text for use in other components
 */
export { DISCLAIMER_TEXT };
