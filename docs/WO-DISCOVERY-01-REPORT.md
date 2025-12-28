# WO-DISCOVERY-01-REPORT: TOOLY Storefront Deep Discovery Audit

**Date**: 2025-12-27
**Auditor**: Claude Code (Opus 4.5)
**Scope**: TOOLY storefront (`apps/shofar-store`) + supporting infrastructure
**Mode**: Read-only investigation (no code changes)

---

## 5.1 Executive Summary

### What Is Definitely True (Verified)

1. **Architecture**: Isolated store architecture is correctly implemented. TOOLY runs on `shofar-store` with complete UI separation from other stores.
2. **Channel Isolation**: `vendure-token: tooly` header is enforced in the shop proxy route.
3. **WO Implementations**: All CHECKPOINT-listed WO features exist in code and are wired correctly:
   - WO-HERO-VIEWPORT-01: `100svh`, `heroImageMobile`, `object-cover object-bottom`
   - WO 2.1.1: TechnologySection mobile pager (3 cards/page + dots)
   - WO 2.1.2: ReviewsSection 3-row marquee
   - WO 2.0.6b/c: ProductCarousel thumbs + navStyle toggle
4. **debugMock Safety**: Production-gated (`NODE_ENV === "production"` returns false)
5. **Stripe Integration**: Properly configured with Payment Element and fallback TestPaymentForm

### What Is Likely True But Unverified

1. **Railway Deployment**: Cannot verify production Vendure config without deployment access
2. **R2 Asset Storage**: Code exists but cannot verify production bucket configuration
3. **Webhook Events**: Stripe webhook handler exists but actual event handling untested

### What Is False/Contradictory vs CHECKPOINT

| Claim                                             | Reality                                                       | Impact                                             |
| ------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| "Next.js 16.0.1"                                  | Actual version is **16.0.10**                                 | Low - documentation discrepancy                    |
| WO 2.0.6c "carousel nav style toggle via Vendure" | **BUG**: `storefrontCarouselNavStyle` is NOT in GraphQL query | **P1** - Feature broken, always defaults to "dots" |
| "synchronize is safe"                             | `synchronize: true` for postgres in production                | **P0** - Data loss risk                            |

### Top 5 Risks

1. **P0 - DB Schema Sync**: `synchronize: true` in postgres config can cause data loss
2. **P1 - Missing GraphQL Field**: `storefrontCarouselNavStyle` not queried, WO 2.0.6c broken
3. **P1 - Lint Errors**: 3 ESLint errors will fail CI (react-hooks violations)
4. **P1 - Localhost Fallback**: Proxy falls back to `localhost:3001` if `VENDURE_INTERNAL_URL` not set
5. **P2 - Hardcoded Credentials**: Default passwords in vendure-config.ts (OK for dev, risk if copied to prod)

---

## 5.2 Checkpoint Claims vs Code Reality Table

