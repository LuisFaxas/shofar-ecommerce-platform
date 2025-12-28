# WO 2.0.2 — Product Media Vertical Carousel (Portrait media + thumbs + zoom)

## Goal

Make TOOLY **shine** in the widget:

- Mobile media becomes portrait (vertical feel) and premium.
- Thumbnail navigation blends with the widget.
- Tap media opens lightbox (reuse existing Lightbox).
- No stretching; no “tiny product” look.

## Scope (allowed files)

- `apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx`
- `apps/shofar-store/src/brands/tooly/components/ui/Lightbox.tsx` (only if needed for variant media wiring)
- `apps/shofar-store/src/brands/tooly/sections/ProductSection.tsx` (only for layout sloting)

## Non-goals

- Do not change desktop layout behavior.
- No new backend/Vendure changes.
- Do not change reviews.

## Design Rules

- Mobile media aspect: prefer `aspect-[3/4]` or `aspect-[4/5]` (pick one and stick).
- Fit: `object-contain` on mobile if needed to avoid cropping the tool; if using contain, add subtle scale (1.05–1.12) and proper positioning.
- Thumbnails: horizontal snap strip (same pattern as trust badges).
- Zoom affordance: subtle top-right icon (not centered).

## Implementation

- Convert ProductCarousel mobile stage into a “poster media” presentation:
  - portrait stage, centered, minimal padding
- Add thumb strip on mobile (if currently missing or too small).
- Ensure tap on stage opens lightbox at current index.
- Ensure the carousel uses the **variant-aware media list** from WO 2.0.1.

## Verification

- `pnpm --filter @shofar/shofar-store build`
- Mobile 390×844:
  - tool is fully visible and feels large
  - thumbs work and match current image
  - tap opens lightbox
- Desktop unchanged.

## Puppeteer screenshots

- `wo-2.0.2-product-media-390x844.png`
- `wo-2.0.2-lightbox-390x844.png`

## Commit

- `feat(web): WO 2.0.2 product carousel vertical media + thumbs + zoom`

## CHECKPOINT.md

- Add WO 2.0.2 row (Done + commit hash + verification + screenshot paths)
