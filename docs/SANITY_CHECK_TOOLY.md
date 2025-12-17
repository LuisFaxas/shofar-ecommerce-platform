# TOOLY Presale Launch - Sanity Check Report

**Date:** 2025-12-15
**Store:** shofar-store (BRAND_KEY=tooly)
**Verdict:** **NO-GO** - Critical blockers must be resolved first

---

## Executive Summary

1. **Vendure backend works** - Shop API responds, tooly channel exists with 7 products
2. **Build is BROKEN** - TypeScript errors prevent production build
3. **NO checkout flow** - No checkout page exists in the storefront
4. **NO payment/shipping/tax** - Vendure has zero configuration for commerce operations
5. **NO product images** - featuredAsset is null, stock is OUT_OF_STOCK on all variants

---

## Part A: Repo + Tooling Health

### Git Status

```
Branch: master (ahead by 13 commits)
Modified files: 17 files (uncommitted changes)
Untracked files: Multiple new files for pharma-store
```

### Recent Commits (last 10)

```
a34440c feat(pharma-store): Phase 1 - Design System & Foundation for PEPTIDES
d51ee52 feat(storefront): implement production asset pipeline & image wiring (WO 3.2)
10c193b fix(ui): ButtonPrimary glow fix and intensity adjustment
d18c4c0 feat(storefront): WO 3.1 - Page Shell & Cart Context for TOOLY
6b7b8e8 docs: Phase 0.1 completion - Update Master Plan and fix ESLint config
e30dbaf feat(vendure): Phase 0 - Vendure integration foundation
d6a2403 docs: Update DESIGN_SYSTEM_REPORT with rainbow button restoration
b920d46 CRITICAL FIX: Restore rainbow ButtonPrimary after accidental removal
3427fed feat(design-system): WO 2.5.2 - Final Polish & API Normalization
6dcd085 feat(ui): Add comprehensive e-commerce component library
```

### Tooling Versions

- **pnpm:** 10.19.0 ✅
- **node:** v22.13.0 ✅

### Lint: FAIL

```
ESLint couldn't find the config "@shofar/config/eslint/library.js"
- Missing: packages/config/eslint/library.js
- Affects: vendure, api-client, feature-flags, brand-config packages
```

**Fix:** Create `packages/config/eslint/library.js` extending base.js

### TypeCheck shofar-store: FAIL

```
Major errors:
1. src/app/design-system/page.tsx:30 - Button not exported from '@/brands/tooly/components/ui'
2. src/brands/tooly/components/ui/Dialog.tsx:100 - Expression of type 'void' tested for truthiness
3. src/brands/tooly/components/ui/Input.tsx:133 - Comma operator unused
4. src/brands/tooly/components/ui/Popover.tsx:182 - No overload matches call
5. packages/api-client/src/index.ts - Duplicate exports between shop-types and admin-types
6. packages/api-client/src/index.ts - Cannot find 'getShopClient', 'getAdminClient'
```

### TypeCheck vendure: FAIL

```
Major errors:
1. src/initial-data/data-population.ts - Multiple unused variables
2. src/initial-data/data-population.ts:33 - Missing 'apiType' in RequestContext
3. src/initial-data/data-population.ts:49 - Type '"USD"' not assignable to CurrencyCode
4. src/initial-data/initial-data.ts - Missing 'collections' property
5. src/populate-db.ts:18 - Type mismatch
```

### Build shofar-store: FAIL

```
Error: Module '@/brands/tooly/components/ui' has no exported member 'Button'
Location: src/app/design-system/page.tsx:30
```

---

## Part B: Runtime Sanity

### Ports & Processes

| Service      | Port       | Status                       |
| ------------ | ---------- | ---------------------------- |
| Vendure      | 3001       | ✅ Running                   |
| Admin UI     | 3001/admin | ✅ Available                 |
| shofar-store | 3000       | ❌ Not started (build fails) |

### Vendure Shop API Health

```json
{ "data": { "__typename": "Query" } }
```

**Status:** ✅ PASS

### TOOLY Products Query

```
Total Products: 7
- TOOLY (6 variants): DLC-GM, CK-MID, CK-ARC, CK-EMB, CK-COB, CK-TIT
- Silicone Case + Glass Vial (1 variant)
- Carry Chain Gold (1 variant)
- Carry Chain Silver (1 variant)
- Cleaning Kit (1 variant)
- TOOLY-2 (0 variants - duplicate?)
- Silicone Case for TOOLY (1 variant)
```