| Claim                              | Source               | Verified?   | Evidence                                                      | Notes                                                 |
| ---------------------------------- | -------------------- | ----------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| Next.js 16.0.1                     | CHECKPOINT header    | **NO**      | `apps/shofar-store/package.json:15` shows `"next": "16.0.10"` | Update docs                                           |
| Vendure 3.1.1                      | CHECKPOINT header    | **YES**     | `apps/vendure/package.json`                                   | Confirmed                                             |
| Mode A (BRAND_KEY) for production  | Architecture section | **YES**     | No cookie-based switching code found                          | Correct                                               |
| vendure-token: tooly enforced      | Proxy section        | **YES**     | `apps/shofar-store/src/app/api/shop/route.ts:32`              | Hardcoded header                                      |
| heroImageMobile implemented        | WO-HERO-VIEWPORT-01  | **YES**     | `HeroSection.tsx:18`, `fetchers.ts:54`                        | Desktop/mobile responsive                             |
| 100svh viewport fix                | WO-HERO-VIEWPORT-01  | **YES**     | `HeroSection.tsx:98` `min-h-[100svh]`                         | With fallback                                         |
| TechnologySection 3-card pager     | WO 2.1.1             | **YES**     | `TechnologySection.tsx:108-142`                               | Mobile only                                           |
| ReviewsSection 3-row marquee       | WO 2.1.2             | **YES**     | `ReviewsSection.tsx:110-114`, uses `ReviewsMarqueeMultiRow`   | Alternating directions                                |
| ProductCarousel navStyle toggle    | WO 2.0.6c            | **PARTIAL** | `ProductCarousel.tsx:36` accepts prop                         | **BUT** data never flows - field not in GraphQL query |
| variant.assets in query            | GraphQL section      | **YES**     | `tooly-product.graphql:24-31`                                 | Confirmed                                             |
| storefrontCarouselNavStyle queried | Implied by WO 2.0.6c | **NO**      | Not in `tooly-product.graphql`                                | **BUG** - missing from query                          |
| debugMock disabled in prod         | Dev utilities        | **YES**     | `debug-mock.ts:63`                                            | `process.env.NODE_ENV === "production"` guard         |
| S3/R2 asset storage                | Asset pipeline       | **YES**     | `apps/vendure/src/config/s3-asset-storage.ts`                 | Conditional on env vars                               |
| Stripe Payment Element             | Checkout flow        | **YES**     | `StripePaymentForm.tsx:125`                                   | With dark theme styling                               |
| Cookie isolation shop/admin        | Vendure config       | **YES**     | `vendure-config.ts:85` `cookieOptions.name`                   | `vendure-shop-session`                                |

---

## 5.3 Deep Dives

### Build & Tooling

**Node/pnpm Versions**:

- Warning: Engine mismatch - wants Node >=20.0.0, running 18.20.5
- pnpm: 8.15.9

**Typecheck**: PASSES (no errors)

```bash
pnpm --filter @shofar/shofar-store typecheck
# Exit code 0
```

**Lint**: FAILS with 3 errors

```
apps/shofar-store/src/brands/tooly/components/ui/Popover.tsx:218
  - react-hooks/refs: Cannot access refs during render

apps/shofar-store/src/brands/tooly/sections/TechnologySection.tsx:185,196
  - react-hooks/preserve-manual-memoization: Compiler skipped optimization
```

**Build**: Expected to FAIL due to lint errors (CI lint check)

---

### Frontend Architecture

**Brand Resolution**:

- Mode A confirmed (BRAND_KEY env var)
- No cookie-based brand switching in code
- SSG/ISR compatible

**Store Isolation**:

- `apps/shofar-store/src/brands/tooly/` contains all TOOLY-specific UI
- No cross-store imports detected
- Isolated from pharma-store and faxas-store

---

### Vendure Backend Configuration

**Database**:

```typescript
// apps/vendure/src/vendure-config.ts:40-52
dbConnectionOptions: {
  type: DB_TYPE,
  synchronize: DB_TYPE === "postgres" ? true : IS_DEV,  // P0 RISK
  ...
}
```

**CRITICAL**: `synchronize: true` for postgres in ANY environment. Should be `IS_DEV` only.

**Channels**:

- `tooly` channel configured with custom fields
- Custom fields include: heroImage, heroImageMobile, homeGalleryAssets, storefront\* text fields

**Cookie Configuration**:

```typescript
// vendure-config.ts:85
authOptions: {
  cookieOptions: {
    name: 'vendure-shop-session',
    // ...
  }
}
```

Shop and Admin sessions are properly isolated via different cookie names.

---

### Shop Proxy + Channel Token Flow

**File**: `apps/shofar-store/src/app/api/shop/route.ts`

**Environment Variables Read**:

- `VENDURE_INTERNAL_URL` - Primary target URL
- Falls back to `NEXT_PUBLIC_VENDURE_SHOP_API_URL`
- Final fallback: `http://localhost:3001/shop-api` (DANGER on Vercel)

**Token Enforcement**:

```typescript
// route.ts:32
headers.set("vendure-token", "tooly");
```

Always enforced, regardless of request origin.

