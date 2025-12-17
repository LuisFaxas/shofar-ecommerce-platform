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

| Item           | Status | Notes                                                    |
| -------------- | ------ | -------------------------------------------------------- |
| Build          | ✅     | lint + typecheck + build PASS (commit: 65b565a)          |
| Stock          | ✅     | All 10 variants IN_STOCK                                 |
| Shipping       | ✅     | Standard Shipping $9.99 in tooly channel                 |
| Payment        | ✅     | Test Payment (dummy) in tooly channel                    |
| Checkout API   | ✅     | Full flow tested: AddingItems → PaymentSettled           |
| Checkout UI    | ✅     | /checkout route (Address → Shipping → Payment → Confirm) |
| Product Images | ⚠️     | Infrastructure ready, awaiting user images               |
| Real Payment   | ❌     | Authorize.Net Accept Hosted (Phase 2)                    |

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

### MILESTONE 5: Product Images (Infrastructure)

- **Status**: ⚠️ Ready for user action
- **Change**: Created asset import infrastructure
  - `apps/vendure/assets-import/` folder created
  - `map.json` mapping all 11 SKUs to expected image files
  - `README.md` with usage instructions
- **User Action Required**:
  1. Add 11 PNG images to `assets-import/` folder
  2. Run `pnpm --filter @shofar/vendure bulk:assets`

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

| Product                    | SKU           | Price   | Stock |
| -------------------------- | ------------- | ------- | ----- |
| TOOLY - DLC Gunmetal       | TOOLY-DLC-GM  | $149.00 | 100   |
| TOOLY - Cerakote Midnight  | TOOLY-CK-MID  | $149.00 | 50    |
| TOOLY - Cerakote Arctic    | TOOLY-CK-ARC  | $149.00 | 50    |
| TOOLY - Cerakote Ember     | TOOLY-CK-EMB  | $149.00 | 50    |
| TOOLY - Cerakote Cobalt    | TOOLY-CK-COB  | $149.00 | 50    |
| TOOLY - Cerakote Titanium  | TOOLY-CK-TIT  | $149.00 | 50    |
| Silicone Case + Glass Vial | ACC-CASE-VIAL | -       | 200   |
| Carry Chain - Gold         | ACC-CHAIN-GLD | -       | 150   |
| Carry Chain - Silver       | ACC-CHAIN-SLV | -       | 150   |
| Cleaning Kit               | ACC-CLEAN-KIT | -       | 300   |

### Channels

| Channel | Code    | Token Header           |
| ------- | ------- | ---------------------- |
| Default | default | (none)                 |
| TOOLY   | tooly   | vendure-token: tooly   |
| Future  | future  | vendure-token: future  |
| Peptide | peptide | vendure-token: peptide |

---

## NEXT STEPS (Phase 2)

1. **Product Images**: User adds images → run bulk:assets
2. **Real Payment**: Integrate Authorize.Net Accept Hosted
3. **Order Emails**: Configure email templates
4. **Production Deploy**: Vercel (frontend) + Railway/Fly (Vendure)
5. **pharma-store**: Begin PEPTIDES channel setup

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
