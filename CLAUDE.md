# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-Level Architecture

### Monorepo Structure

This is a **Turborepo + pnpm** monorepo with strict TypeScript configuration. The architecture follows **ISOLATED STORE ARCHITECTURE** with complete separation between business categories.

### Isolated Store Architecture (CRITICAL)

#### Three Completely Isolated Stores

The platform consists of THREE independent Next.js applications, each serving a distinct business category:

| Store        | Package                | Port | Business              | Brands   |
| ------------ | ---------------------- | ---- | --------------------- | -------- |
| shofar-store | `@shofar/shofar-store` | 3000 | Tools & Hardware      | TOOLY    |
| pharma-store | `@shofar/pharma-store` | 3002 | Medical & Research    | PEPTIDES |
| faxas-store  | `@shofar/faxas-store`  | 3003 | Fashion (placeholder) | TBD      |

**Vendure Backend**: Port 3001 (Admin UI at `http://localhost:3001/admin`)

**CRITICAL SECURITY REQUIREMENT**: Customers on TOOLY must NEVER discover PEPTIDES exists. Complete isolation achieved through separate deployments and codebases.

### Multi-Brand Resolution (Within Each Store)

Each store maintains internal multi-brand support using:

#### Mode A (Production - Recommended)

- **BRAND_KEY** environment variable pins the brand
- Enables SSG/ISR for optimal performance
- One deployment per brand per store
- Best for SEO and performance

#### Mode B (Staging/Multi-domain)

- Host-based brand resolution
- SSR only (no SSG/ISR)
- Single deployment serving multiple domains
- For staging environments or demos

**CRITICAL**: NO cookie-based brand switching in production (kills SEO)

### Store Isolation Principles

#### Complete Code Isolation

- **NO shared UI components** between stores
- Each store has completely unique frontend code
- Store-specific brand configuration packages
- Independent deployment pipelines

#### Shared Infrastructure Only

- Vendure backend (multi-channel)
- API client package (channel-aware)
- Feature flags system
- Config packages (TypeScript, ESLint)

### Data Flow

1. **Web** (Next.js) → Resolves brand via store-specific brand-config
2. **Brand Runtime** → Determines brand by BRAND_KEY or host
3. **API Client** → Uses Apollo Client with channel-specific tokens
4. **Vendure** → Returns data through Shop API (public) or Admin API (authenticated)
5. **Feature Flags** → Controls feature availability using Edge Config or PostHog adapters

### Multi-Channel Architecture

Vendure is configured with multiple sales channels:

- **default**: Default channel
- **tooly**: Tool-focused products channel (shofar-store)
- **peptide**: Research peptides channel (pharma-store exclusive)
- **future**: Future products channel

Each channel has isolated: product catalogs, customer accounts, orders, cart sessions, permissions.

## Essential Commands

### Development

```bash
# Install dependencies
pnpm install

# Run specific store in dev mode (includes Vendure backend)
pnpm dev:shofar    # TOOLY store on :3000, Vendure on :3001
pnpm dev:pharma    # PEPTIDES store on :3002, Vendure on :3001
pnpm dev:faxas     # Fashion store on :3003, Vendure on :3001

# Run all stores simultaneously
pnpm dev:all-stores

# Run specific app directly
pnpm --filter @shofar/shofar-store dev
pnpm --filter @shofar/pharma-store dev
pnpm --filter @shofar/faxas-store dev
pnpm --filter @shofar/vendure dev

# Build all stores
pnpm build:stores

# Build specific store
pnpm --filter @shofar/shofar-store build

# Lint/typecheck
pnpm lint
pnpm --filter @shofar/shofar-store typecheck
pnpm --filter @shofar/vendure typecheck

# Format code
pnpm format
```

### Vendure-Specific Commands

```bash
# Initialize Vendure database with channels and seed data
pnpm --filter @shofar/vendure run setup

# Populate additional test data
pnpm --filter @shofar/vendure run populate

# Seed full TOOLY product catalog
pnpm --filter @shofar/vendure run seed:tooly

# Seed PEPTIDES catalog
pnpm --filter @shofar/vendure run seed:peptides

# Bulk attach assets to products
pnpm --filter @shofar/vendure run bulk:assets

# Run database migrations
pnpm --filter @shofar/vendure migrate
```

**Admin UI**: http://localhost:3001/admin (after starting Vendure)

### GraphQL Codegen

```bash
# Generate GraphQL types (requires Vendure running)
pnpm --filter @shofar/api-client codegen
pnpm --filter @shofar/api-client codegen:shop
pnpm --filter @shofar/api-client codegen:admin

# Watch mode for development
pnpm --filter @shofar/api-client codegen:watch
```

### Testing

```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Debug E2E tests
pnpm test:e2e:debug
```

### Git Workflow

```bash
# Commits must follow conventional format
# Format: type(scope): subject

# Types: feat, fix, docs, style, refactor, perf, test, chore, revert, ci, build

# Scopes: storefront, vendure, ui, api-client, feature-flags, config, deps, repo

# Examples:
git commit -m "feat(storefront): add product carousel component"
git commit -m "fix(vendure): resolve order calculation issue"
git commit -m "chore(deps): update dependencies"
```

## Technology Stack

### Stores (Next.js 16)

- **Framework**: Next.js 16.0.1 with App Router
- **React**: 19.2.0
- **Styling**: Tailwind CSS v4 with PostCSS
- **State**: Server Components + Client Components where needed

### Vendure Backend