**Localhost Fallback Risk**:
If neither `VENDURE_INTERNAL_URL` nor `NEXT_PUBLIC_VENDURE_SHOP_API_URL` is set, requests go to localhost which will fail on Vercel.

---

### GraphQL Queries + Types + Codegen Sync

**File**: `packages/api-client/src/shop/tooly-product.graphql`

**Fields Queried in activeChannel.customFields**:

- heroImage { id, preview, source }
- heroImageMobile { id, preview, source }
- homeGalleryAssets { id, preview, source, name }
- All storefront\* text fields EXCEPT `storefrontCarouselNavStyle`

**MISSING FIELD - BUG**:

```graphql
# Should include but doesn't:
storefrontCarouselNavStyle
```

This causes WO 2.0.6c (carousel nav style toggle) to always use default "dots" value.

**Variant Assets**:

```graphql
variants {
  assets {
    id
    preview
    source
  }
  featuredAsset { id, preview, source }
}
```

Confirmed present - variant-specific media works.

---

### UI Components

#### HeroSection

- **File**: `apps/shofar-store/src/brands/tooly/sections/HeroSection.tsx`
- **100svh**: Line 98 - `min-h-[100svh] md:min-h-[90svh]`
- **heroImageMobile**: Props interface line 18, conditional rendering lines 110-130
- **object-cover object-bottom**: Line 119 desktop, line 128 mobile

#### ProductCarousel

- **File**: `apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx`
- **navStyle prop**: Line 36 - accepts `"dots" | "thumbs"`
- **Mobile dots**: Lines 231-254
- **Mobile thumbs**: Lines 257-282
- **Desktop always dots**: Lines 285-308
- **Lightbox integration**: Line 409-414

#### TechnologySection

- **File**: `apps/shofar-store/src/brands/tooly/sections/TechnologySection.tsx`
- **3 cards per page**: Line 135 `CARDS_PER_PAGE = 3`
- **Mobile pager dots**: Lines 227-246
- **Scroll snap**: Line 186 `.snap-x .snap-mandatory`
- **Lint errors**: Lines 185, 196 - react-hooks issues

#### ReviewsSection

- **File**: `apps/shofar-store/src/brands/tooly/sections/ReviewsSection.tsx`
- **3 rows**: Lines 110-114 splits 9 reviews into 3 rows
- **ReviewsMarqueeMultiRow**: Line 141
- **Alternating directions**: Implicit in component design (left, right, left)

#### Lightbox

- **File**: `apps/shofar-store/src/brands/tooly/components/ui/Lightbox.tsx`
- **Index sync**: Line 50-54 resets to initialIndex on open
- **Keyboard nav**: Lines 77-101
- **Touch swipe**: Lines 103-127
- **Portal to body**: Line 311

---

### Checkout + Stripe

**Checkout Flow**:

1. Address step - setCustomerForOrder, setOrderShippingAddress
2. Shipping step - setOrderShippingMethod
3. Payment step - Stripe Payment Element OR TestPaymentForm
4. Confirmation step

**Stripe Integration**:

- **File**: `apps/shofar-store/src/components/StripePaymentForm.tsx`
- Uses `createStripePaymentIntent` mutation from Vendure StripePlugin
- Fallback TestPaymentForm when `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` not set
- `redirect: "if_required"` - handles 3DS

**Assumptions/Risks**:

- No explicit webhook handling visible in storefront code
- Order state transitions assume happy path
- No retry logic for failed payments

---

### Assets & Media Pipeline

**S3/R2 Strategy**:

