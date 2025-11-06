# Web Frontend - Brand Resolution Infrastructure

This package provides the multi-tenant brand resolution infrastructure for the SHOFAR platform.
It does NOT contain brand-specific UI components - those are implemented separately per brand.

## Architecture Principle

After Work Order 2.2, this package maintains strict separation:
- **Infrastructure** (this package): Brand resolution, API integration, security
- **UI** (per-brand folders): Each brand has completely unique frontend

## Brand Resolution Modes

### Mode A: BRAND_KEY Environment Variable (Production)
```bash
# Pin to specific brand for production deployment
BRAND_KEY=tooly pnpm dev
```
- Enables SSG/ISR optimization
- One deployment per brand
- Best for SEO and performance

### Mode B: Host-based Resolution (Staging)
```bash
# Resolves brand based on request host
pnpm dev
```
- SSR only (no SSG/ISR)
- Single deployment, multiple domains
- For staging/demo environments

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with brand metadata
│   ├── page.tsx           # Home page with brand routing
│   └── api/               # API routes
│       └── test-brand/    # Brand resolution testing
├── brands/                # Brand-specific implementations
│   ├── tooly/            # TOOLY brand (WO4-8 will implement)
│   │   ├── components/   # Brand components (empty)
│   │   ├── sections/     # Page sections (empty)
│   │   ├── styles/       # Brand styles (empty)
│   │   └── index.tsx     # Minimal placeholder
│   └── peptides/         # PEPTIDES brand (future)
│       └── FUTURE_BRAND.md
├── components/           # Infrastructure components only
│   └── ErrorBoundary.tsx # Error handling (not UI)
├── lib/                  # Core infrastructure
│   └── brand-runtime.ts # Brand resolution logic
└── public/              # Static assets
    └── authorize-net/   # Payment security
        └── communicator.html
```

## Development

```bash
# Install dependencies
pnpm install

# Run default brand (TOOLY)
pnpm dev

# Run specific brand
BRAND_KEY=peptides pnpm dev

# Test brand resolution
curl http://localhost:3000/api/test-brand
```

## Security Features

- **NO production cookies** for brand switching (SEO killer)
- **JWT-signed cookies** for dev override only (when explicitly enabled)
- **Strict origin validation** for Authorize.Net (no wildcards)
- **Error boundaries** to prevent white screens

## Environment Variables

```bash
# Mode A - Pin brand for production
BRAND_KEY=tooly

# Mode B - Leave unset for host-based resolution

# Dev only - NEVER in production
ALLOW_BRAND_COOKIE_OVERRIDE=false
JWT_SECRET=your-secret-key

# API Configuration
NEXT_PUBLIC_VENDURE_API_URL=http://localhost:3001/shop-api
```

## Testing

The `/api/test-brand` endpoint shows current brand resolution:
```json
{
  "brand": "tooly",
  "mode": "BRAND_KEY",
  "host": "localhost:3000",
  "channelToken": "tooly"
}
```

## Important Notes

1. **This is infrastructure only** - No brand-specific UI components
2. **Each brand is unique** - No shared components between brands
3. **Production uses Mode A** - One deployment per brand with BRAND_KEY
4. **Never use cookies in production** - Kills SEO and caching

## Next Steps

- **Work Order 3**: Authorize.Net payment integration
- **Work Orders 4-8**: TOOLY brand implementation
- **Future**: PEPTIDES brand implementation

---

For more details, see:
- `/CHECKPOINT.md` - Work order completion status
- `/CLAUDE.md` - Developer guidance and patterns