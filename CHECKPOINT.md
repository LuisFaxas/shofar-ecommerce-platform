# CHECKPOINT.md

> **Canonical Progress Log** — This is the ONLY progress file. Do not create additional CHECKPOINT files.

---

## CURRENT TRUTH (Always Up To Date)

| Service      | Port | Status                     |
| ------------ | ---- | -------------------------- |
| shofar-store | 3000 | ❌ Build broken            |
| vendure      | 3001 | ✅ Running                 |
| pharma-store | 3002 | N/A (not presale priority) |

**BRAND_KEY**: `tooly`

**Presale Priority**: Presale ready with dummy payment end-to-end test

### Status Checklist

- Build: ✅ shofar-store typecheck + build PASS
- Checkout: ❌ No /checkout route exists
- Payment: ❌ No payment methods configured in tooly channel
- Shipping: ❌ No shipping methods configured in tooly channel
- Stock: ❌ All variants OUT_OF_STOCK
- Images: ❌ featuredAsset is null

---

## PRESALE SPRINT LOG (Append-Only)

### 2025-12-17 — MILESTONE 1: Build + Tooling Green

- **Change**: Fixed TypeScript/ESLint/Build errors
  - Created `packages/config/eslint/library.js`
  - Fixed ESLint path resolution in all packages (.eslintrc.js)
  - Fixed Button import in design-system/page.tsx
  - Fixed Dialog.tsx void expression
  - Fixed Input.tsx comma operator
  - Fixed Popover.tsx cloneElement typing
  - Fixed ReviewsMarquee.tsx undefined rating
  - Fixed usePointerVars.ts useRef typing
  - Fixed Card.tsx CardHeader props (added title/description)
  - Fixed Section.tsx CTASection heading prop type
  - Fixed api-client duplicate exports (namespace exports)
  - Fixed admin-client.ts header typing
  - Fixed client-factory.ts Promise types
  - Fixed faxas-brand-config lint issues
- **Verify**:
  - `pnpm --filter @shofar/shofar-store typecheck` → PASS
  - `pnpm --filter @shofar/shofar-store build` → PASS
- **Commit**: `fix(storefront): resolve build+lint blockers for presale sprint`

### 2024-12-17 — Sprint Start

- **Change**: Established canonical CHECKPOINT.md + progress protocol
- **Verify**: `git status` shows this file updated
- **Commit**: `docs(repo): establish canonical checkpoint + progress protocol`

---

## Historical Work Orders (Reference Only)

> **Note**: Port references in historical sections below may be outdated.
> shofar-store was originally on port 3001 but is now on **port 3000**.
> Vendure runs on port 3001.

## Work Order Status

### ✅ WO 2.1 Complete - Multi-Tenant Architecture

- Implemented dual-mode brand resolution (Mode A: BRAND_KEY, Mode B: host-based)
- Created brand-config package with TOOLY and PEPTIDES brands
- Set up secure dev-only cookie override with JWT
- Complete error resilience with boundaries and loading states
- NO production cookies for brand switching (SEO critical)

### ✅ WO 2.2 Complete - Architecture Reset for Unique Brand Frontends

- Removed 578 lines of premature UI components
- Created clean brand-specific folder structures
- Each brand has completely unique frontend (no shared UI)
- Diagnostic page shows current brand resolution

### ✅ WO 2.3 Complete - Isolated Store Architecture

#### Implementation Summary:

Transformed the SHOFAR platform from a single multi-brand application to THREE completely isolated store applications, each serving a distinct business category with complete code isolation.

#### Completed Tasks:

- ✅ **Created Three Independent Next.js Applications:**
  - `apps/shofar-store` - Tools & Hardware category (Port 3001)
  - `apps/pharma-store` - Medical & Research category (Port 3002)
  - `apps/faxas-store` - Fashion category placeholder (Port 3003)

- ✅ **Enforced Complete UI Isolation:**
  - Deleted `packages/ui` entirely - no shared components allowed
  - Each store has its own unique UI implementation
  - Prevents any cross-contamination between business categories

- ✅ **Store-Specific Brand Configuration:**
  - Split `packages/brand-config` into three isolated packages:
    - `packages/shofar-brand-config` - TOOLY and future tool brands
    - `packages/pharma-brand-config` - PEPTIDES and future pharma brands
    - `packages/faxas-brand-config` - Placeholder for future fashion brands
  - Each store can only access its own brand configuration

- ✅ **Brand Migration & Content Isolation:**
  - TOOLY content migrated exclusively to `shofar-store`
  - PEPTIDES structure created exclusively in `pharma-store`
  - Complete brand isolation achieved between stores

