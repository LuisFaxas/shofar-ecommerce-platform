/**
 * Products Catalog Page
 *
 * Route: /products
 *
 * Displays all peptide products with filtering and sorting.
 * Server component that fetches initial data.
 */

import type { Metadata } from "next";
import { fetchProducts } from "../../../lib/queries/products";
import { PageContainer, Section } from "../../../components/layout/PageShell";
import { ResearchDisclaimer } from "../../../components/compliance/ResearchDisclaimer";
import { CatalogContent } from "./CatalogContent";

export const metadata: Metadata = {
  title: "Research Peptides | PEPTIDES",
  description:
    "Browse our complete catalog of high-purity research peptides. All products are for research use only and are backed by third-party testing.",
  alternates: {
    canonical: "/products",
  },
};

export default async function ProductsPage(): Promise<React.JSX.Element> {
  // Fetch initial products (no filters applied)
  const { products, totalCount } = await fetchProducts();

  return (
    <>
      {/* Page Header */}
      <section className="bg-[var(--peptide-bg-alt)] border-b border-[var(--peptide-border-light)]">
        <PageContainer>
          <div className="py-8 md:py-12">
            <h1 className="text-h1 text-[var(--peptide-fg-strong)]">
              Research Peptides
            </h1>
            <p className="mt-2 text-body text-[var(--peptide-fg-muted)] max-w-2xl">
              High-purity research peptides for laboratory and scientific
              applications. All products undergo rigorous third-party testing to
              ensure quality.
            </p>
            <p className="mt-4 text-body-sm text-[var(--peptide-fg-muted)]">
              Showing {totalCount} products
            </p>
          </div>
        </PageContainer>
      </section>

      {/* Catalog Content (Client Component for filtering/sorting) */}
      <PageContainer>
        <div className="py-8 md:py-12">
          <CatalogContent initialProducts={products} />
        </div>
      </PageContainer>

      {/* Compliance Section */}
      <section className="bg-[var(--peptide-bg-alt)] border-t border-[var(--peptide-border-light)]">
        <PageContainer narrow>
          <div className="py-8 md:py-12">
            <ResearchDisclaimer variant="card">
              All products sold by PEPTIDES are intended solely for legitimate
              scientific research conducted by qualified researchers. Products
              are not for human consumption, therapeutic use, or any other
              non-research purpose.
            </ResearchDisclaimer>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
