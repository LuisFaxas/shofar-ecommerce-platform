# CHECKPOINT.md

> **Canonical Progress Log** — This is the ONLY progress file. Do not create additional CHECKPOINT files.
> **Purpose**: Quick reference for Claude Code to understand project state, especially after context compacting.

---

## CURRENT TRUTH (Read This First)

**Last Updated**: 2025-12-17

### Service Status

| Service      | Port | Package              | Status        |
| ------------ | ---- | -------------------- | ------------- |
| shofar-store | 3000 | @shofar/shofar-store | ✅ Build PASS |
| vendure      | 3001 | @shofar/vendure      | ✅ Running    |
| pharma-store | 3002 | @shofar/pharma-store | N/A (pending) |
| faxas-store  | 3003 | @shofar/faxas-store  | N/A (pending) |

### Active Brand: TOOLY

**BRAND_KEY**: `tooly`
**Channel Token**: `vendure-token: tooly`

### Presale Readiness Checklist

| Item           | Status | Notes                                                                      |
| -------------- | ------ | -------------------------------------------------------------------------- |
| Build          | ✅     | lint + typecheck + build PASS (commit: 5502cd7)                            |
| Stock          | ✅     | 1 sellable variant IN_STOCK (TOOLY-DLC-GM)                                 |
| Shipping       | ✅     | Standard Shipping $9.99 in tooly channel                                   |
| Payment        | ✅     | Test Payment (dummy) - ready for practice presale                          |
| Checkout API   | ✅     | Full flow tested: AddingItems → PaymentSettled                             |
| Checkout UI    | ✅     | /checkout route (Address → Shipping → Payment → Confirm)                   |
| Product Images | ✅     | TOOLY has 5 gallery assets on R2 + featuredAsset set                       |
| Asset Hosting  | ✅     | Cloudflare R2 configured (legacy assets exist, not in use)                 |
| Frontend/UI    | ✅     | Hero redesign, mobile menu fixed, search bar removed, cart fixed           |
| Admin Organize | ➖     | Optional: Brand facet created, not required for single prod                |
| Real Payment   | ⚠️     | Stripe captures funds, but order state not settling (webhook fix required) |

---

## QUICK REFERENCE

### Essential Commands

```bash
# Start development (most common)
pnpm --filter @shofar/vendure dev      # Terminal 1: Vendure on :3001
pnpm --filter @shofar/shofar-store dev # Terminal 2: Store on :3000

# Verify build health
pnpm --filter @shofar/shofar-store typecheck
pnpm --filter @shofar/shofar-store build
pnpm --filter @shofar/shofar-store lint

# Vendure data operations
pnpm --filter @shofar/vendure setup        # Initialize DB + channels
pnpm --filter @shofar/vendure seed:tooly   # Seed TOOLY products
pnpm --filter @shofar/vendure bulk:assets  # Import product images

# GraphQL codegen (requires Vendure running)
pnpm --filter @shofar/api-client codegen:shop
```

### Test API Queries

```bash
# Check products in tooly channel
curl -s http://localhost:3001/shop-api -H "Content-Type: application/json" \
  -H "vendure-token: tooly" \
  -d '{"query":"{ products { items { name variants { sku stockLevel } } } }"}'

# Check shipping methods (requires active order)
curl -s http://localhost:3001/shop-api -H "vendure-token: tooly" \
  -d '{"query":"{ eligibleShippingMethods { id name price } }"}'

# Admin login
curl -s http://localhost:3001/admin-api -c cookies.txt \
  -d '{"query":"mutation { login(username: \"superadmin\", password: \"superadmin123\") { ... on CurrentUser { id } } }"}'
```

### Credentials

| Service       | Username          | Password      |
| ------------- | ----------------- | ------------- |
| Vendure Admin | superadmin        | superadmin123 |
| Tooly Manager | manager@tooly.com | manager123    |

### Key File Locations

```
apps/
├── shofar-store/           # TOOLY frontend (Next.js 16)
│   ├── src/app/            # App router pages
│   │   ├── checkout/       # Checkout flow
│   │   └── api/shop/       # Vendure proxy
│   └── src/brands/tooly/   # TOOLY-specific components
├── vendure/                # Headless commerce backend
│   ├── src/initial-data/   # Seed scripts
│   ├── assets-import/      # Product images (add here)
│   └── vendure-db.sqlite   # Development database
packages/
├── api-client/             # GraphQL client + codegen
├── shofar-brand-config/    # TOOLY brand configuration
└── config/                 # Shared TypeScript/ESLint config
```

