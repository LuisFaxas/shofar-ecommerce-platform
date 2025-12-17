/**
 * Product Data Fetching Layer
 *
 * This module provides functions for fetching peptide product data from Vendure.
 *
 * Data source priority:
 * 1. Vendure peptide channel (production/staging)
 * 2. Mock data fallback (when NEXT_PUBLIC_PEPTIDES_USE_MOCKS=true)
 *
 * See docs/peptide/VENDURE_INTEGRATION.md for setup instructions.
 */

import { gql } from "@apollo/client";
import { getPeptideClient } from "../api-client";
import {
  MOCK_PEPTIDES,
  type PeptideProduct,
  type PeptideVariant,
  type ResearchGoal,
  getLowestPrice,
} from "../mock-peptides";

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Enable mock data fallback for development
 * Set NEXT_PUBLIC_PEPTIDES_USE_MOCKS=true to bypass Vendure
 */
const USE_MOCKS = process.env.NEXT_PUBLIC_PEPTIDES_USE_MOCKS === "true";

// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

const GET_PEPTIDE_PRODUCTS = gql`
  query GetPeptideProducts($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset {
          id
          preview
          source
        }
        assets {
          id
          preview
          source
          name
        }
        customFields {
          casNumber
          sequence
          family
          researchGoals
          sdsUrl
          coaUrl
          molecularWeight
          molecularFormula
          featured
          popularity
        }
        variants {
          id
          name
          sku
          price
          priceWithTax
          currencyCode
          stockLevel
          featuredAsset {
            id
            preview
            source
          }
          customFields {
            purityPercent
            sizeMg
            storage
            administrationRoute
            form
          }
        }
        facetValues {
          id
          code
          name
          facet {
            id
            code
            name
          }
        }
      }
      totalItems
    }
  }
`;

const GET_PEPTIDE_PRODUCT = gql`
  query GetPeptideProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        id
        preview
        source
      }
      assets {
        id
        preview
        source
        name
      }
      customFields {
        casNumber
        sequence
        family
        researchGoals
        sdsUrl
        coaUrl
        molecularWeight
        molecularFormula
        featured
        popularity
      }
      variants {
        id
        name
        sku
        price
        priceWithTax
        currencyCode
        stockLevel
        featuredAsset {
          id
          preview
          source
        }
        customFields {
          purityPercent
          sizeMg
          storage
          administrationRoute
          form
        }
      }
      facetValues {
        id
        code
        name
        facet {
          id
          code
          name
        }
      }
    }
  }
`;

const GET_PEPTIDE_PRODUCT_SLUGS = gql`
  query GetPeptideProductSlugs($options: ProductListOptions) {
    products(options: $options) {
      items {
        slug
      }
      totalItems
    }
  }
`;

// ============================================================================
// TYPES
// ============================================================================

export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export interface FetchProductsOptions {
  /** Filter by research goal categories */
  categories?: ResearchGoal[];
  /** Only show in-stock products */
  inStockOnly?: boolean;
  /** Sort order */
  sort?: SortOption;
  /** Number of products to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
  /** Search query */
  search?: string;
}

export interface FetchProductsResult {
  products: PeptideProduct[];
  totalCount: number;
  hasMore: boolean;
}

// Vendure Shop API response types (simplified)
interface ShopAsset {
  id: string;
  preview: string;
  source: string;
  name?: string;
}

interface ShopFacetValue {
  id: string;
  code: string;
  name: string;
  facet: {
    id: string;
    code: string;
    name: string;
  };
}

interface ShopVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  priceWithTax: number;
  currencyCode: string;
  stockLevel: string;
  featuredAsset?: ShopAsset;
  customFields?: {
    purityPercent?: string;
    sizeMg?: string;
    storage?: string;
    administrationRoute?: string;
    form?: string;
  };
}

interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset?: ShopAsset;
  assets?: ShopAsset[];
  customFields?: {
    casNumber?: string;
    sequence?: string;
    family?: string;
    researchGoals?: string[];
    sdsUrl?: string;
    coaUrl?: string;
    molecularWeight?: string;
    molecularFormula?: string;
    featured?: boolean;
    popularity?: number;
  };
  variants: ShopVariant[];
  facetValues?: ShopFacetValue[];
}

// ============================================================================
// MAPPERS: Vendure → PeptideProduct
// ============================================================================

/**
 * Map Vendure variant to PeptideVariant
 */
