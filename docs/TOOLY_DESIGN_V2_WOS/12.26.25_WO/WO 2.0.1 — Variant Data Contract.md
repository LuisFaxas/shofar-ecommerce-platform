# WO 2.0.1 — Variant Data Contract (Variant-aware media + swatch visuals)

## Goal

Make the product widget **variant-correct**:

1. Selecting a variant updates the widget’s **active media set** (carousel + lightbox).
2. Swatches show real visuals (variant featured image if available; otherwise fallback).
3. Carousel resets to first image on variant change (no stale index).

## Scope (allowed files)

- `apps/shofar-store/src/brands/tooly/lib/fetchers.ts` (ONLY if needed to fetch missing fields)
- `packages/api-client/src/shop/*.graphql` (only the doc used by ProductSection)
- `apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx`
- `apps/shofar-store/src/brands/tooly/sections/ProductSection.tsx` (variant selection state + wiring)

## Non-goals

- No layout redesign yet.
- No new animations yet.
- No backend/Vendure schema changes.

## Required Data (ensure in query)

- `product.assets[] { id preview name }`
- `product.featuredAsset { id preview name }`
- `variants[] { id name options ... featuredAsset { ... } assets[] { ... } }`
- Any option/facet fields used to render the swatch label.

## Implementation

### A) Define media selection rule

Create a helper (local to ProductSection or a small util) that returns the media list for the selected variant:

- If selectedVariant has `assets.length > 0`:
  - Use `selectedVariant.assets`, and ensure `featuredAsset` is first if present.
- Else:
  - Fallback to `product.assets` (ensure product featured first).

### B) Variant selection

- Track selectedVariantId in ProductSection state.
- On selection:
  - setSelectedVariantId
  - reset carousel index to 0

### C) Swatch visuals

- Swatch image source priority:
  1. `variant.featuredAsset.preview`
  2. first `variant.assets[0].preview`
  3. fallback to a simple color dot (if you have a color value) or a neutral dot.

### D) Lightbox correctness

- Lightbox must open with the **same media list** that the carousel currently shows (variant-aware).
- When variant changes, lightbox uses updated list.

## Verification

- `pnpm --filter @shofar/shofar-store build`
- On the product widget:
  - switch variant A → images change
  - switch variant B → images change
  - swatches show correct visuals (no broken images)
  - carousel resets to first image on change

## Puppeteer screenshots (token-light)

- `wo-2.0.1-variant-a-390x844.png`
- `wo-2.0.1-variant-b-390x844.png`

## Commit

- `feat(web): WO 2.0.1 variant-aware product media + swatches`

## CHECKPOINT.md

- Add WO 2.0.1 row (Done + commit hash + verification + screenshot paths)