- **File**: `apps/vendure/src/config/s3-asset-storage.ts`
- Enabled via `ASSET_STORAGE=s3` env var
- Supports AWS S3, Cloudflare R2, MinIO
- Required env vars: `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- Falls back to local storage if not configured

**Asset URL Building**:

- **File**: `apps/shofar-store/src/brands/tooly/lib/fetchers.ts:75-87`
- Uses `NEXT_PUBLIC_ASSET_HOST` or defaults to `localhost:3001`
- Handles both relative paths and full URLs

---

### Security & Secrets

**Credentials Found in Codebase**:

| Pattern         | Location                           | Risk                      |
| --------------- | ---------------------------------- | ------------------------- |
| `superadmin123` | CLAUDE.md, vendure-config defaults | **Medium** - doc/dev only |
| `manager123`    | CLAUDE.md                          | **Low** - doc only        |
| `sk_test_*`     | Not in codebase                    | N/A                       |
| `pk_test_*`     | Not in codebase                    | N/A                       |
| `whsec_*`       | Not in codebase                    | N/A                       |

**Hardcoded Defaults in vendure-config.ts**:

```typescript
SUPERADMIN_USERNAME: process.env.SUPERADMIN_USERNAME || "superadmin",
SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD || "superadmin123",
```

Falls back to weak credentials if env vars not set.

**Cookie Secret**:

```typescript
COOKIE_SECRET: process.env.COOKIE_SECRET || "change-in-production",
```

Falls back to insecure value if not set.

---

### Docs Integrity

**CHECKPOINT.md**:

- Version discrepancy: Claims Next.js 16.0.1, actual is 16.0.10
- WO tracker is comprehensive and up-to-date
- Architecture descriptions accurate

**CLAUDE.md**:

- Comprehensive and accurate
- Contains example credentials (appropriate for docs)

---

## 5.4 Knowledge Gaps

1. **Production Vendure Config**: Cannot verify Railway deployment env vars without access
2. **R2 Bucket Status**: Cannot verify if R2 is active in production
3. **Webhook Handler Implementation**: Stripe webhook logic location unknown (may be in Vendure plugin)
4. **Edge Config Integration**: PostHog/Edge Config feature flag setup not investigated
5. **Actual Git State**: Git repo shows "not a git repo" in WSL - may be path issue
6. **Generated Types Sync**: Did not run codegen to verify types match queries

---

## 5.5 Risk Register

### P0 - Critical (Fix Immediately)

| Risk                             | Evidence                                                  | Recommendation                                                            |
| -------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| **DB synchronize in production** | `vendure-config.ts:42` - `synchronize: true` for postgres | Change to `synchronize: IS_DEV` for all DB types. Run migrations instead. |

### P1 - High (Fix This Sprint)

| Risk                                       | Evidence                                       | Recommendation                             |
| ------------------------------------------ | ---------------------------------------------- | ------------------------------------------ |
| **storefrontCarouselNavStyle not queried** | Not in `tooly-product.graphql`                 | Add field to query, regenerate types       |
| **Lint errors block CI**                   | Popover.tsx:218, TechnologySection.tsx:185,196 | Fix react-hooks violations                 |
| **Localhost fallback in proxy**            | `route.ts:10-12`                               | Require VENDURE_INTERNAL_URL in production |

### P2 - Medium (Fix Next Sprint)

| Risk                         | Evidence                          | Recommendation                           |
| ---------------------------- | --------------------------------- | ---------------------------------------- |
| **Node version mismatch**    | Wants >=20, running 18.20.5       | Update Node or adjust engine requirement |
| **Weak default credentials** | vendure-config.ts fallbacks       | Remove fallbacks, require env vars       |
| **Version doc mismatch**     | CHECKPOINT says 16.0.1 vs 16.0.10 | Update CHECKPOINT.md                     |

---

## 5.6 Recommended Next Work Orders (Prioritized)

### WO-DB-SYNC-FIX (P0 - Immediate)

**Goal**: Prevent production data loss from synchronize: true

**Success Criteria**:

- `synchronize` is false for postgres in all environments
- Migration workflow documented
- Tested locally with postgres

**Files Likely Touched**:

- `apps/vendure/src/vendure-config.ts`

**Test Plan**:

1. Set DB_TYPE=postgres locally
2. Verify synchronize is false
3. Run `pnpm --filter @shofar/vendure migrate`

---

### WO-GRAPHQL-CAROUSEL-FIX (P1)

**Goal**: Fix WO 2.0.6c - carousel nav style actually flows from Vendure

**Success Criteria**:

- `storefrontCarouselNavStyle` in GraphQL query
- Types regenerated
- ProductCarousel receives value from Vendure

**Files Likely Touched**:

- `packages/api-client/src/shop/tooly-product.graphql`
- `packages/api-client/src/generated/shop-types.ts` (regenerated)
- Verify `fetchers.ts` extracts the field

**Test Plan**:

1. Add field to query
2. Run codegen
3. Set value in Vendure Admin
4. Verify carousel uses thumbs/dots based on setting

---

### WO-LINT-FIX (P1)

**Goal**: Fix ESLint errors to unblock CI

**Success Criteria**:

- `pnpm --filter @shofar/shofar-store lint` passes
- No react-hooks violations

**Files Likely Touched**:

- `apps/shofar-store/src/brands/tooly/components/ui/Popover.tsx`
- `apps/shofar-store/src/brands/tooly/sections/TechnologySection.tsx`

**Test Plan**:

1. Fix ref access pattern in Popover
2. Fix memoization deps in TechnologySection
3. Run lint, verify 0 errors

---

### WO-PROXY-ENV-GUARD (P1)

**Goal**: Prevent localhost fallback in production

**Success Criteria**:

- Production builds fail if VENDURE_INTERNAL_URL not set
- Or: Remove localhost fallback

**Files Likely Touched**:

- `apps/shofar-store/src/app/api/shop/route.ts`
- Possibly `apps/shofar-store/next.config.ts`

**Test Plan**:

1. Remove localhost fallback
2. Verify build fails without env var
3. Deploy to Vercel with env var set

---

### WO-DOCS-SYNC (P2)

**Goal**: Update CHECKPOINT.md version references

**Success Criteria**:

- Next.js version matches package.json
- All version references verified

**Files Likely Touched**:

- `CHECKPOINT.md`

**Test Plan**:

1. Update version string
2. Cross-reference with package.json

---

## 5.7 Appendix

### Command Outputs (Trimmed)

**Git Status**:

```
fatal: not a git repository (or any of the parent directories): .git
```

Note: May be WSL path issue - repo exists on Windows filesystem.

**Package.json Next.js Version**:

```json
"next": "16.0.10"
```

**Lint Output (errors only)**:

```
Popover.tsx:218:5  error  Cannot access refs during render
TechnologySection.tsx:185:42  error  Compilation Skipped: Existing memoization could not be preserved
TechnologySection.tsx:196:24  error  Compilation Skipped: Existing memoization could not be preserved
```

### Key File Pointers

| Purpose             | Path                                                                   |
| ------------------- | ---------------------------------------------------------------------- |
| Shop Proxy          | `apps/shofar-store/src/app/api/shop/route.ts`                          |
| Vendure Config      | `apps/vendure/src/vendure-config.ts`                                   |
| TOOLY GraphQL Query | `packages/api-client/src/shop/tooly-product.graphql`                   |
| Fetchers            | `apps/shofar-store/src/brands/tooly/lib/fetchers.ts`                   |
| Storefront Content  | `apps/shofar-store/src/brands/tooly/lib/storefront-content.ts`         |
| HeroSection         | `apps/shofar-store/src/brands/tooly/sections/HeroSection.tsx`          |
| ProductCarousel     | `apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx` |
| Lightbox            | `apps/shofar-store/src/brands/tooly/components/ui/Lightbox.tsx`        |
| Checkout            | `apps/shofar-store/src/app/checkout/page.tsx`                          |
| Stripe Form         | `apps/shofar-store/src/components/StripePaymentForm.tsx`               |
| S3 Storage          | `apps/vendure/src/config/s3-asset-storage.ts`                          |
| Debug Mock          | `apps/shofar-store/src/brands/tooly/lib/debug-mock.ts`                 |

### TODO/FIXME Occurrences

None significant found in TOOLY-related files.

---

**End of Report**

_Generated by Claude Code (Opus 4.5) as part of WO-DISCOVERY-01_
