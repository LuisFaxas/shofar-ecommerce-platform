/**
 * Debug Mock Utility
 * DEV ONLY - Simulates additional variants/accessories for UI testing
 *
 * Usage: Add ?debugMock=1 to URL to enable mock data
 * Example: http://localhost:3000?debugMock=1
 *
 * This allows verifying that UI components correctly render:
 * - Multiple variants with color swatches
 * - Accessories grid with add-to-cart
 *
 * WITHOUT modifying Vendure data.
 */

import type { ToolyPageData } from "./fetchers";

// Color configurations for mock variants
const MOCK_COLORS = [
  { code: "midnight", name: "Midnight", hex: "#1a1a2e" },
  { code: "arctic", name: "Arctic", hex: "#e2e8f0" },
  { code: "ember", name: "Ember", hex: "#ff6b35" },
];

// Mock accessory data
const MOCK_ACCESSORIES = [
  {
    id: "mock-acc-1",
    name: "Silicone Case",
    sku: "ACC-CASE-MOCK",
    price: 2999,
    priceWithTax: 2999,
    currencyCode: "USD",
    product: {
      id: "mock-prod-1",
      name: "Silicone Case",
      slug: "silicone-case",
      description: "Premium protective case",
    },
  },
  {
    id: "mock-acc-2",
    name: "Carry Chain - Gold",
    sku: "ACC-CHAIN-MOCK",
    price: 1999,
    priceWithTax: 1999,
    currencyCode: "USD",
    product: {
      id: "mock-prod-2",
      name: "Carry Chain - Gold",
      slug: "carry-chain-gold",
      description: "Elegant gold chain",
    },
  },
];

/**
 * Check if debug mock mode is enabled
 * Only works in development environment
 */
export function isDebugMockEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV === "production") return false;

  const params = new URLSearchParams(window.location.search);
  return params.get("debugMock") === "1";
}

/**
 * Augment page data with mock variants and accessories
 * Creates additional variants by cloning the existing one
 */
export function augmentWithMockData(
  pageData: ToolyPageData | null,
): ToolyPageData | null {
  if (!pageData?.product) return pageData;

  const existingVariant = pageData.product.variants[0];
  if (!existingVariant) return pageData;

  // Clone existing variant with different colors
  const mockVariants = MOCK_COLORS.map((color, index) => ({
    ...existingVariant,
    id: `mock-variant-${index}`,
    name: `TOOLY - ${color.name}`,
    sku: `TOOLY-MOCK-${color.code.toUpperCase()}`,
    facetValues: [
      {
        id: `mock-color-${index}`,
        code: color.code,
        name: color.name,
        facet: {
          id: "mock-color-facet",
          code: "color",
          name: "Color",
        },
      },
      {
        id: "mock-finish",
        code: "cerakote",
        name: "Cerakote",
        facet: {
          id: "mock-finish-facet",
          code: "finish",
          name: "Finish",
        },
      },
    ],
  }));

  // Build mock accessories collection
  const mockAccessoriesCollection = {
    id: "mock-accessories-collection",
    name: "Accessories",
    slug: "accessories",
    description: "Premium accessories (MOCK DATA)",
    productVariants: {
      items: MOCK_ACCESSORIES,
      totalItems: MOCK_ACCESSORIES.length,
    },
  };

  return {
    ...pageData,
    product: {
      ...pageData.product,
      variants: [...pageData.product.variants, ...mockVariants],
    },
    accessories: mockAccessoriesCollection as ToolyPageData["accessories"],
    heroImage: pageData.heroImage, // Preserve heroImage
  };
}

/**
 * Get debug mock banner component props
 */
export function getDebugBannerProps(): { show: boolean; message: string } {
  if (!isDebugMockEnabled()) {
    return { show: false, message: "" };
  }

  return {
    show: true,
    message:
      "🔧 DEV MOCK MODE - Additional variants & accessories are simulated",
  };
}
