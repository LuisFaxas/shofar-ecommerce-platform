# Vendure Integration for PEPTIDES (pharma-store)

This document describes how pharma-store integrates with Vendure as its data source.

## Overview

Pharma-store uses the **peptide** Vendure channel for all product data. The data layer (`lib/queries/products.ts`) fetches from Vendure with automatic fallback to mock data.

## Custom Fields

### Product Custom Fields

| Field              | Type     | Description                                          |
| ------------------ | -------- | ---------------------------------------------------- |
| `casNumber`        | string   | Chemical Abstracts Service registry number           |
| `sequence`         | text     | Amino acid sequence                                  |
| `family`           | string   | Peptide family classification                        |
| `researchGoals`    | string[] | Research goal categories (Recovery, Metabolic, etc.) |
| `molecularWeight`  | string   | e.g., "1419.53 g/mol"                                |
| `molecularFormula` | string   | e.g., "C62H98N16O22"                                 |
| `sdsUrl`           | string   | URL to Safety Data Sheet PDF                         |
| `coaUrl`           | string   | URL to Certificate of Analysis PDF                   |
| `featured`         | boolean  | Show on homepage featured section                    |
| `popularity`       | int      | Used for default sorting (higher = more popular)     |

### ProductVariant Custom Fields

| Field                 | Type   | Description                          |
| --------------------- | ------ | ------------------------------------ |
| `purityPercent`       | string | e.g., "≥99%"                         |
| `sizeMg`              | string | e.g., "5mg"                          |
| `storage`             | string | Storage instructions                 |
| `administrationRoute` | string | e.g., "Subcutaneous injection"       |
| `form`                | string | e.g., "Lyophilized powder" (default) |

## Setup Commands

### Initial Setup

```bash
# 1. Start Vendure (auto-applies schema changes in dev mode)
pnpm --filter @shofar/vendure dev

# 2. Wait for Vendure to start (~30 seconds), then set up channels and RBAC
# This happens automatically via init-vendure.ts, or run:
# pnpm --filter @shofar/vendure run setup

# 3. Seed peptide products into the peptide channel
pnpm --filter @shofar/vendure seed:peptides

# 4. Start pharma-store
pnpm --filter @shofar/pharma-store dev
```

### Regenerate GraphQL Types (After Schema Changes)

```bash
# Ensure Vendure is running, then:
pnpm --filter @shofar/api-client codegen:shop
```

## Channel Configuration

The `peptide` channel:

- **Token**: `peptide` (sent as `vendure-token` header)
- **Currency**: USD
- **Prices**: Exclude tax (pricesIncludeTax: false)

### RBAC Roles

| Role                    | Description                                                     |
| ----------------------- | --------------------------------------------------------------- |
| `peptide-store-manager` | Full permissions on peptide channel                             |
| `peptide-fulfillment`   | Order fulfillment (read/update orders, read customers/products) |
| `peptide-support`       | Read-only access to orders, customers, products                 |

### Test Credentials

- **Admin**: `manager@peptides.com` / `manager123`

## Data Layer Architecture

### Fetch Priority

1. **Vendure** (default) - Real product data from peptide channel
2. **Mock fallback** - When `NEXT_PUBLIC_PEPTIDES_USE_MOCKS=true` or Vendure unavailable

### Environment Variables

```bash
# .env.local (pharma-store)
NEXT_PUBLIC_VENDURE_SHOP_API_URL=http://localhost:3001/shop-api

# Optional: Force mock data (bypasses Vendure)
NEXT_PUBLIC_PEPTIDES_USE_MOCKS=true
```

### API Client Usage

```typescript
import { getPeptideClient } from "@/lib/api-client";

// All requests automatically include vendure-token: peptide
const client = getPeptideClient();
const { data } = await client.query({ query: GET_PEPTIDE_PRODUCTS });
```

### Product Query Functions

```typescript
import {
  fetchProducts,
  fetchProductBySlug,
  getAllProductSlugs,
  fetchFeaturedProducts,
  fetchRelatedProducts,
} from "@/lib/queries/products";

// Fetch with filtering
const { products, totalCount } = await fetchProducts({
  categories: ["Recovery", "Metabolic"],
  sort: "price-asc",
  inStockOnly: true,
});

// Fetch single product
const product = await fetchProductBySlug("bpc-157");

// Get slugs for static generation
const slugs = await getAllProductSlugs();
```

## Seeding Products

The seed script (`apps/vendure/src/initial-data/seed-peptides.ts`) is idempotent:

- Safe to run multiple times
- Uses slug/SKU to find existing items before creating
- Creates Research Goal facet with values: Recovery, Metabolic, Longevity, Cognitive, Cosmetic, Research

### Seed Data Source

The seed script includes 12 peptide products matching the mock data:

- BPC-157, TB-500, DSIP (Recovery)
- CJC-1295, Ipamorelin, AOD-9604 (Metabolic)
- Epithalon, Thymosin Alpha-1 (Longevity/Research)
- Selank, Semax (Cognitive)
- GHK-Cu (Cosmetic)
- PT-141 (Research)

## Troubleshooting

### "Vendure query failed, falling back to mocks"

1. Ensure Vendure is running: `pnpm --filter @shofar/vendure dev`
2. Check the peptide channel exists (Admin UI → Channels)
3. Verify `NEXT_PUBLIC_VENDURE_SHOP_API_URL` is correct

### Custom Fields Not Appearing

1. Restart Vendure to apply schema changes
2. Delete `vendure-db.sqlite` to reset (dev only)
3. Re-run setup: `pnpm --filter @shofar/vendure run setup`

### GraphQL Types Out of Sync

```bash
# Regenerate after Vendure schema changes
pnpm --filter @shofar/api-client codegen:shop
```

## Migration Notes

### From Mock Data to Vendure

The `PeptideProduct` and `PeptideVariant` types in `mock-peptides.ts` mirror the Vendure custom fields schema. The mapper functions in `products.ts` handle the transformation:

```
Vendure Product → mapShopProductToPeptideProduct() → PeptideProduct
Vendure Variant → mapVariant() → PeptideVariant
```

### Adding New Fields

1. Add to `vendure-config.ts` customFields
2. Add to `peptide-products.graphql` fragment
3. Update mapper in `products.ts`
4. Update `PeptideProduct` type if needed
5. Run codegen: `pnpm --filter @shofar/api-client codegen:shop`