#### Architecture Patterns Established:

```
┌─────────────────────────────────────────────────────────┐
│                    ISOLATED STORES                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  SHOFAR-STORE (Port 3001)                               │
│  └── Business: Tools & Hardware                          │
│      └── Brands: TOOLY, future tool brands               │
│          └── Resolution: Mode A (BRAND_KEY) + Mode B     │
│                                                           │
│  PHARMA-STORE (Port 3002)                               │
│  └── Business: Medical & Research                        │
│      └── Brands: PEPTIDES, future pharma brands          │
│          └── Resolution: Mode A (BRAND_KEY) + Mode B     │
│                                                           │
│  FAXAS-STORE (Port 3003)                                │
│  └── Business: Fashion                                   │
│      └── Brands: Future fashion brands                   │
│          └── Resolution: Mode A (BRAND_KEY) + Mode B     │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

#### Brand Resolution Implementation (Per Store):

Each store maintains internal multi-brand support using:

- **Mode A**: `BRAND_KEY` environment variable for production SSG/ISR
- **Mode B**: Host-based resolution for staging SSR only
- **Dev Override**: JWT-signed cookies (jose library) for development only
- **Production Rule**: NO cookies in production (critical for SEO)

#### Security & Isolation Achieved:

- ✅ **Complete Business Category Isolation**: Customers on TOOLY will NEVER discover PEPTIDES exists
- ✅ **No Shared UI Code**: Each store has completely unique components
- ✅ **Independent Deployments**: Each store can be deployed separately
- ✅ **Separate Build Pipelines**: Independent build processes per store
- ✅ **Isolated Dependencies**: Store-specific package dependencies

#### Monorepo Scripts Added:

```json
{
  "dev:shofar": "BRAND_KEY=tooly pnpm --filter @shofar/shofar-store dev",
  "dev:pharma": "BRAND_KEY=peptides pnpm --filter @shofar/pharma-store dev",
  "dev:faxas": "pnpm --filter @shofar/faxas-store dev",
  "dev:all-stores": "concurrently \"pnpm dev:shofar\" \"pnpm dev:pharma\" \"pnpm dev:faxas\""
}
```

#### Testing & Verification:

- ✅ SHOFAR-STORE running independently with TOOLY brand
- ✅ PHARMA-STORE running independently with PEPTIDES brand
- ✅ No cross-store code references or dependencies
- ✅ Turborepo build graph validates store isolation
- ⚠️ apps/web archival pending (blocked by file locks, non-critical)

## ✅ WO 2.4 Complete - Code Audit & Alignment

### Audit Summary (Completed):

1. ✅ **Deleted Obsolete Code**:
   - Removed `apps/web` (old multi-brand app)
   - Already deleted `packages/ui` (shared UI components)
   - Fixed `tsconfig.json` paths

2. ✅ **Fixed Build Issues**:
   - Updated all stores to use async `headers()` and `cookies()` (Next.js 15+)
   - Fixed TypeScript errors in `faxas-brand-config` (empty enum handling)
   - Aligned `@shofar/faxas-store` package naming

3. ✅ **Technology Stack Audit**:
   - **Frontend**: Next.js 16.0.1 (latest), React 19.2.0
   - **Styling**: Tailwind CSS v4 with PostCSS
   - **TypeScript**: v5.9.3 with strict mode
   - **Monorepo**: Turborepo + pnpm workspaces
   - **Auth**: JWT (jose) for dev-only brand override
   - **Build**: All stores compile successfully

4. ✅ **Architecture Validation**:
   - Three isolated stores with complete separation
   - Store-specific brand configuration packages
   - No shared UI code between stores
   - Independent deployment capability per store

### Current Build State Report:

#### ✅ HEALTHY & PRODUCTION-READY

- **Isolated Store Architecture**: Fully implemented and tested
- **Brand Resolution**: Mode A (BRAND_KEY) + Mode B (host-based) working
- **Build Process**: All stores build successfully with TypeScript
- **Dependencies**: Clean, no obsolete packages referenced
- **Security**: JWT-signed cookies for dev-only, no production cookies

#### 🔧 MINOR PENDING ITEMS

- Old `apps/web` folder deleted (was blocking, now resolved)
- CLAUDE.md needs updating to reflect current architecture

### What Should Come Next (Reference):

## Priority 1: Vendure Integration (Work Order 3.0)

**Goal**: Connect stores to Vendure backend with channel isolation

1. **Setup Vendure Channels**:
   - Configure TOOLY channel for shofar-store
   - Configure PEPTIDES channel for pharma-store
   - Set up channel-specific product catalogs

2. **API Client Integration**:
   - Implement GraphQL queries per store
   - Channel token authentication
   - Type-safe API calls with codegen

3. **Product Display**:
   - Create product listing pages
   - Implement product detail views
   - Add to cart functionality

## Priority 2: Store-Specific UI Development

**Goal**: Unique brand experiences per store

1. **TOOLY Store (shofar-store)**:
   - Premium tool store interface
   - Single-page product showcase
   - Professional contractor focus

2. **PEPTIDES Store (pharma-store)**:
   - Medical/research interface
   - Scientific product presentation
   - Compliance-focused checkout

## Priority 3: E-commerce Features

- Shopping cart implementation
- Checkout flow with Authorize.Net
- Order tracking
- Customer accounts per store

## Priority 4: Performance & SEO

- Implement ISR for product pages
- Image optimization
- Structured data per brand
- Sitemap generation per store

## ✅ Phase 0 Complete - Vendure Integration Foundation

### Completed: 2025-11-28

#### Implementation Summary:

Established the foundation for Vendure backend integration with the shofar-store, including channel configuration, API proxy, GraphQL codegen, and seed data.

#### Completed Tasks:

1. **✅ Port Configuration**:
   - shofar-store now runs on port 3000 (`next dev -p 3000`)
   - Vendure remains on port 3001
   - Proper separation of frontend and backend

2. **✅ Idempotent Seed Script** (`seed-tooly-full.ts`):
   - Channel-scoped to `tooly` channel
   - Production guard: requires channel to exist first
   - Upserts facets: `finish` (DLC, Cerakote), `color` (6 values), `category` (main-product, accessory)
   - Upserts TOOLY main product with 6 variants (DLC Gunmetal, Cerakote colors)
   - Upserts 4 accessory products (Silicone Case, Chains, Cleaning Kit)
   - Upserts Accessories collection
   - Gracefully handles existing data (no duplicates, no errors)

3. **✅ GraphQL Codegen Configuration**:
   - Updated `codegen-shop.ts` with `vendure-token: tooly` header
   - Targets `http://localhost:3001/shop-api`
   - Generates types to `src/generated/shop-types.ts`