- **Framework**: Vendure 3.1.1 (headless commerce on NestJS)
- **Database**: SQLite (dev) or PostgreSQL (prod) via `DB_TYPE` env
- **ORM**: TypeORM
- **API**: GraphQL (Shop & Admin)

### Shared Packages

- **api-client**: Apollo Client + GraphQL Codegen
- **feature-flags**: Adapter pattern (Edge Config, PostHog)
- **brand-config**: Per-store brand configuration

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - No implicit any, strict null checks
- **No unused variables** - Prefix with `_` if intentionally unused
- **Explicit return types** - Required for all functions
- **Type imports** - Use `import type` when importing only types

### React/Next.js

- **Functional components only** - No class components
- **Named exports** - Prefer named over default exports
- **Component files** - One component per file
- **Props interface** - Always define explicit Props interface
- **Event handlers** - Prefix with `handle` (e.g., `handleClick`)

### Import Order

1. Built-in Node modules
2. External packages
3. Internal packages (@shofar/\*)
4. Parent imports (../)
5. Sibling imports (./)
6. Style imports

## Accessibility (a11y) Rules

### Keyboard Navigation

- All interactive elements must have visible focus states
- Logical tab sequence, no positive tabindex
- Skip to main content link
- ESC key closes modals
- No keyboard traps

### Motion & Animation

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (`<nav>`, `<main>`, `<article>`, `<section>`)
- Buttons for actions, links for navigation
- Labels for all form inputs
- ARIA labels when visual labels aren't present

### Color & Contrast

- WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- Don't rely solely on color to convey information

## Performance Budgets

- **FCP** < 1.8s
- **LCP** < 2.5s
- **CLS** ≤ 0.02
- **TBT** < 200ms
- **Bundle**: main-route JS < 200 KB gzipped
- **API**: p95 < 500ms

## Environment Variables

### Storefront (.env.local)

```bash
NEXT_PUBLIC_VENDURE_SHOP_API_URL=http://localhost:3001/shop-api
NEXT_PUBLIC_POSTHOG_KEY=your-key-here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
EDGE_CONFIG=your-edge-config-url
BRAND_KEY=tooly  # Mode A production brand pinning
```

### Vendure (.env)

```bash
NODE_ENV=development
DB_TYPE=better-sqlite3  # or 'postgres' for production
DATABASE_URL=vendure-db.sqlite
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin123
COOKIE_SECRET=change-in-production
PORT=3001
```

### Default Credentials

- **Superadmin**: superadmin / superadmin123
- **Tooly Manager**: manager@tooly.com / manager123

## API Channel Headers

### TOOLY (shofar-store)

```typescript
headers: { 'vendure-token': 'tooly' }
```

### PEPTIDES (pharma-store)

```typescript
headers: { 'vendure-token': 'peptide' }
```

## Common Issues & Solutions

### Issue: Port already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID [PID]

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: GraphQL codegen fails

```bash
# Ensure Vendure is running first
pnpm --filter @shofar/vendure dev
# Then in another terminal
pnpm --filter @shofar/api-client codegen
```

### Issue: TypeScript errors in IDE

```bash
# Rebuild TS references
pnpm build
# Restart TS server in VSCode: Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

### Issue: Husky hooks not running

```bash
pnpm prepare
chmod +x .husky/*  # Make hooks executable (Unix)
```

## Agentic Coding Rules

### 1. Never Fabricate APIs

- Read existing code before implementing
- Check Vendure docs for GraphQL schema
- Verify Next.js API routes exist
- Test API calls with actual server running

### 2. Small Atomic Changes

- Each commit should pass all tests independently
- Be revertable without breaking the app
- Have a clear, single purpose

### 3. Security Rules

- No secrets in code - use environment variables
- Input validation on all user inputs
- XSS prevention - sanitize user content
- CORS configuration - explicitly configure allowed origins

### 4. Progress & Commit Protocol

- **Always start** with `git status` to check repo state
- **Never use** `--no-verify` — fix lint/typecheck errors instead
- **Commit after each milestone** — small, atomic, conventional commits
- **Update `<repo-root>/CHECKPOINT.md`** after each milestone with:
  - Date
  - What changed
  - Verification commands run
  - Commit SHA
- **Canonical progress log**: `CHECKPOINT.md` at repo root is the ONLY progress file

---

## Peptide Store Addendum (Append-Only)

This section documents pharma-store (PEPTIDES brand) specific requirements.

### Privacy & Cookie Policy

- **Cookie prefix**: Use `__Host-` prefix for all cookies
- **SameSite**: All cookies must be `SameSite=Strict`
- **No PII in logs**: Never log personally identifiable information
- **Separate analytics**: Use dedicated analytics property isolated from other stores

### Compliance Copy Requirements

**CRITICAL**: All product pages, checkout flows, and marketing materials must display:

```
"For Research Use Only / Not for human use."
```

**Prohibited content**: No health claims, medical claims, therapeutic claims, or dosage recommendations for human consumption.

### SEO Requirements

- **Dedicated routes**: `/products/[slug]` (PDP), `/research/[slug]` (Blog)
- **JSON-LD**: Implement `Product` schema for PDPs, `Article` schema for blog posts
- **Sitemap**: Auto-generated sitemap including all PDPs and blog articles
- **Canonical URLs**: Every page must have explicit canonical tag

### UI Isolation Enforcement

**CRITICAL**: pharma-store UI must remain completely isolated:

- NO shared components with shofar-store or faxas-store
- NO cross-store imports
- All UI lives in `apps/pharma-store/src/`
- Brand theming via `@shofar/pharma-brand-config` only
