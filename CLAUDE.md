# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-Level Architecture

### Monorepo Structure
This is a **Turborepo + pnpm** monorepo with strict TypeScript configuration. The architecture follows **ISOLATED STORE ARCHITECTURE** with complete separation between business categories.

### Isolated Store Architecture (CRITICAL)

#### Three Completely Isolated Stores
The platform consists of THREE independent Next.js applications, each serving a distinct business category:

| Store | Package | Port | Business | Brands |
|-------|---------|------|----------|--------|
| shofar-store | `@shofar/shofar-store` | 3000 | Tools & Hardware | TOOLY |
| pharma-store | `@shofar/pharma-store` | 3002 | Medical & Research | PEPTIDES |
| faxas-store | `@shofar/faxas-store` | 3003 | Fashion (placeholder) | TBD |

**Vendure Backend**: Port 3001 (Admin UI at `http://localhost:3001/admin`)

**CRITICAL SECURITY REQUIREMENT**: Customers on TOOLY must NEVER discover PEPTIDES exists. Complete isolation achieved.

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

#### Adding New Brands
1. Identify the business category (tools/pharma/fashion)
2. Add brand to appropriate store's brand-config package
3. Implement brand-specific UI in that store only
4. Deploy with BRAND_KEY env var for production

### Data Flow
1. **Web** (Next.js) → Resolves brand via **@shofar/brand-config**
2. **Brand Runtime** → Determines brand by BRAND_KEY or host
3. **API Client** → Uses Apollo Client with channel-specific tokens
4. **Vendure** → Returns data through Shop API (public) or Admin API (authenticated)
5. **Feature Flags** → Controls feature availability using Edge Config or PostHog adapters

### Package Dependencies
```
┌──────────────────┬──────────────────┬──────────────────┐
│  SHOFAR-STORE    │  PHARMA-STORE    │  FAXAS-STORE     │
│  (Next.js App)   │  (Next.js App)   │  (Next.js App)   │
└────────┬─────────┴────────┬─────────┴────────┬─────────┘
         │                  │                   │
         ▼                  ▼                   ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ shofar-brand-  │ │ pharma-brand-  │ │ faxas-brand-   │
│    config      │ │    config      │ │    config      │
└────────────────┘ └────────────────┘ └────────────────┘
         │                  │                   │
         └──────────────────┼───────────────────┘
                           │
              ┌────────────┴────────────┐
              │   Shared Packages:      │
              │  - api-client           │
              │  - feature-flags        │
              │  - config               │
              └─────────────────────────┘
```

### Multi-Channel Architecture
Vendure is configured with multiple sales channels:
- **default**: Default channel
- **tooly**: Tool-focused products channel
- **peptide**: Research peptides channel (pharma-store exclusive)
- **future**: Future products channel

Each channel has isolated:
- Product catalogs
- Customer accounts
- Orders and cart sessions
- Permissions and roles

## Repository Map

```
SOURCE_CODE/
├── apps/
│   ├── shofar-store/      # Tools & Hardware Store (Next.js 16)
│   │   ├── src/
│   │   │   ├── app/       # App Router pages & layouts
│   │   │   ├── brands/    # Brand-specific UI (tooly/)
│   │   │   ├── components/# Store-specific components
│   │   │   └── lib/       # Store runtime & utilities
│   │   └── public/        # Static assets
│   │
│   ├── pharma-store/      # Medical & Research Store (Next.js 16)
│   │   ├── src/
│   │   │   ├── app/       # App Router pages & layouts
│   │   │   ├── brands/    # Brand-specific UI (peptides/)
│   │   │   ├── components/# Store-specific components
│   │   │   └── lib/       # Store runtime & utilities
│   │   └── public/        # Static assets
│   │
│   ├── faxas-store/       # Fashion Store Placeholder (Next.js 16)
│   │   ├── src/
│   │   │   ├── app/       # App Router pages & layouts
│   │   │   └── lib/       # Store runtime & utilities
│   │   └── public/        # Static assets
│   │
│   └── vendure/           # Vendure GraphQL commerce backend
│       ├── src/
│       │   ├── plugins/   # Custom Vendure plugins
│       │   └── index.ts   # Server entry point
│       └── static/        # Generated assets & emails
│
├── packages/
│   ├── shofar-brand-config/  # Tools store brand configuration
│   │   └── src/
│   │       ├── brands/    # TOOLY config
│   │       ├── types.ts   # BrandConfig, BrandKey types
│   │       └── index.ts   # Brand resolution functions
│   │
│   ├── pharma-brand-config/  # Pharma store brand configuration
│   │   └── src/
│   │       ├── brands/    # PEPTIDES config
│   │       ├── types.ts   # BrandConfig, BrandKey types
│   │       └── index.ts   # Brand resolution functions
│   │
│   ├── faxas-brand-config/   # Fashion store brand configuration (empty)
│   │   └── src/
│   │       ├── types.ts   # BrandConfig, BrandKey types
│   │       └── index.ts   # Brand resolution functions (placeholder)
│   │
│   ├── api-client/       # GraphQL codegen & Apollo client
│   │   └── src/
│   │       ├── queries/   # GraphQL queries
│   │       ├── mutations/ # GraphQL mutations
│   │       └── generated/ # Auto-generated types
│   │
│   ├── feature-flags/    # Feature flag system
│   │   └── src/
│   │       └── adapters/  # Edge Config & PostHog
│   │
│   └── config/           # Shared configs
│       ├── typescript/   # TS configs (base, node, nextjs)
│       ├── eslint/       # ESLint configs
│       └── prettier/     # Prettier config
│
├── e2e/                  # Playwright E2E tests
├── turbo.json           # Turborepo pipeline config
├── pnpm-workspace.yaml  # Monorepo workspace definition
└── playwright.config.ts # E2E test configuration
```

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

