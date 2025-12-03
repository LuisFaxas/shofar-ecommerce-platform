/**
 * Home Page
 *
 * Landing page for PEPTIDES pharma-store.
 */

import Link from 'next/link';
import { PageContainer, Section } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassPanel';
import { Badge } from '../../components/ui/Badge';
import { ProductCard, MOCK_PRODUCTS } from '../../components/catalog/ProductCard';
import { ResearchDisclaimer } from '../../components/compliance/ResearchDisclaimer';

/**
 * Feature card data
 */
const FEATURES = [
  {
    title: 'Purity Guaranteed',
    description: '99%+ purity on all peptides, verified by third-party testing.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Fast Shipping',
    description: 'Temperature-controlled shipping with next-day delivery available.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Research Support',
    description: 'Comprehensive documentation and research protocols provided.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function HomePage(): JSX.Element {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--peptide-primary)]/5 via-transparent to-[var(--peptide-secondary)]/5" />

        <PageContainer className="relative">
          <div className="py-16 md:py-24 text-center">
            <Badge variant="secondary" badgeStyle="subtle" className="mb-4">
              Research-Grade Peptides
            </Badge>
            <h1 className="text-display text-[var(--peptide-fg)] max-w-3xl mx-auto">
              Premium Research Peptides for{' '}
              <span className="text-[var(--peptide-primary)]">Scientific Discovery</span>
            </h1>
            <p className="mt-6 text-body text-[var(--peptide-fg-muted)] max-w-2xl mx-auto">
              High-purity research peptides with guaranteed quality. Supporting laboratories
              and researchers worldwide with reliable, tested compounds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/research">View Research</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Features Section */}
      <section className="bg-[var(--peptide-bg-alt)] border-y border-[var(--peptide-border)]">
        <PageContainer>
          <div className="py-12">
            <div className="grid md:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <GlassCard key={feature.title} padding="lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--peptide-primary)]/10 flex items-center justify-center text-[var(--peptide-primary)]">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-h4 text-[var(--peptide-fg)]">{feature.title}</h3>
                      <p className="mt-1 text-body-sm text-[var(--peptide-fg-muted)]">
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
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="thumbnail"
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </Section>
      </PageContainer>

      {/* Compliance Section */}
      <section className="bg-[var(--peptide-bg-alt)] border-y border-[var(--peptide-border)]">
        <PageContainer narrow>
          <div className="py-12">
            <ResearchDisclaimer variant="card">
              All products sold by PEPTIDES are intended solely for use in legitimate
              scientific research conducted by qualified researchers. Products are not
              intended for human consumption, therapeutic use, or any other non-research
              purpose.
            </ResearchDisclaimer>
          </div>
        </PageContainer>
      </section>

      {/* CTA Section */}
      <PageContainer>
        <Section className="text-center">
          <h2 className="text-h2 text-[var(--peptide-fg)]">
            Ready to advance your research?
          </h2>
          <p className="mt-4 text-body text-[var(--peptide-fg-muted)] max-w-xl mx-auto">
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