---

## CRITICAL INVARIANTS (Never Violate)

1. **NO production cookies for brand switching** — Kills SEO
2. **Mode A (BRAND_KEY) for production** — Enables SSG/ISR
3. **Complete UI isolation between stores** — No shared components
4. **Channel token required for Vendure queries** — `vendure-token: tooly`
5. **Never use `--no-verify` on commits** — Fix lint/typecheck errors instead
6. **Don't touch ButtonPrimary** — It's the sacred component

---

## PRESALE SPRINT LOG (2025-12-17)

### MILESTONE 12: Stripe Payment Integration (2025-12-17)

- **Status**: ⚠️ PARTIAL - Payments capture, order state not settling
- **Branch**: `feature/frontend-polish`
- **Test Orders**:
  - `VN7PGZXUJBZV9JXM` - $158.99 (test mode)
  - `WVDGQZP9R6MNQZH4` - $158.99 (with webhook forwarding)
- **Commits**:
  - `6972300` fix(web): gate setcustomerfororder and isolate shop/admin sessions
  - `5502cd7` fix(web): checkout mutation fields and input label styling
  - `dbeecf9` docs(repo): update checkpoint with stripe success and next steps
- **Bugs Fixed**:
  1. `Cannot set a Customer for the Order when already logged in` - Added activeCustomer check
  2. `Cannot read properties of undefined (reading 'map')` - Fixed SET_SHIPPING_METHOD_MUTATION to return all order fields
  3. Input label black background - Removed hardcoded bg color from floating label
- **Stripe Setup Completed**:
  - ✅ Stripe CLI installed via winget
  - ✅ `stripe login` authenticated to Faxas Enterprise LLC sandbox
  - ✅ `stripe listen --forward-to localhost:3001/payments/stripe` running
  - ✅ Webhook secret updated in Vendure Admin (whsec_725f78aa...)
  - ⚠️ Order state not updating to PaymentSettled (webhook processing issue)
- **Files Modified**:
  - `apps/shofar-store/src/app/checkout/page.tsx` - activeCustomer check + full mutation fields
  - `apps/vendure/src/vendure-config.ts` - Cookie name isolation
  - `apps/shofar-store/src/brands/tooly/components/ui/Input.tsx` - Label styling fix

### MILESTONE 11: Frontend Polish + Hero Redesign (2025-12-17)

- **Status**: ✅ Complete
- **Branch**: `feature/frontend-polish`
- **Commits**:
  - `764c517` fix(web): mobile menu close + remove search bar
  - `eaa3986` fix(web): cart drawer closes on backdrop click
  - `8e1ec0c` feat(vendure): add heroimage channel custom field
  - `eb7c39e` feat(web): hero section full background redesign
- **Bug Fixes**:
  | Bug | Fix | Commit |
  |-----|-----|--------|
  | Can't click out of hamburger menu | Backdrop outside nav (Fragment return) | `764c517` |
  | Can't close menu with X button | Removed FocusTrap blocking clicks | `764c517` |
  | Can't open cart while menu open | handleCartClick closes menu first | `764c517` |
  | Section nav lands wrong (cut off) | scroll-margin-top 5rem/4rem in globals.css | `764c517` |
  | Search bar removal | Completely removed (per user request) | `764c517` |
  | Cart drawer click-outside (desktop) | FocusTrap clickOutsideDeactivates option | `eaa3986` |
- **Hero Redesign**:
  - **Before**: Product image floating at bottom of hero, disconnected feel
  - **After**: Full dramatic background image with frosted overlay
  - Layout: Text/buttons centered over background image
  - Vendure integration: heroImage custom field on Channel entity
  - Fallback: product.featuredAsset → gradient background
  - Responsive: Same design at all viewports (1440px, 768px, 375px)
