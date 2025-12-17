/**
 * Product Not Found Page
 *
 * Displayed when a product slug doesn't match any known products.
 */

import Link from "next/link";
import { PageContainer } from "../../../../components/layout/PageShell";

export default function ProductNotFound(): React.JSX.Element {
  return (
    <PageContainer>
      <div className="py-16 md:py-24 text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--peptide-bg-alt)] flex items-center justify-center">
          <svg
            className="w-10 h-10 text-[var(--peptide-fg-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-h1 text-[var(--peptide-fg-strong)] mb-4">
          Product Not Found
        </h1>
        <p className="text-body text-[var(--peptide-fg-muted)] max-w-md mx-auto mb-8">
          The product you&apos;re looking for doesn&apos;t exist or may have
          been removed from our catalog.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-[var(--peptide-primary)] text-white
              rounded-lg font-medium text-body
              hover:bg-[var(--peptide-primary-dark)]
              transition-colors
            "
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Browse All Products
          </Link>
          <Link
            href="/"
            className="
              inline-flex items-center gap-2 px-6 py-3
              bg-[var(--peptide-bg-elevated)] text-[var(--peptide-fg)]
              border border-[var(--peptide-border)]
              rounded-lg font-medium text-body
              hover:border-[var(--peptide-border-hover)]
              transition-colors
            "
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