function mapVariant(v: ShopVariant): PeptideVariant {
  const customFields = v.customFields || {};
  return {
    id: v.id,
    name: v.name,
    sku: v.sku,
    size: customFields.sizeMg || v.name,
    price: v.price, // Already in cents from Vendure
    inStock:
      v.stockLevel !== "OUT_OF_STOCK" && parseInt(v.stockLevel || "0", 10) > 0,
  };
}

/**
 * Map Vendure product to PeptideProduct
 */
function mapShopProductToPeptideProduct(
  shopProduct: ShopProduct,
): PeptideProduct {
  const customFields = shopProduct.customFields || {};
  const firstVariant = shopProduct.variants?.[0];
  const variantCustomFields = firstVariant?.customFields || {};

  // Determine category from researchGoals or facetValues
  let category: ResearchGoal = "Research";
  if (customFields.researchGoals && customFields.researchGoals.length > 0) {
    category = customFields.researchGoals[0] as ResearchGoal;
  } else if (shopProduct.facetValues) {
    const goalFacet = shopProduct.facetValues.find(
      (fv) => fv.facet.code === "research-goal",
    );
    if (goalFacet) {
      category = goalFacet.name as ResearchGoal;
    }
  }

  return {
    id: shopProduct.id,
    slug: shopProduct.slug,
    name: shopProduct.name,
    shortName: shopProduct.name.split(" ")[0], // First word as shortName
    description: shopProduct.description || "",
    category,
    researchApplications: [], // Could add another custom field if needed
    casNumber: customFields.casNumber || "",
    purity: variantCustomFields.purityPercent || "",
    molecularWeight: customFields.molecularWeight || "",
    molecularFormula: customFields.molecularFormula || undefined,
    sequence: customFields.sequence || undefined,
    form: variantCustomFields.form || "Lyophilized powder",
    storage: variantCustomFields.storage || "",
    administrationRoute: variantCustomFields.administrationRoute || "",
    variants: (shopProduct.variants || []).map(mapVariant),
    featuredImage: shopProduct.featuredAsset?.preview,
    images: shopProduct.assets?.map((a) => a.preview),
    coaUrl: customFields.coaUrl || undefined,
    sdsUrl: customFields.sdsUrl || undefined,
    featured: customFields.featured || false,
    popularity: customFields.popularity || 0,
  };
}

// ============================================================================
// MOCK DATA HELPERS
// ============================================================================

/**
 * Fetch products from mock data (used when USE_MOCKS=true)
 */
async function fetchProductsFromMocks(
  options: FetchProductsOptions = {},
): Promise<FetchProductsResult> {
  const {
    categories,
    inStockOnly = false,
    sort = "recommended",
    limit,
    offset = 0,
    search,
  } = options;

  let filtered = [...MOCK_PEPTIDES];

  // Filter by categories
  if (categories && categories.length > 0) {
    filtered = filtered.filter((p) => categories.includes(p.category));
  }

  // Filter by stock status
  if (inStockOnly) {
    filtered = filtered.filter((p) => p.variants.some((v) => v.inStock));
  }

  // Search filter
  if (search && search.trim()) {
    const query = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.shortName?.toLowerCase().includes(query) ||
        p.slug.includes(query) ||
        p.casNumber.includes(query) ||
        p.description.toLowerCase().includes(query),
    );
  }

  // Sort
  switch (sort) {
    case "price-asc":
      filtered.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
      break;
    case "price-desc":
      filtered.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
      break;
    case "name-asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "recommended":
    default:
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.popularity || 0) - (a.popularity || 0);
      });
      break;
  }

  const totalCount = filtered.length;

  // Apply pagination
  if (limit !== undefined) {
    filtered = filtered.slice(offset, offset + limit);
  } else if (offset > 0) {
    filtered = filtered.slice(offset);
  }

  const hasMore = offset + filtered.length < totalCount;

  return {
    products: filtered,
    totalCount,
    hasMore,
  };
}

// ============================================================================
// FETCH FUNCTIONS
// ============================================================================

/**
 * Fetch list of peptide products with optional filtering and sorting
 *
 * @example
 * ```typescript
 * // Get all products
 * const { products } = await fetchProducts();
 *
 * // Filter by category and sort by price
 * const { products } = await fetchProducts({
 *   categories: ['Recovery', 'Metabolic'],
 *   sort: 'price-asc',
 *   inStockOnly: true,
 * });
 * ```
 */