# Lint all packages
pnpm lint

# Type check all packages
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

# Bulk attach assets to products
pnpm --filter @shofar/vendure run bulk:assets

# Run database migrations
pnpm --filter @shofar/vendure migrate

# Start production build
pnpm --filter @shofar/vendure start
```

**Admin UI**: http://localhost:3001/admin (after starting Vendure)

### Testing
```bash
# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Debug E2E tests
pnpm test:e2e:debug
```

### GraphQL Codegen
```bash
# Generate GraphQL types (run from api-client package)
pnpm --filter @shofar/api-client codegen

# Watch mode for development
pnpm --filter @shofar/api-client codegen:watch
```

### Git Workflow
```bash
# Commits must follow conventional format
# Format: type(scope): subject
# Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build
# Scopes: storefront, vendure, ui, api-client, feature-flags, config, deps, repo

# Examples:
git commit -m "feat(storefront): add product carousel component"
git commit -m "fix(vendure): resolve order calculation issue"
git commit -m "chore(deps): update dependencies"
```

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** - No implicit any, strict null checks
- **No unused variables** - Prefix with `_` if intentionally unused
- **Explicit return types** - Required for all functions
- **Type imports** - Use `import type` when importing only types
- **Index access** - Use `noUncheckedIndexedAccess` for safer array/object access

### React/Next.js
- **Functional components only** - No class components
- **Named exports** - Prefer named over default exports
- **Component files** - One component per file
- **Props interface** - Always define explicit Props interface
- **Event handlers** - Prefix with `handle` (e.g., `handleClick`)

### Import Order
1. Built-in Node modules
2. External packages
3. Internal packages (@shofar/*)
4. Parent imports (../)
5. Sibling imports (./)
6. Style imports

## Accessibility (a11y) Rules

### Keyboard Navigation
- **Focus indicators** - All interactive elements must have visible focus states
- **Tab order** - Logical tab sequence, no positive tabindex
- **Skip links** - Provide skip to main content link
- **Keyboard traps** - No keyboard traps, ESC key closes modals
- **Shortcuts** - Document all keyboard shortcuts

### Motion & Animation
```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
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
- Test with color blindness simulators

### Screen Readers
- Alt text for informative images
- Decorative images: `alt=""` or `aria-hidden="true"`
- ARIA live regions for dynamic content
- Meaningful link text (not "click here")

## Brand Resolution & Multi-Tenant Setup

### Brand Resolution Flow (Per Store)
```typescript
// apps/[store-name]/src/lib/store-runtime.ts
1. Check BRAND_KEY env → Mode A (Production)
2. Check host header → Mode B (Staging)
3. Dev cookie override → ONLY if ALLOW_BRAND_COOKIE_OVERRIDE=true
4. Fallback to default brand for that store
```

Example for each store:
- **shofar-store**: Resolves TOOLY or future tool brands
- **pharma-store**: Resolves PEPTIDES or future pharma brands
- **faxas-store**: Will resolve future fashion brands

### Environment Variables for Brands
```bash
# Mode A - Pin brand for production
BRAND_KEY=tooly  # or 'peptides'

# Mode B - Host-based resolution
# Leave BRAND_KEY unset

# Dev only - NEVER in production
ALLOW_BRAND_COOKIE_OVERRIDE=false
JWT_SECRET=your-secret-key
```

### Monitoring Hooks
Unknown hosts are logged for monitoring:
- Check middleware.ts for unknown host detection
- In production, send to monitoring service (Sentry, DataDog, etc.)
- Helps identify misconfigurations or new domain requirements

### Cache Headers Strategy
```javascript
// next.config.mjs
- Static assets: max-age=31536000, immutable (1 year)
- Images: max-age=31536000, must-revalidate
- API responses: Controlled by Vendure
```

### Security Considerations

#### Authorize.Net Integration
- **NO wildcard origins** in communicator.html
- Explicit domain allowlist only
- Strict postMessage validation
- Frame-ancestors CSP for payment iframe

#### Asset Security
- S3/R2 with signed URLs for private assets
- CDN with proper CORS headers
- Image optimization through Next.js Image component

## Key Architectural Decisions

### Database Strategy
- **Development**: SQLite (`better-sqlite3`) for zero-config local development
- **Production**: PostgreSQL via `DB_TYPE` environment variable
- **Migrations**: Handled by Vendure's built-in migration system

