# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## High-Level Architecture

### Monorepo Structure
This is a **Turborepo + pnpm** monorepo with strict TypeScript configuration. The architecture follows a clear separation between apps (deployable services) and packages (shared libraries).

### Multi-Tenant Architecture
The platform supports multiple brands (TOOLY, PEPTIDES) with SEO-safe, production-ready patterns:

#### Mode A (Production - Recommended)
- **BRAND_KEY** environment variable pins the brand
- Enables SSG/ISR for optimal performance
- One Vercel deployment per brand
- Best for SEO and performance

#### Mode B (Staging/Multi-domain)
- Host-based brand resolution
- SSR only (no SSG/ISR)
- Single deployment serving multiple domains
- For staging environments or demos

**CRITICAL**: NO cookie-based brand switching in production (kills SEO)

### Brand Architecture (CRITICAL - WO 2.2)

#### Each Brand is Unique
- **Brands DO NOT share UI components** - Complete frontend isolation
- Each brand has its own complete frontend in `/brands/[brand]/`
- Shared only: Vendure backend, utilities, infrastructure (brand resolution, API clients)
- NO shared layouts, components, or styles between brands

#### Current Brands
- **TOOLY**: Premium tool store (one-page experience planned)
- **PEPTIDES**: Future medical/research interface (placeholder)

#### Adding New Brand
1. Create `/brands/[newbrand]/` folder structure
2. Add brand config to `packages/brand-config/src/brands/`
3. Implement completely custom frontend (no shared UI)
4. Deploy with BRAND_KEY env var for production

#### Architecture Principle
After Work Order 2.2, the codebase maintains strict separation:
- **Infrastructure** (shared): Brand resolution, API, security, error handling
- **UI** (unique per brand): Components, layouts, styles, user experience

### Data Flow
1. **Web** (Next.js) → Resolves brand via **@shofar/brand-config**
2. **Brand Runtime** → Determines brand by BRAND_KEY or host
3. **API Client** → Uses Apollo Client with channel-specific tokens
4. **Vendure** → Returns data through Shop API (public) or Admin API (authenticated)
5. **Feature Flags** → Controls feature availability using Edge Config or PostHog adapters

### Package Dependencies
```
┌─────────────────────────────────────────────────┐
│                      Web                         │
│                  (Next.js App)                   │
└─────────┬──────────┬──────────┬─────────────────┘
          │          │          │
          ▼          ▼          ▼
    ┌─────────┐ ┌──────────┐ ┌──────────────┐
    │   UI    │ │API Client│ │Feature Flags │
    └─────────┘ └──────────┘ └──────────────┘
          │          │          │
          └──────────┴──────────┘
                     │
                     ▼
              ┌──────────┐
              │  Config  │
              └──────────┘
```

### Multi-Channel Architecture
Vendure is configured with multiple sales channels:
- **default**: Default channel
- **tooly**: Tool-focused products channel
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
│   ├── web/                # Next.js 14+ App Router, customer-facing
│   │   ├── src/
│   │   │   ├── app/       # App Router pages & layouts
│   │   │   ├── components/# React components
│   │   │   └── lib/       # Utility functions
│   │   └── public/        # Static assets
│   │
│   └── vendure/           # Vendure GraphQL commerce backend
│       ├── src/
│       │   ├── plugins/   # Custom Vendure plugins
│       │   └── index.ts   # Server entry point
│       └── static/        # Generated assets & emails
│
├── packages/
│   ├── ui/               # Shared glassmorphic components
│   │   └── src/
│   │       ├── components/# shadcn/ui + glass theme
│   │       └── lib/       # cn() utility
│   │
│   ├── api-client/       # GraphQL codegen & Apollo client
│   │   └── src/
│   │       ├── queries/   # GraphQL queries
│   │       ├── mutations/ # GraphQL mutations
│   │       └── generated/ # Auto-generated types
│   │
│   ├── brand-config/     # Multi-tenant brand configuration
│   │   └── src/
│   │       ├── brands/    # Brand-specific configs (tooly, peptides)
│   │       ├── types.ts   # BrandConfig, BrandKey types
│   │       └── index.ts   # Brand resolution functions
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

# Run all apps in dev mode (Next.js on :3000, Vendure on :3001)
pnpm dev

# Run specific app
pnpm --filter @shofar/web dev
pnpm --filter @shofar/vendure dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Type check all packages
pnpm --filter @shofar/web typecheck
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

# Run database migrations
pnpm --filter @shofar/vendure migrate

# Start production build
pnpm --filter @shofar/vendure start
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

### Brand Resolution Flow
```typescript
// apps/web/src/lib/brand-runtime.ts
1. Check BRAND_KEY env → Mode A (Production)
2. Check host header → Mode B (Staging)
3. Dev cookie override → ONLY if ALLOW_BRAND_COOKIE_OVERRIDE=true
4. Fallback to default brand (TOOLY)
```

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
- **@shofar/ui**: Radix UI primitives + Tailwind CSS
- Glassmorphic theme variants built into components
- Tree-shakeable exports for optimal bundle size

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
NEXT_PUBLIC_VENDURE_API_URL=http://localhost:3001/shop-api
NEXT_PUBLIC_POSTHOG_KEY=your-key-here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
EDGE_CONFIG=your-edge-config-url
```

### Vendure (.env)
```bash
NODE_ENV=development
DB_TYPE=better-sqlite3  # or 'postgres' for production
DATABASE_URL=vendure-db.sqlite  # or PostgreSQL connection string
SUPERADMIN_USERNAME=superadmin
SUPERADMIN_PASSWORD=superadmin123  # change in production
COOKIE_SECRET=change-in-production
PORT=3001
```

### Default Credentials
- **Superadmin**: superadmin / superadmin123
- **Tooly Manager**: manager@tooly.com / manager123

## Manual Test Steps Template

For each feature implementation, provide:

### Feature: [Feature Name]

**Setup:**
1. Ensure both servers are running (`pnpm dev`)
2. Clear browser cache and cookies
3. Open http://localhost:3000

**Test Steps:**
1. [Step 1 - User action]
   - Expected: [What should happen]
2. [Step 2 - User action]
   - Expected: [What should happen]
3. [Continue for all steps...]

**Accessibility Checks:**
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Focus indicators visible
- [ ] No color-only information
- [ ] Respects reduced motion preference

**Edge Cases:**
- [ ] Works with slow network (throttle to 3G)
- [ ] Handles errors gracefully
- [ ] Works on mobile viewport
- [ ] Functions with JavaScript disabled (if applicable)

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [All criteria that must pass]

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

## VSCode Recommended Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "graphql.vscode-graphql",
    "ms-playwright.playwright",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

## Deployment Checklist

- [ ] All environment variables set in production
- [ ] Database migrations run
- [ ] Static assets uploaded to CDN
- [ ] SSL certificates configured
- [ ] Rate limiting enabled
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured
- [ ] Feature flags reviewed
- [ ] Security headers configured
- [ ] Backup strategy in place

---

**Remember:** Always read existing code before implementing. Never guess or fabricate APIs. Provide complete context in diffs. Test everything manually before committing.