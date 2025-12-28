WORK ORDER: WO 2.0.3 — Product Widget 2.0 Fit Pass (Glass Dock Thumbs + Compact Header)

GOAL
Make the product widget fit and feel “app-like” on mobile by:

1. Moving image thumbnails into a bottom “glass dock” overlay inside the media frame.
2. Removing the dots row (redundant once thumbs exist).
3. Condensing the product identity + price into a single compact header row inside the widget:
   - Left: TOOLY
   - Right: Variant price (already updates with variant selection)
4. Keep all variant pricing logic the same: price always reflects selected variant (no delta badges, no extra pricing text).

LOCKED CONSTRAINTS

- No backend/Vendure schema changes.
- No review section edits.
- Desktop must remain visually unchanged (mobile-only changes must be md: gated).
- Keep Lightbox behavior unchanged (tap image opens zoom).
- Do not change existing variant selection logic besides layout (variant price + images already update correctly).

SCOPE (allowed files)

- apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx
- apps/shofar-store/src/brands/tooly/sections/ProductSection.tsx
- (optional) apps/shofar-store/src/brands/tooly/components/ui/Lightbox.tsx (only if needed, prefer no changes)

BRANCH

- git checkout -b wo/2.0.3-product-widget-fit

---

## Phase A — ProductCarousel: Glass Dock thumbnails overlay + remove dots (mobile only)

### A1) Remove dots row (or hide on mobile)

- If dots exist as a row under the image: remove entirely OR set to md:block so they only appear on desktop if still desired.
- On mobile, dots should not take vertical space.

### A2) Move thumbnails into “glass dock” overlay inside media

- Thumbnails should overlay the bottom of the media container, not sit below it.

Implementation guidelines:

- Wrap the media stage in `relative`.
- Add a bottom overlay container:
  - `absolute left-3 right-3 bottom-3`
  - `bg-black/35 backdrop-blur-md border border-white/10 rounded-xl`
  - `p-2 flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide`
  - Ensure it does NOT block swipe of the main carousel (thumb strip should be its own scroll area).

Thumbnail sizing:

- Mobile thumbs should be compact: `w-10 h-10` or `w-11 h-11`
- Active thumb: cyan ring (keep your current selection border)
- Thumbs remain clickable.

Behavior:

- Clicking a thumb scrolls the carousel to that index.
- Swiping the main image updates the active thumb.

### A3) Keep zoom icon top-right (unchanged)

- Keep the subtle zoom icon top-right.
- Ensure it remains accessible and doesn’t overlap the dock.

Desktop:

- Keep existing desktop thumbnail layout as-is (or md+ still uses the old strip if that’s preferred).
- Dock overlay should be mobile-only (md:hidden).

---

## Phase B — ProductSection: Compact “TOOLY | Price” header lane (mobile)

### B1) Replace stacked “TOOLY” + “$109.00” with a single row

Inside the widget details area:

- Create a header row:
  - left: product name (TOOLY)
  - right: price (selected variant price, already computed)
- Use responsive typography:
  - product name: `text-xl font-semibold`
  - price: `text-3xl font-bold` (or slightly smaller on short phones)
- Avoid extra vertical margins.

### B2) Keep color selector but tighten spacing

- Keep “Select Color — TOOLY - GOLD” functionality, but tighten it:
  - Use `Color:` label + selected variant name (GOLD) as one line.
  - Variant swatches remain immediately below or inline if it fits.
- Do NOT introduce delta badges or extra pricing text.

### B3) Tighten vertical gaps (mobile only)

- Reduce spacing between:
  - header row
  - color selector
  - stock line
  - bullet list
- Do not reduce readability; just remove wasted padding.

---

## Verification (must do before commit)

1. Build:

- pnpm --filter @shofar/shofar-store build

2. Visual checks:

- Mobile 390×844 @ #product-buy:
  - Media is portrait, TOOLY looks premium
  - Thumbnails are inside media (glass dock)
  - No dots row consuming space
  - TOOLY + Price row looks clean
  - CTA visible
- Mobile 390×667 @ #product-buy:
  - CTA remains reachable (best effort)
  - Layout feels tighter, not cramped

3. Variant correctness regression test:

- Switching variants still updates:
  - price
  - media set
  - active swatch
- Lightbox opens with correct current media set.

Puppeteer screenshots (token-light, required):

- wo-2.0.3-390x844-buy.png
- wo-2.0.3-390x667-buy.png

STOP after screenshots. No commit until approval.

---

## Commit (after approval only)

feat(web): WO 2.0.3 product widget fit (glass dock thumbs + compact header)

Update CHECKPOINT.md:

- Mark WO 2.0.3 done
- Add commit hash + verification + screenshot paths
