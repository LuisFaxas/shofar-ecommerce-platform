WORK ORDER: WO 2.0.5 — Product Media Dock v2 (Gradient dock + unobtrusive thumbs)

GOAL
Replace the intrusive “glass dock” behind product thumbnails with a premium gradient dock that blends seamlessly into the media (hero-style), while keeping the thumbnails functional and beautiful.

This WO is visual polish + layout refinement of the media controls only.

NON-GOALS

- No backend/Vendure changes.
- Do not change variant media logic (WO 2.0.1 stays).
- Do not change lightbox behavior.
- Desktop behavior unchanged unless explicitly improved in a safe way.

SCOPE (allowed files)

- apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx
- (optional) apps/shofar-store/src/app/globals.css ONLY if you define a reusable gradient token class (owned selector). Prefer inline Tailwind first.

DESIGN REQUIREMENTS

1. Remove the dock “card” background:
   - No rounded rectangle glass panel behind thumbnails.
   - No hard border around the dock.

2. Add a bottom gradient overlay inside the media container:
   - Must blend like the hero section
   - Should be subtle: it exists to support legibility and UI controls
   - Must not obscure the product too much

3. Thumbnails sit over the gradient, lower than current:
   - Thumbnails remain scrollable (scroll-snap)
   - Active thumb keeps cyan ring
   - Thumbs are slightly smaller than current if needed (space saving)
   - The dock should feel like part of the image, not a floating widget

4. Remove dots row (if still present) or ensure it’s not consuming vertical space

IMPLEMENTATION DETAIL (recommended structure)
Inside the media container (relative):

- Blurred backdrop layer (already in WO 2.0.2) stays mobile-only
- Main image stays
- Add gradient overlay layer:
  - absolute bottom-0 inset-x-0
  - h-20 to h-28 (tune)
  - bg-gradient-to-t from-black/70 via-black/20 to-transparent
  - pointer-events-none

Then thumbnails row:

- absolute bottom-3 left-3 right-3
- flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide
- no container background; only thumbs themselves have subtle styling:
  - rounded-lg
  - bg-black/20 OR nothing
  - active ring cyan

ZOOM ICON

- keep top-right icon as-is
- ensure it doesn’t conflict with gradient overlay

VERIFICATION

1. pnpm --filter @shofar/shofar-store build
2. Mobile screenshots (real iPhone or puppeteer):
   - wo-2.0.5-product-media-dock-390x844.png
   - wo-2.0.5-product-media-dock-390x667.png
3. Confirm:
   - Thumbs feel integrated, not intrusive
   - Image remains the star
   - Tap opens lightbox
   - Variant switch still updates images

NO COMMIT until user approval.
