/**
 * Home Page
 *
 * Landing page for PEPTIDES pharma-store.
 */

import Link from "next/link";
import { PageContainer, Section } from "../../components/layout/PageShell";
import { Button } from "../../components/ui/Button";
import { GlassPanel, GlassCard } from "../../components/ui/GlassPanel";
import { Badge } from "../../components/ui/Badge";
import { ProductCard } from "../../components/catalog/ProductCard";
import {
  fetchFeaturedProducts,
  getPriceRange,
  isInStock,
  getDefaultVariant,
} from "../../lib/queries/products";
import { ResearchDisclaimer } from "../../components/compliance/ResearchDisclaimer";

/**
 * Feature card data
 */
const FEATURES = [
  {
    title: "Purity Guaranteed",
    description:
      "99%+ purity on all peptides, verified by third-party testing.",
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
  },
  {
    title: "Fast Shipping",
    description:
      "Temperature-controlled shipping with next-day delivery available.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Research Support",
    description: "Comprehensive documentation and research protocols provided.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
];

export default async function HomePage(): Promise<React.JSX.Element> {
  // Fetch featured products from the data layer
  const featuredProducts = await fetchFeaturedProducts(4);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background - subtle radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(139, 92, 246, 0.06) 0%, transparent 40%)",
          }}
        />

        <PageContainer className="relative">
          <div className="py-16 md:py-24">
            <GlassPanel
              padding="lg"
              className="max-w-4xl mx-auto text-center shadow-elevated border-[var(--peptide-border)]"
            >
              <Badge variant="secondary" badgeStyle="subtle" className="mb-4">
                Research-Grade Peptides
              </Badge>
              <h1 className="text-display text-[var(--peptide-fg-strong)]">
                Premium Research Peptides for{" "}
                <span className="bg-gradient-to-r from-[var(--peptide-primary)] to-[var(--peptide-secondary)] bg-clip-text text-transparent">
                  Scientific Discovery
                </span>
              </h1>
              <p className="mt-6 text-body text-[var(--peptide-fg-muted)] max-w-2xl mx-auto">
                High-purity research peptides with guaranteed quality.
                Supporting laboratories and researchers worldwide with reliable,
                tested compounds.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/research">View Research</Link>
                </Button>
              </div>
            </GlassPanel>
          </div>
        </PageContainer>
      </section>

      {/* Features Section */}
      <section className="bg-[var(--peptide-bg-alt)] border-y border-[var(--peptide-border-light)]">
        <PageContainer>
          <div className="py-12 md:py-16">
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <GlassCard key={feature.title} variant="solid" padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--peptide-primary)]/15 to-[var(--peptide-secondary)]/15 flex items-center justify-center text-[var(--peptide-primary)]">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-h4 text-[var(--peptide-fg-strong)]">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-body-sm text-[var(--peptide-fg)]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Featured Products */}
      <PageContainer>
        <Section
          title="Featured Products"
          description="Our most popular research peptides, trusted by laboratories worldwide."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => {
              const defaultVariant = getDefaultVariant(product);
              return (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.shortName || product.name,
                    slug: product.slug,
                    price: defaultVariant.price / 100,
                    currency: "USD",
                    description: product.description,
                    category: product.category,
                    inStock: isInStock(product),
                    purity: product.purity,
                    weight: defaultVariant.size,
                    image: product.featuredImage,
                  }}
                  variant="thumbnail"
                />
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </Section>
      </PageContainer>

      {/* Compliance Section */}
      <section className="bg-[var(--peptide-bg-alt)] border-y border-[var(--peptide-border-light)]">
        <PageContainer narrow>
          <div className="py-12 md:py-16">
            <ResearchDisclaimer variant="card">
              All products sold by PEPTIDES are intended solely for use in
              legitimate scientific research conducted by qualified researchers.
              Products are not intended for human consumption, therapeutic use,
              or any other non-research purpose.
            </ResearchDisclaimer>
          </div>
        </PageContainer>
      </section>

      {/* CTA Section */}
      <PageContainer>
        <Section className="text-center border-t border-[var(--peptide-border-light)] pt-12 md:pt-16">
          <h2 className="text-h2 text-[var(--peptide-fg-strong)]">
            Ready to advance your research?
          </h2>
          <p className="mt-4 text-body text-[var(--peptide-fg)] max-w-xl mx-auto">
            Browse our complete catalog of research peptides or contact our team
            for custom synthesis inquiries.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </Section>
      </PageContainer>
    </>
  );
}