export async function fetchProducts(
  options: FetchProductsOptions = {},
): Promise<FetchProductsResult> {
  // Use mock data if configured
  if (USE_MOCKS) {
    return fetchProductsFromMocks(options);
  }

  const {
    categories,
    inStockOnly = false,
    sort = "recommended",
    limit,
    offset = 0,
    search,
  } = options;

  try {
    const client = getPeptideClient();
    const { data } = await client.query({
      query: GET_PEPTIDE_PRODUCTS,
      variables: {
        options: {
          take: 100, // Fetch all, filter client-side for now
          // TODO: Add server-side filtering when Vendure supports it
        },
      },
      fetchPolicy: "cache-first",
    });

    let products = (data?.products?.items || []).map(
      mapShopProductToPeptideProduct,
    );

    // Apply client-side filtering
    if (categories && categories.length > 0) {
      products = products.filter((p) => categories.includes(p.category));
    }

    if (inStockOnly) {
      products = products.filter((p) => p.variants.some((v) => v.inStock));
    }

    if (search && search.trim()) {
      const query = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.shortName?.toLowerCase().includes(query) ||
          p.slug.includes(query) ||
          p.casNumber.includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    switch (sort) {
      case "price-asc":
        products.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case "price-desc":
        products.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "recommended":
      default:
        products.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.popularity || 0) - (a.popularity || 0);
        });
        break;
    }

    const totalCount = products.length;

    // Apply pagination
    if (limit !== undefined) {
      products = products.slice(offset, offset + limit);
    } else if (offset > 0) {
      products = products.slice(offset);
    }

    const hasMore = offset + products.length < totalCount;

    return {
      products,
      totalCount,
      hasMore,
    };
  } catch (error) {
    console.error(
      "[fetchProducts] Vendure query failed, falling back to mocks:",
      error,
    );
    return fetchProductsFromMocks(options);
  }
}

/**
 * Fetch a single product by slug
 *
 * @example
 * ```typescript
 * const product = await fetchProductBySlug('bpc-157');
 * if (!product) {
 *   notFound();
 * }
 * ```
 */
export async function fetchProductBySlug(
  slug: string,
): Promise<PeptideProduct | null> {
  // Use mock data if configured
  if (USE_MOCKS) {
    return MOCK_PEPTIDES.find((p) => p.slug === slug) || null;
  }

  try {
    const client = getPeptideClient();
    const { data } = await client.query({
      query: GET_PEPTIDE_PRODUCT,
      variables: { slug },
      fetchPolicy: "cache-first",
    });

    if (!data?.product) {
      return null;
    }

    return mapShopProductToPeptideProduct(data.product);
  } catch (error) {
    console.error(
      "[fetchProductBySlug] Vendure query failed, falling back to mocks:",
      error,
    );
    return MOCK_PEPTIDES.find((p) => p.slug === slug) || null;
  }
}

/**
 * Get all product slugs for static generation
 *
 * @example
 * ```typescript
 * export async function generateStaticParams() {
 *   const slugs = await getAllProductSlugs();
 *   return slugs.map((slug) => ({ slug }));
 * }
 * ```
 */
export async function getAllProductSlugs(): Promise<string[]> {
  // Use mock data if configured
  if (USE_MOCKS) {
    return MOCK_PEPTIDES.map((p) => p.slug);
  }

  try {
    const client = getPeptideClient();
    const { data } = await client.query({
      query: GET_PEPTIDE_PRODUCT_SLUGS,
      variables: {
        options: { take: 100 },
      },
      fetchPolicy: "cache-first",
    });

    return (data?.products?.items || []).map((p: { slug: string }) => p.slug);
  } catch (error) {
    console.error(
      "[getAllProductSlugs] Vendure query failed, falling back to mocks:",
      error,
    );
    return MOCK_PEPTIDES.map((p) => p.slug);
  }
}

/**
 * Get featured products for homepage display
 */
export async function fetchFeaturedProducts(
  limit = 4,
): Promise<PeptideProduct[]> {
  const { products } = await fetchProducts({
    sort: "recommended",
    limit: limit * 2, // Fetch extra to ensure we have enough featured
  });

  return products.filter((p) => p.featured).slice(0, limit);
}

/**
 * Get related products (same category, excluding current)
 */
export async function fetchRelatedProducts(
  currentSlug: string,
  limit = 4,
): Promise<PeptideProduct[]> {
  const current = await fetchProductBySlug(currentSlug);
  if (!current) return [];

  const { products } = await fetchProducts({
    categories: [current.category],
    limit: limit + 1, // +1 to account for excluding current
  });

  return products.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export type {
  PeptideProduct,
  PeptideVariant,
  ResearchGoal,
} from "../mock-peptides";
export {
  getLowestPrice,
  getPriceRange,
  isInStock,
  getDefaultVariant,
  getAllCategories,
} from "../mock-peptides";
