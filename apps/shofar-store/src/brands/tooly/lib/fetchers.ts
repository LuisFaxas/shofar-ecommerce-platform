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

// ============================================================================
// TYPES
// ============================================================================

export type ToolyProductData = NonNullable<GetToolyProductQuery["product"]>;
export type GalleryData = NonNullable<GetProductGalleryQuery["product"]>;
export type AccessoriesData = NonNullable<
  GetAccessoriesCollectionQuery["collection"]
>;

export interface ToolyPageData {
  product: ToolyProductData | null;
  gallery: GalleryData | null;
  accessories: AccessoriesData | null;
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

/**
 * Fetch main TOOLY product data
 * Used by: HeroSection, ProductSection
 */
export async function fetchToolyProduct(): Promise<ToolyProductData | null> {
  try {
    const { data, error } = await toolyShopClient.query({
      query: GetToolyProductDocument,
      variables: { slug: TOOLY_PRODUCT_SLUG },
      fetchPolicy: "network-only",
    });

    if (error) {
      console.error("[TOOLY] Failed to fetch product:", error.message);
      return null;
    }

    return data?.product ?? null;
  } catch (err) {
    console.error("[TOOLY] Product fetch error:", err);
    return null;
  }
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
  const [product, gallery, accessories] = await Promise.all([
    fetchToolyProduct(),
    fetchProductGallery(),
    fetchAccessoriesCollection(),
  ]);

  return {
    product,
    gallery,
    accessories,
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