**Status:** ⚠️ WARN - Products exist but duplicate detected

### TOOLY Product Details

```json
{
  "id": "1",
  "name": "TOOLY",
  "slug": "tooly",
  "variants": 6,
  "featuredAsset": null // ⚠️ NO IMAGE
}
```

**Status:** ⚠️ WARN - No featured asset attached

### Stock Levels

**ALL variants show:** `"stockLevel": "OUT_OF_STOCK"`
**Status:** ❌ FAIL - No sellable inventory

### Accessories Collection

```json
{
  "name": "Accessories",
  "productVariants": {
    "totalItems": 0,
    "items": []
  }
}
```

**Status:** ❌ FAIL - Collection exists but has 0 products linked

### Shop Proxy Route

- **Location:** `apps/shofar-store/src/app/api/shop/route.ts`
- **Channel injection:** ✅ `vendure-token: tooly` header added
- **Cookie forwarding:** ✅ Set-Cookie headers forwarded
- **Status:** ✅ PASS (code review only, not runtime tested due to build failure)

---

## Part C: Assets & Images

### Vendure Asset Configuration

- **Local storage:** `apps/vendure/static/assets/` (default)
- **S3/R2/MinIO:** Fully implemented in `apps/vendure/src/config/s3-asset-storage.ts`
- **Asset URL prefix:** `http://localhost:3001/assets/`

### Required Environment Variables for Production

```bash
ASSET_STORAGE=s3
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=xxx
S3_SECRET_ACCESS_KEY=xxx
S3_ENDPOINT=https://xxx.r2.cloudflarestorage.com  # for R2
ASSET_URL_PREFIX=https://assets.yoursite.com
```

### Next.js Remote Patterns

```typescript
remotePatterns: [
  {
    protocol: "http",
    hostname: "localhost",
    port: "3001",
    pathname: "/assets/**",
  },
  {
    protocol: "https",
    hostname: "*.r2.cloudflarestorage.com",
    pathname: "/**",
  },
  { protocol: "https", hostname: "*.s3.*.amazonaws.com", pathname: "/**" },
];
```

**Status:** ✅ PASS - Configuration ready

### Bulk Asset Importer

- **Location:** `apps/vendure/src/cli/bulk-attach-assets.ts`
- **Command:** `pnpm --filter @shofar/vendure run bulk:assets`
- **Requirements:** Create `assets-import/map.json` with SKU → file path mappings
- **Status:** ✅ EXISTS but no assets have been imported

---

## Part D: Presale Readiness Checklist

