/**
 * TOOLY Data Fetchers
 * Server-side data fetching for TOOLY sections
 *
 * Uses @shofar/api-client to fetch product data from Vendure.
 * Provides graceful fallback when data is unavailable.
 */

import {
  toolyShopClient,
  GetToolyProductDocument,
  GetProductGalleryDocument,
  GetAccessoriesCollectionDocument,
  type GetToolyProductQuery,
  type GetProductGalleryQuery,
  type GetAccessoriesCollectionQuery,
} from "@shofar/api-client";
import {
  buildStorefrontContent,
  type StorefrontContent,
  type ChannelStorefrontFields,
} from "./storefront-content";

// ============================================================================
// TYPES
// ============================================================================

export type ToolyProductData = NonNullable<GetToolyProductQuery["product"]>;
export type GalleryData = NonNullable<GetProductGalleryQuery["product"]>;
export type AccessoriesData = NonNullable<
  GetAccessoriesCollectionQuery["collection"]
>;

export interface HeroImageData {
  id: string;
  preview: string;
  source: string;
}

export interface HomeGalleryAsset {
  id: string;
  preview: string;
  source: string;
  name: string;
}

export interface ToolyPageData {
  product: ToolyProductData | null;
  gallery: GalleryData | null;
  accessories: AccessoriesData | null;
  /** Hero background image from Channel customFields */
  heroImage: string | null;
  /** Marketing gallery images from Channel customFields */
  homeGalleryAssets: HomeGalleryAsset[] | null;
  /** Storefront content from Channel customFields (text, labels, toggles) */
  storefrontContent: StorefrontContent;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const TOOLY_PRODUCT_SLUG = "tooly";
const ACCESSORIES_COLLECTION_SLUG = "accessories";

// Asset host for image URLs
const ASSET_HOST = process.env.NEXT_PUBLIC_ASSET_HOST || "localhost:3001";
const ASSET_PROTOCOL = process.env.NODE_ENV === "production" ? "https" : "http";

/**
 * Build full asset URL from Vendure preview path
 */
export function buildAssetUrl(
  previewPath: string | undefined | null,
): string | null {
  if (!previewPath) return null;

  // If already a full URL, return as-is
  if (previewPath.startsWith("http://") || previewPath.startsWith("https://")) {
    return previewPath;
  }

  // Build full URL from relative path
  return `${ASSET_PROTOCOL}://${ASSET_HOST}${previewPath}`;
}

// ============================================================================
// FETCHERS
// ============================================================================

interface ProductAndChannelData {
  product: ToolyProductData | null;
  heroImage: string | null;
  homeGalleryAssets: HomeGalleryAsset[] | null;
  storefrontContent: StorefrontContent;
}

/**
 * Fetch main TOOLY product data and channel configuration
 * Used by: HeroSection, ProductSection
 *
 * Error handling:
 * - GraphQL errors = FAIL LOUD (log warning, return null - don't hide the problem)
 * - Parsing errors = FALLBACK (use defaults for storefront content only)
 * - Product data is sacred - if we got data.product, return it
 */
export async function fetchToolyProductAndChannel(): Promise<ProductAndChannelData> {
  try {
    const { data, error } = await toolyShopClient.query({
      query: GetToolyProductDocument,
      variables: { slug: TOOLY_PRODUCT_SLUG },
      fetchPolicy: "network-only",
    });

    // GraphQL errors = FAIL LOUD - don't silently return stale/partial results
    if (error) {
      console.error(
        "[TOOLY] Shop API mismatch - GraphQL error:",
        error.message,
      );
      return {
        product: null,
        heroImage: null,
        homeGalleryAssets: null,
        storefrontContent: buildStorefrontContent(null),
      };
    }

    // Product data is sacred - extract first
    const product = data?.product ?? null;

    // Channel customFields parsing - wrap in try-catch for resilience
    let heroImage: string | null = null;
    let homeGalleryAssets: HomeGalleryAsset[] | null = null;
    let storefrontContent: StorefrontContent;

    try {
      // Extract customFields from activeChannel
      const customFields = data?.activeChannel?.customFields as
        | (ChannelStorefrontFields & {
            heroImage?: { preview?: string };
            homeGalleryAssets?: HomeGalleryAsset[];
          })
        | null;

      // Extract heroImage from activeChannel customFields
      const heroImagePreview = customFields?.heroImage?.preview ?? null;
      heroImage = buildAssetUrl(heroImagePreview);

      // Extract homeGalleryAssets from activeChannel customFields
      homeGalleryAssets = customFields?.homeGalleryAssets ?? null;

      // Build storefront content with fallbacks
      storefrontContent = buildStorefrontContent(customFields);
    } catch (parseError) {
      // Parsing errors = FALLBACK - use defaults for storefront content
      console.warn(
        "[TOOLY] customFields parse error, using defaults:",
        parseError,
      );
      storefrontContent = buildStorefrontContent(null);
    }

    return {
      product,
      heroImage,
      homeGalleryAssets,
      storefrontContent,
    };
  } catch (err) {
    // Network/unexpected errors = FAIL LOUD
    console.error("[TOOLY] Shop API mismatch - fetch error:", err);
    return {
      product: null,
      heroImage: null,
      homeGalleryAssets: null,
      storefrontContent: buildStorefrontContent(null),
    };
  }
}

/**
 * Fetch main TOOLY product data (legacy - use fetchToolyProductAndChannel for hero)
 * Used by: ProductSection
 */
export async function fetchToolyProduct(): Promise<ToolyProductData | null> {
  const { product } = await fetchToolyProductAndChannel();
  return product;
}

/**
 * Fetch product gallery images
 * Used by: GallerySection
 */
export async function fetchProductGallery(): Promise<GalleryData | null> {
  try {
    const { data, error } = await toolyShopClient.query({
      query: GetProductGalleryDocument,
      variables: { slug: TOOLY_PRODUCT_SLUG },
      fetchPolicy: "network-only",
    });

    if (error) {
      console.error("[TOOLY] Failed to fetch gallery:", error.message);
      return null;
    }

    return data?.product ?? null;
  } catch (err) {
    console.error("[TOOLY] Gallery fetch error:", err);
    return null;
  }
}

/**
 * Fetch accessories collection
 * Used by: AccessoriesSection
 */
export async function fetchAccessoriesCollection(): Promise<AccessoriesData | null> {
  try {
    const { data, error } = await toolyShopClient.query({
      query: GetAccessoriesCollectionDocument,
      variables: { slug: ACCESSORIES_COLLECTION_SLUG },
      fetchPolicy: "network-only",
    });

    if (error) {
      console.error("[TOOLY] Failed to fetch accessories:", error.message);
      return null;
    }

    return data?.collection ?? null;
  } catch (err) {
    console.error("[TOOLY] Accessories fetch error:", err);
    return null;
  }
}

/**
 * Fetch all TOOLY page data in parallel
 * Main entry point for page-level data fetching
 */
export async function fetchToolyPageData(): Promise<ToolyPageData> {
  const [productAndChannel, gallery, accessories] = await Promise.all([
    fetchToolyProductAndChannel(),
    fetchProductGallery(),
    fetchAccessoriesCollection(),
  ]);

  return {
    product: productAndChannel.product,
    gallery,
    accessories,
    heroImage: productAndChannel.heroImage,
    homeGalleryAssets: productAndChannel.homeGalleryAssets,
    storefrontContent: productAndChannel.storefrontContent,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format price with currency
 */
export function formatPrice(
  priceInCents: number,
  currencyCode: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(priceInCents / 100);
}

/**
 * Get variant color from facet values
 */
export function getVariantColor(
  facetValues: Array<{ code: string; name: string; facet: { code: string } }>,
): { name: string; code: string } | null {
  const colorFacet = facetValues.find((fv) => fv.facet.code === "color");
  if (colorFacet) {
    return { name: colorFacet.name, code: colorFacet.code };
  }
  return null;
}

/**
 * Get variant finish from facet values
 */
export function getVariantFinish(
  facetValues: Array<{ code: string; name: string; facet: { code: string } }>,
): { name: string; code: string } | null {
  const finishFacet = facetValues.find((fv) => fv.facet.code === "finish");
  if (finishFacet) {
    return { name: finishFacet.name, code: finishFacet.code };
  }
  return null;
}

/**
 * Map color code to CSS color value
 */
export function getColorHex(colorCode: string): string {
  const colorMap: Record<string, string> = {
    gunmetal: "#4a5568",
    midnight: "#1a1a2e",
    arctic: "#e2e8f0",
    ember: "#ff6b35",
    cobalt: "#3b82f6",
    titanium: "#94a3b8",
  };
  return colorMap[colorCode.toLowerCase()] || "#6b7280";
}