- **Files Modified**:
  - `apps/shofar-store/src/brands/tooly/components/ui/Navbar.tsx` - Full rewrite (335 lines)
  - `apps/shofar-store/src/brands/tooly/components/CartDrawer.tsx` - FocusTrap fix
  - `apps/shofar-store/src/app/globals.css` - scroll-margin-top for sections
  - `apps/vendure/src/vendure-config.ts` - Channel heroImage custom field
  - `apps/shofar-store/src/brands/tooly/sections/HeroSection.tsx` - Full background redesign
  - `apps/shofar-store/src/brands/tooly/lib/fetchers.ts` - Fetch heroImage
  - `packages/api-client/src/shop/tooly-product.graphql` - activeChannel query
- **User Action**: Upload hero image via Vendure Admin UI (Settings → Channels → tooly → Hero Background Image)

### MILESTONE 10: Stripe Payment Integration (2025-12-17)

- **Status**: ✅ Complete (see Milestone 12 for final fixes)
- **Branch**: `feature/stripe-payments`
- **Commits**:
  - `6c19a3b` feat(vendure): enable stripe plugin (test mode)
  - `8ad0360` feat(web): stripe payment element checkout step
- **Changes**:
  - Installed `@vendure/payments-plugin` and `stripe@13` in Vendure
  - Added StripePlugin to vendure-config.ts with webhook at `/payments/stripe`
  - Installed `@stripe/stripe-js` and `@stripe/react-stripe-js` in storefront
  - Created `StripePaymentForm.tsx` component with Stripe Payment Element
  - Checkout page conditionally uses Stripe (if configured) or test payment
  - Created `docs/STRIPE-TESTING.md` with setup guide
- **Configuration Done**:
  - ✅ Stripe Payment Method created in Admin UI (ID: 2)
  - ✅ API key (sk*test*...) entered
  - ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in .env.local
  - ⚠️ Webhook secret is placeholder (update for production)
- **Test Card**: `4242 4242 4242 4242` (any future date, any CVC)
- **Files Modified**:
  - `apps/vendure/src/vendure-config.ts` - Added StripePlugin
  - `apps/vendure/.env.example` - Documented Stripe setup
  - `apps/shofar-store/src/app/checkout/page.tsx` - Conditional Stripe/test payment
  - `apps/shofar-store/src/components/StripePaymentForm.tsx` - NEW Payment Element
  - `docs/STRIPE-TESTING.md` - NEW testing guide

### MILESTONE 9: Vendure Source-of-Truth Audit (2025-12-17)

- **Status**: ✅ Complete
- **Branch**: `feature/tooly-clean-slate`
- **Objective**: Verify storefront is 100% driven by Vendure data (no hardcoding)
- **Audit Results**:

  | Component               | Status     | Behavior                                          |
  | ----------------------- | ---------- | ------------------------------------------------- |
  | ProductSection variants | ✅ Dynamic | Reads from `product.variants`                     |
  | Color swatches          | ✅ Dynamic | Hidden if `variants.length === 1`, shown if >1    |
  | ProductCarousel         | ✅ Dynamic | Uses `product.assets[]` from Vendure              |
  | AccessoriesSection      | ✅ Dynamic | Shows "Coming Soon" if empty, grid if items exist |
  | Prices                  | ✅ Dynamic | From `variant.priceWithTax`                       |
  | Stock                   | ✅ Dynamic | From `variant.stockLevel`                         |

- **Bug Fixed**: `fetchers.ts` accessories collection slug was `'tooly-accessories'` → fixed to `'accessories'`
- **Debug Mock Mode**: Added `?debugMock=1` URL param for DEV testing
  - Simulates additional variants and accessories
  - Shows amber banner when active
  - Does NOT ship in production

- **How to Add New Variants/Accessories**:
  1. **New Variant**: Admin UI → Products → TOOLY → Add Variant → Set color facet
  2. **New Accessory**: Admin UI → Products → Create → Add to `accessories` collection
  3. Frontend automatically renders them (no code changes needed)

- **Files Modified**:
  - `apps/shofar-store/src/brands/tooly/lib/fetchers.ts` - Fixed collection slug
  - `apps/shofar-store/src/brands/tooly/lib/debug-mock.ts` - NEW debug utility
  - `apps/shofar-store/src/brands/tooly/index.tsx` - Debug mock integration