| Check                    | Status  | Details                                              |
| ------------------------ | ------- | ---------------------------------------------------- |
| Browse products/variants | ⚠️ WARN | Data exists but build fails, no images               |
| Add to cart              | ⚠️ WARN | CartContext exists, not runtime tested               |
| Cart persistence         | ⚠️ WARN | Proxy forwards cookies, not tested                   |
| Checkout page            | ❌ FAIL | No checkout route exists                             |
| Payment methods          | ❌ FAIL | 0 payment methods in Vendure                         |
| Shipping methods         | ❌ FAIL | 0 shipping methods configured                        |
| Tax rates                | ❌ FAIL | 0 tax rates configured                               |
| Order emails             | ⚠️ WARN | EmailPlugin in devMode (saves to disk, doesn't send) |
| Stock levels             | ❌ FAIL | All variants OUT_OF_STOCK                            |
| Product images           | ❌ FAIL | featuredAsset: null on all products                  |

---

## Presale Blockers (Ranked by Priority)

### P0 - Critical (Must fix before any testing)

1. **Build is broken** - TypeScript errors prevent compilation
   - Cause: `Button` import missing from ui/index.ts, api-client duplicate exports
   - Fix: Export `Button` or fix import, resolve api-client exports
   - Verify: `pnpm --filter @shofar/shofar-store build` succeeds

2. **No checkout page exists** - Cannot complete purchase flow
   - Cause: Checkout route never created
   - Fix: Create `/checkout` route with address → payment → confirmation flow
   - Verify: Navigate to `/checkout` shows checkout UI

3. **No payment methods** - Cannot accept payments
   - Cause: Only `dummyPaymentHandler` in config, no methods in DB
   - Fix: Configure real payment method (Authorize.Net Accept Hosted per MASTER_PLAN)
   - Verify: `paymentMethods { items { code } }` returns enabled method

### P1 - High (Required for presale)

4. **No shipping methods** - Cannot calculate shipping
   - Cause: No shipping methods configured in Vendure
   - Fix: Create at least one shipping method in Admin UI or via seed script
   - Verify: `shippingMethods { items { code } }` returns methods

5. **All stock is OUT_OF_STOCK** - Cannot sell anything
   - Cause: Stock levels not set or set to 0
   - Fix: Update stock levels via Admin UI or seed script
   - Verify: `product(slug:"tooly") { variants { stockLevel } }` shows IN_STOCK

6. **No product images** - Poor customer experience
   - Cause: featuredAsset not attached to variants/products
   - Fix: Upload images via Admin UI or run `pnpm --filter @shofar/vendure run bulk:assets`
   - Verify: `product(slug:"tooly") { featuredAsset { preview } }` returns URL

### P2 - Medium (Should fix)

7. **No tax rates** - Incorrect totals
   - Cause: Tax not configured
   - Fix: Create tax category and rates in Admin UI
   - Verify: `taxRates { items { name } }` returns rates

8. **Email in devMode** - Won't send real emails
   - Cause: `EmailPlugin.init({ devMode: true })`
   - Fix: Configure SMTP or Resend in production
   - Verify: Check email arrives in inbox after test order

9. **Accessories collection empty** - Missing upsells
   - Cause: Products not linked to collection
   - Fix: Link accessory products to "Accessories" collection
   - Verify: `collection(slug:"accessories") { productVariants { totalItems } }` > 0

---

## Minimal Plan to Get Presale Live (Max 10 Steps)

1. **Fix TypeScript build errors**
   - Export missing `Button` from ui/index.ts (or remove import from design-system page)
   - Fix api-client duplicate exports in index.ts

2. **Set stock levels to IN_STOCK**
   - Via Admin UI: Products → TOOLY → Variants → Set stock > 0
   - Or update seed script

3. **Upload product images**
   - Create `apps/vendure/assets-import/map.json` with SKU → image paths
   - Place images in `assets-import/` folder
   - Run `pnpm --filter @shofar/vendure run bulk:assets`

4. **Create shipping method**
   - Admin UI: Settings → Shipping Methods → Create
   - At minimum: Flat rate "Standard Shipping" $9.99

5. **Create payment method (stub)**
   - For testing: Enable `standard-payment` or `dummy` method
   - For production: Implement Authorize.Net Accept Hosted (WO 3.1 from MASTER_PLAN)

6. **Create checkout page**
   - Implement `/checkout` route with:
     - Address form
     - Shipping method selection
     - Payment (iframe for Accept Hosted)
     - Confirmation

7. **Configure tax (optional for MVP)**
   - Create "Standard Tax" rate if required by jurisdiction
   - Or handle taxes via TaxJar integration later

8. **Test complete flow**
   - Browse → Add to Cart → Checkout → Pay → Confirmation
   - Verify order appears in Vendure Admin

9. **Link accessories to collection**
   - Assign accessory products to "Accessories" collection

10. **Deploy to staging**
    - Build succeeds
    - Configure production env vars
    - Test on real domain

---

## Verification Commands

```bash
# Fix build and verify
pnpm --filter @shofar/shofar-store build

# Check stock levels
curl -s http://localhost:3001/shop-api \
  -H "Content-Type: application/json" \
  -H "vendure-token: tooly" \
  -d '{"query":"{ product(slug:\"tooly\"){ variants{ sku stockLevel } } }"}'

# Check payment methods (after login)
curl -s http://localhost:3001/admin-api \
  -c cookies.txt -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"query":"{ paymentMethods { items { code enabled } } }"}'

# Check shipping methods
curl -s http://localhost:3001/admin-api \
  -c cookies.txt -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"query":"{ shippingMethods { items { code name } } }"}'

# Test end-to-end cart flow
# (after storefront is running)
curl -s http://localhost:3000/api/shop \
  -c cart.txt -b cart.txt \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { addItemToOrder(productVariantId:\"1\", quantity:1) { ... on Order { id code totalWithTax } } }"}'
```

---

## GO / NO-GO Verdict

### **NO-GO** - Not ready for presale implementation

**Primary Blockers:**

1. Build is broken (TypeScript errors)
2. No checkout page exists
3. No payment/shipping configured
4. No stock/images on products

**Estimated time to minimum viable presale:** 2-3 focused work sessions

**Recommended next session:** Fix the P0 blockers (build + checkout + payment stub) to enable testing.

---

_Report generated: 2025-12-15_
