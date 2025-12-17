/**
 * ProductCard Component
 *
 * Displays product information in two variants:
 * - thumbnail: Grid-style compact card
 * - detail: Content-style expanded card
 *
 * Uses mock data for design system preview.
 * Will integrate with Vendure API in production.
 */

import Link from "next/link";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ResearchDisclaimer } from "../compliance/ResearchDisclaimer";

/**
 * Research goal categories
 */
type ResearchGoal =
  | "Recovery"
  | "Research"
  | "Longevity"
  | "Performance"
  | "Metabolic";

/**
 * Goal badge colors
 */
const GOAL_COLORS: Record<ResearchGoal, { bg: string; text: string }> = {
  Recovery: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Research: { bg: "bg-indigo-100", text: "text-indigo-700" },
  Longevity: { bg: "bg-violet-100", text: "text-violet-700" },
  Performance: { bg: "bg-amber-100", text: "text-amber-700" },
  Metabolic: { bg: "bg-rose-100", text: "text-rose-700" },
};

/**
 * Product data structure (stub for design system)
 */
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency?: string;
  image?: string;
  description?: string;
  category?: ResearchGoal | string;
  inStock?: boolean;
  purity?: string;
  weight?: string;
}

type ProductCardVariant = "thumbnail" | "detail";

interface ProductCardProps {
  product: Product;
  variant?: ProductCardVariant;
  /** Show quick view button */
  showQuickView?: boolean;
  /** Quick view click handler */
  onQuickView?: (product: Product) => void;
  className?: string;
}

/**
 * Format price for display
 */
function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

/**
 * Goal Badge component
 */
function GoalBadge({ goal }: { goal: string }): JSX.Element {
  const colors = GOAL_COLORS[goal as ResearchGoal] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
  };
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
        ${colors.bg} ${colors.text}
      `}
    >
      {goal}
    </span>
  );
}

/**
 * Placeholder image component
 */
function PlaceholderImage({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <div
      className={`
        bg-gradient-to-br from-[var(--peptide-bg-alt)] to-[var(--peptide-border)]
        flex items-center justify-center
        ${className}
      `}
    >
      <svg
        className="w-12 h-12 text-[var(--peptide-fg-muted)]/30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

/**
 * Thumbnail variant - Compact grid card
 */
function ThumbnailCard({
  product,
  showQuickView,
  onQuickView,
  className = "",
}: ProductCardProps): JSX.Element {
  return (
    <article
      className={`
        group solid-card overflow-hidden
        flex flex-col
        ${className}
      `}
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <PlaceholderImage className="w-full h-full" />
        )}

        {/* Quick view overlay */}
        {showQuickView && onQuickView && (
          <div
            className="
              absolute inset-0 bg-[var(--peptide-fg)]/30 opacity-0 group-hover:opacity-100
              transition-opacity flex items-center justify-center backdrop-blur-sm
            "
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="bg-white hover:bg-white shadow-lg"
            >
              Quick View
            </Button>
          </div>
        )}

        {/* Stock badge */}
        {product.inStock === false && (
          <Badge
            variant="danger"
            badgeStyle="solid"
            size="sm"
            className="absolute top-2 right-2"
          >
            Out of Stock
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Goal Badge */}
        {product.category && (
          <div className="mb-2">
            <GoalBadge goal={product.category} />
          </div>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-body font-medium text-[var(--peptide-fg-strong)] line-clamp-2 hover:text-[var(--peptide-primary)] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Specs as chips */}
        {(product.purity || product.weight) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.purity && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[var(--peptide-bg-alt)] text-xs text-[var(--peptide-fg)]">
                {product.purity} Pure
              </span>
            )}
            {product.weight && (
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[var(--peptide-bg-alt)] text-xs text-[var(--peptide-fg)]">
                {product.weight}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-3 flex items-baseline justify-between">
          <span className="text-h4 text-[var(--peptide-fg-strong)]">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.inStock !== false && (
            <span className="text-xs text-[var(--peptide-accent)]">
              In Stock
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Detail variant - Content-style expanded card
 */
function DetailCard({
  product,
  showQuickView,
  onQuickView,
  className = "",
}: ProductCardProps): JSX.Element {
  return (
    <article
      className={`
        solid-card overflow-hidden
        flex flex-col sm:flex-row
        ${className}
      `}
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative sm:w-48 md:w-56 flex-shrink-0"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 sm:h-full object-cover"
          />
        ) : (
          <PlaceholderImage className="w-full h-48 sm:h-full" />
        )}

        {/* Stock badge */}
        {product.inStock === false && (
          <Badge
            variant="danger"
            badgeStyle="solid"
            size="sm"
            className="absolute top-2 right-2"
          >
            Out of Stock
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col flex-1">
        {/* Goal Badge */}
        {product.category && (
          <div className="mb-2">
            <GoalBadge goal={product.category} />
          </div>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-h3 text-[var(--peptide-fg-strong)] hover:text-[var(--peptide-primary)] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="mt-2 text-body-sm text-[var(--peptide-fg-muted)] line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Specs as grid */}
        {(product.purity || product.weight) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {product.purity && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--peptide-bg-alt)] border border-[var(--peptide-border-light)]">
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
                <span className="text-xs font-medium text-[var(--peptide-fg)]">
                  {product.purity} Purity
                </span>
              </div>
            )}
            {product.weight && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--peptide-bg-alt)] border border-[var(--peptide-border-light)]">
                <svg
                  className="w-4 h-4 text-[var(--peptide-primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <span className="text-xs font-medium text-[var(--peptide-fg)]">
                  {product.weight}
                </span>
              </div>
            )}
            {product.inStock !== false && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">
                  In Stock
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer: Price + Actions */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-4">
          <span className="text-h3 text-[var(--peptide-fg-strong)]">
            {formatPrice(product.price, product.currency)}
          </span>

          <div className="flex gap-2">
            {showQuickView && onQuickView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onQuickView(product)}
              >
                Quick View
              </Button>
            )}
            <Button variant="primary" size="sm">
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Compliance */}
        <div className="mt-3 pt-3 border-t border-[var(--peptide-border-light)]">
          <ResearchDisclaimer variant="inline" />
        </div>
      </div>
    </article>
  );
}

/**
 * Main ProductCard component
 */
export function ProductCard(props: ProductCardProps): JSX.Element {
  const { variant = "thumbnail" } = props;

  if (variant === "detail") {
    return <DetailCard {...props} />;
  }

  return <ThumbnailCard {...props} />;
}

/**
 * Mock products for design system preview
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "BPC-157 (5mg)",
    slug: "bpc-157-5mg",
    price: 49.99,
    description:
      "High-purity BPC-157 pentadecapeptide for research applications.",
    category: "Recovery",
    inStock: true,
    purity: "99%+",
    weight: "5mg",
  },
  {
    id: "2",
    name: "TB-500 (5mg)",
    slug: "tb-500-5mg",
    price: 59.99,
    description: "Thymosin Beta-4 fragment for laboratory research.",
    category: "Recovery",
    inStock: true,
    purity: "98%+",
    weight: "5mg",
  },
  {
    id: "3",
    name: "PT-141 (10mg)",
    slug: "pt-141-10mg",
    price: 44.99,
    description: "Bremelanotide peptide for research purposes.",
    category: "Research",
    inStock: false,
    purity: "99%+",
    weight: "10mg",
  },
  {
    id: "4",
    name: "Epithalon (10mg)",
    slug: "epithalon-10mg",
    price: 39.99,
    description: "Epitalon tetrapeptide for longevity research.",
    category: "Longevity",
    inStock: true,
    purity: "99%+",
    weight: "10mg",
  },
];