### MILESTONE 8: TOOLY Clean Slate (2025-12-17)

- **Status**: ✅ Complete
- **Branch**: `feature/tooly-clean-slate`
- **Commits**:
  - `b4166b2` feat(vendure): clean slate tooly channel - single gunmetal variant
  - `8b62df5` feat(web): carousel + accessories coming soon state
- **Changes**:
  - Deleted 5 TOOLY variants (kept only TOOLY-DLC-GM Gunmetal)
  - Deleted 5 accessory products from tooly channel
  - Uploaded 5 gunmetal product images to R2 via gallery upload CLI
  - Created `ProductCarousel.tsx` - mobile-first image carousel with swipe, dots, thumbnails
  - Updated `ProductSection.tsx` - uses carousel, hides color swatches when 1 variant
  - Updated `AccessoriesSection.tsx` - premium "Coming Soon" empty state
- **Before/After**:
  | Metric | Before | After |
  |--------|--------|-------|
  | TOOLY variants | 6 | 1 (Gunmetal) |
  | Accessories (tooly) | 5 | 0 |
  | Product gallery images | 0 | 5 |
- **Verify**:

  ```bash
  # Shop API: 1 variant
  curl -s http://localhost:3001/shop-api -H "vendure-token: tooly" \
    -d '{"query":"{ product(slug:\"tooly\"){ variants { sku } } }"}'

  # Shop API: 0 accessories
  curl -s http://localhost:3001/shop-api -H "vendure-token: tooly" \
    -d '{"query":"{ collection(slug:\"accessories\"){ productVariants { totalItems } } }"}'
  ```

- **New Files**:
  - `apps/vendure/src/cli/upload-gallery.ts` - Gallery image upload CLI
  - `apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx` - Image carousel

### MILESTONE 7: Admin Organization (Partial)

- **Status**: ⚠️ In Progress
- **Change**: Created Brand facet for filtering products in Admin UI
  - Brand facet created with values: TOOLY, PEPTIDE
  - Allows filtering Products by brand in Admin panel
- **User Action Required**:
  1. Go to Products → open each product → add Brand facet value
  2. TOOLY products → Brand: TOOLY
  3. PEPTIDE products → Brand: PEPTIDE
- **Why**: Superadmin sees ALL channels - this enables filtering by brand

### MILESTONE 6: Cloudflare R2 Asset Hosting

- **Status**: ✅ Complete
- **Change**: Migrated asset storage from local to Cloudflare R2
  - `apps/vendure/src/config/s3-asset-storage.ts` - Fixed path separator bug (Windows backslash → forward slash)
  - `apps/shofar-store/next.config.ts` - Added `*.r2.dev` remote pattern for Next/Image
  - 11 product images uploaded to R2 bucket via `bulk:assets`
- **R2 Configuration**:
  - Bucket: `tooly-assets`
  - Public URL: `https://pub-e4e7d92e0a3944a6a461ce45f91336dc.r2.dev`
  - S3 Endpoint: `https://9815cde18ff3728069fccdbaa4da52bf.r2.cloudflarestorage.com`
- **Verify**: `curl -s -o /dev/null -w "%{http_code}" "https://pub-e4e7d92e0a3944a6a461ce45f91336dc.r2.dev/preview/36/1v1a8379__preview.jpg"` → 200
- **Fix Applied**: AdminUiPlugin index.html corruption - reinstalled `@vendure/admin-ui-plugin`

### MILESTONE 5: Product Images (Complete)

- **Status**: ✅ Complete
- **Change**: Uploaded all product images to R2
  - `apps/vendure/assets-import/map.json` - 11 SKU→image mappings
  - Images: 1V1A8379.jpg through 1V1A8480.jpg (user-provided photos)
  - Bulk import: `pnpm --filter @shofar/vendure bulk:assets` → 11 success, 0 failed
- **SKU→Image Mapping**:
  - TOOLY-DLC-GM → 1V1A8379.jpg
  - TOOLY-CK-MID → 1V1A8395.jpg
  - TOOLY-CK-ARC → 1V1A8427.jpg
  - TOOLY-CK-EMB → 1V1A8445.jpg
  - TOOLY-CK-COB → 1V1A8446.jpg
  - TOOLY-CK-TIT → 1V1A8448.jpg
  - ACC-CASE-VIAL → 1V1A8452.jpg
  - ACC-CHAIN-GLD → 1V1A8464.jpg
  - ACC-CHAIN-SLV → 1V1A8468.jpg
  - ACC-CLEAN-KIT → 1V1A8474.jpg
  - ACC-CASE-001 → 1V1A8480.jpg