### GraphQL Client Architecture
The `@shofar/api-client` package uses a factory pattern:
```typescript
// Usage in components
import { getClient } from '@shofar/api-client';

const client = getClient('tooly'); // Channel-specific client
const { data } = await client.shop.query(GET_PRODUCTS);
```

### Feature Flag System
Adapter-based architecture in `@shofar/feature-flags`:
- **Edge Config**: For static flags cached at edge
- **PostHog**: For dynamic user-based flags
- Switchable via configuration without code changes

### Component Library Strategy
- **NO shared UI components** between stores (enforced isolation)
- Each store implements its own UI with Tailwind CSS v4
- Store-specific component libraries within each app
- Complete UI independence between business categories

## Agentic Coding Rules

### 1. Plan → Implement → Test Cycle

#### Planning Phase
- Break down tasks into atomic, testable units
- Create bullet-point implementation plan
- Identify dependencies and potential blockers
- Consider edge cases and error handling

#### Implementation Phase
- Small, focused commits (one logical change per commit)
- Write tests alongside implementation
- Document complex logic with comments
- Keep PRs under 200 lines when possible

#### Testing Phase
- Manual test steps provided for each feature
- Acceptance criteria clearly defined
- E2E tests for critical user paths
- Unit tests for business logic

### 2. API & Integration Rules

**NEVER fabricate APIs or endpoints**
- Read existing code before implementing
- Check Vendure docs for GraphQL schema
- Verify Next.js API routes exist
- Test API calls with actual server running

**If something is missing:**
1. Create it explicitly with full implementation
2. Document the new API/endpoint
3. Add types/schema definitions
4. Write tests for new endpoints

### 3. Small Atomic Changes

**Each commit should:**
- Pass all tests independently
- Be revertable without breaking the app
- Have a clear, single purpose
- Include related test updates

**Diff guidelines:**
- Show complete file paths
- Include full context (not just changed lines)
- Highlight breaking changes
- Document migration steps if needed

### 4. Performance Considerations

- **No layout shift** - Define dimensions for images/dynamic content
- **Lazy loading** - Use Next.js Image component, dynamic imports
- **Bundle size** - Monitor with `next-bundle-analyzer`
- **Caching** - Utilize Next.js caching strategies

### 5. Security Rules

- **No secrets in code** - Use environment variables
- **Input validation** - Validate all user inputs
- **SQL injection** - Use parameterized queries (Vendure handles this)
- **XSS prevention** - Sanitize user content
- **CORS configuration** - Explicitly configure allowed origins

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
DATABASE_URL=vendure-db.sqlite  # or PostgreSQL connection string
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin123
COOKIE_SECRET=change-in-production
PORT=3001
```

### Default Credentials
- **Superadmin**: superadmin / superadmin123
- **Tooly Manager**: manager@tooly.com / manager123

## Common Issues & Solutions

### Issue: Port already in use
```bash
# Kill process on port (Windows)
netstat -ano | findstr :3000    # Find PID
taskkill /F /PID [PID]          # Kill process

# Kill process on port (Mac/Linux)
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
# Restart TS server in VSCode
Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

### Issue: Husky hooks not running
```bash
# Reinstall husky
pnpm prepare
chmod +x .husky/*  # Make hooks executable
```

---

**Remember:** Always read existing code before implementing. Never guess or fabricate APIs. Test everything manually before committing.

---

## Peptide Store Addendum (Append-Only)

This section documents pharma-store (PEPTIDES brand) specific requirements. These constraints are **mandatory** for all pharma-store development.

### API Channel Header Requirement
All Shop API calls from pharma-store **must** include the channel header:
```typescript
// Required header for all pharma-store API requests
headers: {
  'vendure-token': 'peptide'
}
```

### Privacy & Cookie Policy
- **Cookie prefix**: Use `__Host-` prefix for all cookies (e.g., `__Host-session`)
- **SameSite**: All cookies must be `SameSite=Strict`
- **No PII in logs**: Never log personally identifiable information
- **Separate analytics**: Use dedicated analytics property isolated from other stores

### Compliance Copy Requirements
**CRITICAL**: All product pages, checkout flows, and marketing materials must display:
```
"For Research Use Only / Not for human use."
```

**Prohibited content**:
- No health claims
- No medical claims
- No therapeutic claims
- No dosage recommendations for human consumption

### Blog ↔ PDP Cross-Links
Blog articles and Product Detail Pages are linked via metadata:
```typescript
// Product custom field
peptideSlugs: string[]  // Related blog article slugs

// Blog frontmatter
relatedPeptides: string[]  // Related product slugs
```

### Search Implementation (v1)
- **Synonyms**: Map common alternate names (e.g., "BPC-157" ↔ "Body Protection Compound")
- **Fuzzy matching**: Tolerate typos in peptide names
- **Goal facets**: Filter by research goals/categories
- **Semantic search**: Optional future enhancement (not v1)

### Catalog View Modes
| View | Description | Default |
|------|-------------|---------|
| Thumbnail | Grid of product cards | ✓ |
| Detail | Content-style expanded cards | |
| Quick View | Modal overlay (links to canonical PDP) | |

**Note**: Quick View modal must link to canonical PDP page (no in-modal checkout).

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