4. **✅ Apollo Client Cookie Support**:
   - `shop-client.ts` has `credentials: 'include'` by default
   - Enables session persistence across requests

5. **✅ API Proxy Route** (`/api/shop`):
   - Located at `apps/shofar-store/src/app/api/shop/route.ts`
   - Proxies POST and GET requests to Vendure Shop API
   - Injects `vendure-token: tooly` header
   - Forwards cookies for session management
   - 1MB request body limit

6. **✅ Vendure Setup & Seeding**:
   - Fixed zone creation for channel requirements
   - Created `tooly` and `future` channels
   - Seeded TOOLY product catalog
   - All curl tests pass

#### Verification Results:

```bash
# Products query - 6 products returned
curl -H "vendure-token: tooly" localhost:3001/shop-api
→ TOOLY, Silicone Case for TOOLY, Silicone Case + Glass Vial,
  Carry Chain - Gold, Carry Chain - Silver, Cleaning Kit

# Collections query - Accessories collection found
curl -H "vendure-token: tooly" localhost:3001/shop-api
→ Accessories collection (ID: 2)

# Product variants - DLC Gunmetal at $149
curl -H "vendure-token: tooly" localhost:3001/shop-api
→ TOOLY - DLC Gunmetal, SKU: TOOLY-DLC-GM, $149.00
```

#### Files Created/Modified:

- `apps/shofar-store/package.json` - port 3000
- `apps/vendure/src/initial-data/seed-tooly-full.ts` - idempotent seed script
- `apps/vendure/src/initial-data/setup-channels.ts` - zone creation fix
- `apps/vendure/package.json` - `seed:tooly` script
- `packages/api-client/codegen-shop.ts` - vendure-token header
- `apps/shofar-store/src/app/api/shop/route.ts` - API proxy

## Next Steps

1. Begin Phase 1 - Product Display
2. Implement product listing page using generated types
3. Create product detail view with variant selection
4. Add to cart functionality

## Critical Invariants Maintained

- ✅ Mode A (BRAND_KEY) for production SSG/ISR
- ✅ Mode B (host-based) for staging SSR
- ✅ NO production cookies (kills SEO)
- ✅ Complete UI isolation between brands
- ✅ Complete store isolation (WO 2.3)