### MILESTONE 4: Minimal Checkout Route

- **Status**: ✅ Complete
- **Change**: Created multi-step checkout flow
  - `apps/shofar-store/src/app/checkout/page.tsx` (new)
  - Steps: Address → Shipping → Payment → Confirmation
  - Vendure mutations: setCustomerForOrder, setOrderShippingAddress, setOrderShippingMethod, addPaymentToOrder
  - Updated CartDrawer to navigate to /checkout
- **Verify**: `pnpm --filter @shofar/shofar-store build` → includes /checkout route

### MILESTONE 3: Shipping + Payment Enabled

- **Status**: ✅ Complete
- **Change**: Created shipping and payment methods for tooly channel
  - Standard Shipping ($9.99) with default-shipping-eligibility-checker
  - Test Payment (dummy) with automaticSettle
  - Both assigned to tooly channel via database
- **Verify**: Full checkout flow works end-to-end (PaymentSettled)

### MILESTONE 2: Vendure Data Sanity

- **Status**: ✅ Complete
- **Change**: Fixed stock levels showing OUT_OF_STOCK
  - Root cause: Default Stock Location not assigned to tooly channel
  - Fix: Added stock_location to channels via direct DB insert
- **Verify**: All 10 variants show IN_STOCK in Shop API

### MILESTONE 1: Build + Tooling Green

- **Status**: ✅ Complete
- **Change**: Fixed TypeScript/ESLint/Build errors
  - Created `packages/config/eslint/library.js`
  - Fixed various component type issues
  - Fixed api-client duplicate exports
- **Verify**: `pnpm --filter @shofar/shofar-store build` → PASS
- **Commit**: `65b565a`

---

## TECHNOLOGY STACK

| Layer      | Technology                  | Version |
| ---------- | --------------------------- | ------- |
| Frontend   | Next.js (App Router)        | 16.0.1  |
| React      | React                       | 19.2.0  |
| Styling    | Tailwind CSS                | v4      |
| TypeScript | TypeScript (strict)         | 5.9.3   |
| Backend    | Vendure (headless commerce) | 3.5.0   |
| Database   | SQLite (dev) / PostgreSQL   | -       |
| Monorepo   | Turborepo + pnpm            | -       |
| Auth       | JWT (jose) for dev override | -       |

---

## ARCHITECTURE OVERVIEW

### Isolated Store Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ISOLATED STORES                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  SHOFAR-STORE (Port 3000) ← ACTIVE                      │
│  └── Business: Tools & Hardware                          │
│      └── Brand: TOOLY                                    │
│          └── Channel: tooly                              │
│                                                          │
│  PHARMA-STORE (Port 3002) ← Pending                     │
│  └── Business: Medical & Research                        │
│      └── Brand: PEPTIDES                                 │
│          └── Channel: peptide                            │
│                                                          │
│  FAXAS-STORE (Port 3003) ← Placeholder                  │
│  └── Business: Fashion                                   │
│      └── Brands: TBD                                     │
│                                                          │
│  VENDURE BACKEND (Port 3001)                            │
│  └── Multi-channel headless commerce                     │
│      └── Channels: default, tooly, peptide, future       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Brand Resolution Modes

- **Mode A (Production)**: `BRAND_KEY` env var → SSG/ISR enabled
- **Mode B (Staging)**: Host-based resolution → SSR only
- **Dev Override**: JWT-signed cookies (development only)

### Data Flow

```
Browser → Next.js App → /api/shop proxy → Vendure Shop API
                                              ↓
                                    vendure-token: tooly
                                              ↓
                                    Channel-scoped data
```

---

## HISTORICAL WORK ORDERS (Collapsed)

<details>
<summary>WO 2.1-2.4: Multi-Tenant & Isolated Store Architecture</summary>

### ✅ WO 2.1 - Multi-Tenant Architecture

