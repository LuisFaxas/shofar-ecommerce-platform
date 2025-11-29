# Asset Pipeline Deployment Guide

This document covers deploying and managing the SHOFAR asset pipeline, including S3/R2 storage configuration, image optimization, and bulk asset imports.

## Table of Contents

1. [Overview](#overview)
2. [Storage Options](#storage-options)
3. [Environment Configuration](#environment-configuration)
4. [Bulk Asset Import](#bulk-asset-import)
5. [Next.js Image Optimization](#nextjs-image-optimization)
6. [Deployment Checklist](#deployment-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The SHOFAR platform supports multiple asset storage backends:

| Storage Type | Use Case | Configuration |
|--------------|----------|---------------|
| **Local** | Development | Default, no config needed |
| **AWS S3** | Production (AWS) | Full S3 credentials |
| **Cloudflare R2** | Production (R2) | S3-compatible endpoint |
| **MinIO** | Self-hosted | S3-compatible endpoint |

Assets flow through the system as follows:

```
Image Upload → Vendure AssetService → Storage Strategy → CDN/Local
     ↓
Next.js Image → Optimizes on-demand → Client
```

---

## Storage Options

### Local Storage (Development)

Default behavior. No configuration required.

```bash
# .env (or leave unset)
ASSET_STORAGE=local
```

Assets are stored in `apps/vendure/static/assets/` and served from `http://localhost:3001/assets/`.

### AWS S3

```bash
# apps/vendure/.env
ASSET_STORAGE=s3
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-secret-key

# Optional: Custom CDN domain
S3_PUBLIC_URL=https://cdn.yoursite.com
```

### Cloudflare R2

```bash
# apps/vendure/.env
ASSET_STORAGE=s3
AWS_S3_BUCKET=your-r2-bucket
AWS_S3_REGION=auto
AWS_S3_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
AWS_ACCESS_KEY_ID=your-r2-access-key
AWS_SECRET_ACCESS_KEY=your-r2-secret-key

# R2 custom domain
S3_PUBLIC_URL=https://assets.yoursite.com
```

### MinIO (Self-Hosted)

```bash
# apps/vendure/.env
ASSET_STORAGE=s3
AWS_S3_BUCKET=assets
AWS_S3_REGION=us-east-1
AWS_S3_ENDPOINT=http://minio.local:9000
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
S3_FORCE_PATH_STYLE=true
```

---

## Environment Configuration

### Vendure Backend (`apps/vendure/.env`)

```bash
# Storage Selection
ASSET_STORAGE=local  # 'local' | 's3'

# S3-Compatible Storage (when ASSET_STORAGE=s3)
AWS_S3_BUCKET=your-bucket
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Optional S3 Settings
AWS_S3_ENDPOINT=           # Custom endpoint for R2/MinIO
S3_PUBLIC_URL=             # Custom CDN domain
S3_FORCE_PATH_STYLE=false  # true for MinIO
```

### Storefront (`apps/shofar-store/.env`)

```bash
# Asset Host (where images are served from)
NEXT_PUBLIC_ASSET_HOST=localhost:3001

# Production example with R2
NEXT_PUBLIC_ASSET_HOST=assets.yoursite.com
```

---

## Bulk Asset Import

### Quick Start

1. Create the import folder structure:

```bash
apps/vendure/assets-import/
├── map.json
├── tooly-gunmetal.png
├── tooly-midnight.png
└── ... other images
```

2. Configure `map.json`:

```json
{
  "TOOLY-DLC-GM": "./assets-import/tooly-gunmetal.png",
  "TOOLY-CK-MD": "./assets-import/tooly-midnight.png",
  "TOOLY-CK-AR": "./assets-import/tooly-arctic.png",
  "ACC-CASE-VIAL": "./assets-import/case-vial.png"
}
```

3. Run the import:

```bash
pnpm --filter @shofar/vendure run bulk:assets
```

### Import Behavior

- **Idempotent**: Skips variants that already have a featured asset
- **Channel-scoped**: Operates in the 'tooly' channel
- **Product fallback**: Also assigns to parent product if product has no featured asset

### Supported Image Formats

- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

---

## Next.js Image Optimization

### Remote Patterns Configuration

The storefront is pre-configured with remote patterns for:

```typescript
// apps/shofar-store/next.config.ts
images: {
  remotePatterns: [
    // Local development
    { protocol: "http", hostname: "localhost", port: "3001" },

    // Production Vendure
    { protocol: "https", hostname: "api.yoursite.com" },

    // Cloudflare R2
    { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    { protocol: "https", hostname: "assets.yoursite.com" },

    // AWS S3
    { protocol: "https", hostname: "*.s3.amazonaws.com" },
    { protocol: "https", hostname: "*.s3.*.amazonaws.com" },
  ],
}
```

### Adding New Domains

If using a custom CDN domain, add it to the remote patterns:

```typescript
{
  protocol: "https",
  hostname: "cdn.yoursite.com",
  pathname: "/**",
}
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] S3/R2 bucket created with appropriate permissions
- [ ] CORS configured on bucket (if needed)
- [ ] Access keys generated and stored securely
- [ ] CDN domain configured (optional)

### Environment Variables

- [ ] `ASSET_STORAGE` set correctly
- [ ] All required S3 credentials in place
- [ ] `S3_PUBLIC_URL` set if using custom domain
- [ ] Storefront `NEXT_PUBLIC_ASSET_HOST` configured

### Testing

- [ ] Upload test image via Vendure Admin
- [ ] Verify image appears in S3/R2 bucket
- [ ] Verify image loads on storefront
- [ ] Verify Next.js image optimization works

### Post-Deployment

- [ ] Run bulk asset import if needed
- [ ] Verify all product images display correctly
- [ ] Check browser console for mixed content warnings
- [ ] Test on multiple devices/browsers

---

## Troubleshooting

### Images Not Loading

1. **Check CORS configuration** on S3/R2 bucket:

```json
{
  "AllowedOrigins": ["https://yoursite.com"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3600
}
```

2. **Verify remote patterns** in `next.config.ts` match your asset domain

3. **Check network tab** for 403/404 errors

### Bulk Import Fails

1. **SKU not found**: Verify SKU exists in the 'tooly' channel
2. **File not found**: Check file path is relative to project root
3. **Permission denied**: Ensure Vendure can read the import directory

### S3 Connection Issues

1. **Invalid credentials**: Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
2. **Wrong endpoint**: For R2/MinIO, ensure AWS_S3_ENDPOINT is set
3. **Wrong region**: R2 uses `auto`, S3 needs actual region

### Mixed Content Warnings

Ensure `S3_PUBLIC_URL` uses HTTPS:

```bash
# Wrong
S3_PUBLIC_URL=http://assets.yoursite.com

# Correct
S3_PUBLIC_URL=https://assets.yoursite.com
```

---

## Related Files

- `apps/vendure/src/config/s3-asset-storage.ts` - S3 storage strategy
- `apps/vendure/src/vendure-config.ts` - Vendure configuration
- `apps/vendure/src/cli/bulk-attach-assets.ts` - Bulk import CLI
- `apps/shofar-store/next.config.ts` - Next.js image configuration
- `packages/api-client/src/shop/tooly-*.graphql` - GraphQL queries for assets
