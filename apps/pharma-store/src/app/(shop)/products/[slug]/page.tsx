/**
 * Product Detail Page (PDP)
 *
 * Route: /products/[slug]
 *
 * Displays detailed product information with ISR (Incremental Static Regeneration).
 * Pre-renders all product pages at build time via generateStaticParams.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  fetchProductBySlug,
  getAllProductSlugs,
  fetchRelatedProducts,
} from "../../../../lib/queries/products";
import { PageContainer } from "../../../../components/layout/PageShell";
import { ProductDetails } from "../../../../components/pdp/ProductDetails";
import { ProductGrid } from "../../../../components/catalog/ProductGrid";

/**
 * ISR Configuration
 * Revalidate pages every 60 seconds
 */
export const revalidate = 60;

/**
 * Generate static params for all product slugs
 * This pre-renders all product pages at build time
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | PEPTIDES",
      description: "The requested product could not be found.",
    };
  }

  const description = product.description
    ? product.description.substring(0, 155) +
      (product.description.length > 155 ? "..." : "")
    : `${product.name} - High-purity research peptide available in multiple sizes. For research use only.`;

  return {
    title: `${product.name} | PEPTIDES Research`,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | PEPTIDES`,
      description,
      type: "website",
      images: product.featuredImage
        ? [
            {
              url: product.featuredImage,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },
    // TODO: Add Product JSON-LD schema
    // other: {
    //   'product:price': product.variants[0]?.price.toString(),
    //   'product:availability': product.variants.some(v => v.inStock) ? 'in stock' : 'out of stock',
    // },
  };
}

/**
 * Breadcrumb component
 */
function Breadcrumbs({
  productName,
}: {
  productName: string;
}): React.JSX.Element {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-body-sm">
        <li>
          <Link
            href="/"
            className="text-[var(--peptide-fg-muted)] hover:text-[var(--peptide-fg)] transition-colors"
          >
            Home
          </Link>
        </li>
        <li className="text-[var(--peptide-fg-muted)]">/</li>
        <li>
          <Link
            href="/products"
            className="text-[var(--peptide-fg-muted)] hover:text-[var(--peptide-fg)] transition-colors"
          >
            Products
          </Link>
        </li>
        <li className="text-[var(--peptide-fg-muted)]">/</li>
        <li>
          <span
            className="text-[var(--peptide-fg-strong)] font-medium"
            aria-current="page"
          >
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products for cross-sell
  const relatedProducts = await fetchRelatedProducts(slug, 4);

  return (
    <>
      {/* Main Product Section */}
      <PageContainer>
        <div className="py-8 md:py-12">
          <Breadcrumbs productName={product.shortName || product.name} />
          <ProductDetails product={product} />
        </div>
      </PageContainer>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="bg-[var(--peptide-bg-alt)] border-t border-[var(--peptide-border-light)]">
          <PageContainer>
            <div className="py-12 md:py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-h2 text-[var(--peptide-fg-strong)]">
                  Related Products
                </h2>
                <Link
                  href="/products"
                  className="
                    text-body-sm font-medium text-[var(--peptide-primary)]
                    hover:text-[var(--peptide-primary-dark)] transition-colors
                  "
                >
                  View All Products →
                </Link>
              </div>
              <ProductGrid products={relatedProducts} variant="thumbnail" />
            </div>
          </PageContainer>
        </section>
      )}
    </>
  );
}