- Dual-mode brand resolution (Mode A + Mode B)
- Brand-config package with TOOLY/PEPTIDES
- JWT dev-only cookie override
- NO production cookies (SEO critical)

### ✅ WO 2.2 - Architecture Reset

- Removed 578 lines of premature UI
- Clean brand-specific folder structures
- Each brand has unique frontend

### ✅ WO 2.3 - Isolated Store Architecture

- Three independent Next.js apps
- Deleted shared `packages/ui`
- Store-specific brand config packages
- Complete business category isolation

### ✅ WO 2.4 - Code Audit & Alignment

- Deleted `apps/web` (old multi-brand app)
- Fixed Next.js 15+ async headers/cookies
- All stores build successfully

</details>

<details>
<summary>WO 2.5: TOOLY Design System</summary>

### ✅ WO 2.5 - TOOLY Design System

- Gunmetal palette (11 shades)
- Glassmorphism effects (light/dark/heavy)
- Motion system with prefers-reduced-motion
- Components: Button, Card, Section, Input, Dialog, etc.
- `/design-system` showcase page

### ✅ WO 2.5.1 - Design System Refinement

- Cool gunmetal scale (blue-gray metallic)
- Frosted glass with inner highlights
- Industrial styling (10px radius, hairline borders)
- Precision motion timing (160-280ms)

</details>

<details>
<summary>Phase 0: Vendure Integration Foundation</summary>

### ✅ Phase 0 Complete (2025-11-28)

- Port configuration (store:3000, vendure:3001)
- Idempotent seed script (seed-tooly-full.ts)
- GraphQL codegen with vendure-token header
- API proxy route (/api/shop)
- TOOLY product catalog seeded (6 variants + 4 accessories)

</details>

---

## VENDURE DATA SUMMARY

### Products in TOOLY Channel

| Product              | SKU          | Price   | Stock | Notes                  |
| -------------------- | ------------ | ------- | ----- | ---------------------- |
| TOOLY - DLC Gunmetal | TOOLY-DLC-GM | $149.00 | 100   | 5 gallery images on R2 |

> **Note**: As of Milestone 8, only 1 TOOLY variant exists (Gunmetal). Accessories removed from tooly channel but collection slug `accessories` preserved (returns 0 items).

### Channels

| Channel | Code    | Token Header           |
| ------- | ------- | ---------------------- |
| Default | default | (none)                 |
| TOOLY   | tooly   | vendure-token: tooly   |
| Future  | future  | vendure-token: future  |
| Peptide | peptide | vendure-token: peptide |

---

## NEXT STEPS (Phase 2)

### Immediate (BLOCKING for Launch)

1. **🔴 FIX WEBHOOK**: Orders must reach PaymentSettled state
   - Debug why Vendure isn't processing Stripe webhooks
   - Verify webhook endpoint `/payments/stripe` is receiving events
   - Check Vendure logs for webhook errors
2. **Practice Presale**: Internal rehearsal (3 runs: incognito, normal, mobile)

### Production Prep (After Webhook Fixed)

3. **Stripe Production Keys**:
   - Replace test keys with live keys (`sk_live_...`, `pk_live_...`)
   - Set up permanent webhook in Stripe Dashboard (not CLI forwarding)
   - Upload hero image in Admin UI (Settings → Channels → tooly)
4. **Production Deploy**: Vercel (frontend) + hosted Vendure + PostgreSQL + Cloudflare R2

### Post-Launch

5. **Order Emails**: Configure transactional email templates
6. **Policies**: Privacy policy, terms of service, refund policy pages
7. **pharma-store**: Begin PEPTIDES channel setup (separate store)
8. **Auth System**: Implement Vendure-native authentication (login/signup/account)

---

## TROUBLESHOOTING

### Common Issues

**Port already in use:**

```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <pid>
```

**Stock showing OUT_OF_STOCK:**

- Check stock_location is assigned to channel in database
- Restart Vendure after DB changes

**GraphQL codegen fails:**

- Ensure Vendure is running first
- Check vendure-token header in codegen config

**Build fails with TypeScript errors:**

- Run `pnpm --filter @shofar/shofar-store typecheck` to see errors
- Check for missing imports or type mismatches

---

_This checkpoint is the single source of truth. Update it after every milestone._
