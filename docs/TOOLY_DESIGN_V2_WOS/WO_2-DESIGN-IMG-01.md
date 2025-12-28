WORK ORDER: WO-DESIGN-IMG-01
TITLE: Image Experience v2.0 (mobile gallery carousel + shared lightbox)

GOAL
Upgrade perceived quality and UX by implementing a premium image experience:

- Mobile gallery must not be tiny thumbnails; it should feel like a real gallery.
- Add fullscreen lightbox for BOTH:
  1. GallerySection images
  2. ProductCarousel images
- Add a clear zoom affordance (zoom-in cursor on desktop, icon overlay).
- Add lazy loading for non-priority gallery images.

LOCKED CONSTRAINTS (DO NOT VIOLATE)

- Section order and IDs must remain unchanged.
- Desktop layout (grid + featured tile) must remain visually the same.
- No backend/Vendure schema changes in this WO.

SCOPE
apps/shofar-store only (TOOLY brand)

IMPLEMENTATION PLAN
A) Add a shared Lightbox component

- Create a reusable Lightbox modal (use existing Dialog primitive if available).
- Requirements:
  - Accept an array of images {src, alt, label?}
  - Open at a given index
  - Next/Prev controls + keyboard support
  - Close button
  - Touch swipe for next/prev (minimal; ok to implement simple pointer events)
  - Respect prefers-reduced-motion (no heavy animations if reduced)

B) ProductCarousel improvements

- Remove/reduce the `p-4` padding on mobile so the product photo is not tiny.
- Add onClick to open Lightbox at the current slide.
- Add zoom icon overlay + cursor `zoom-in` on desktop hover.
- Keep existing navigation intact.

C) GallerySection improvements (mobile-first)

- Desktop: keep the existing grid unchanged.
- Mobile (md below):
  - Replace the static 2-col grid with:
    - A large main image (full width, ~4:3 or similar)
    - A small horizontally-scrollable thumbnail strip (touch friendly)
    - Dots indicator optional
  - Tap main image to open Lightbox (starting at active image)
- If there are >6 images total:
  - Keep showing first 6 in desktop grid
  - Add a “View all (N)” affordance that opens the Lightbox with ALL images
  - Do not change section order or headings.

D) Lazy loading

- Ensure only the first, above-the-fold hero/product image is priority.
- Gallery images beyond the first visible tile should be lazy-loaded.

FILES TO INSPECT / LIKELY EDIT

- src/brands/tooly/sections/GallerySection.tsx
- src/brands/tooly/components/ui/ProductCarousel.tsx
- src/brands/tooly/components/ui/Dialog.tsx (or modal primitive)
- Add new: src/brands/tooly/components/ui/Lightbox.tsx (or similar)

VERIFICATION

1. pnpm --filter @shofar/shofar-store build
2. Manual quick check:
   - Desktop: gallery grid looks the same; hover effects still ok.
   - Mobile: gallery is now large + swipeable + has thumbnail strip.
   - Product: image looks larger on mobile; tap opens lightbox.
3. Puppeteer MCP (token-light):
   - Capture screenshots:
     - home-desktop.png (1440x900)
     - home-mobile.png (393x852)
     - lightbox-mobile.png (lightbox open)
   - Save screenshots locally; do NOT embed base64 into chat.

COMMIT
feat(web): WO-DESIGN-IMG-01 premium image experience (gallery+product lightbox)

CHECKPOINT
Update CHECKPOINT.md:

- Add WO-DESIGN-IMG-01 = Done + commit hash + 1-line summary

OUTPUT FORMAT

1. Summary (what changed + why)
2. Files changed
3. Commands run
4. Screenshot file paths
5. Commit hash
