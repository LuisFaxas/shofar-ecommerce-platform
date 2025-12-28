# WO 2.1.1 — Engineered for Excellence (Mobile 3-Card Pager + ProductCarousel Dots)

## Goal

On mobile, convert the “Engineered for Excellence” section into a **2-page horizontal pager**:

- Page 1: 3 stacked cards
- Swipe left: Page 2: remaining 3 stacked cards
- Add dot indicator matching ProductCarousel dots

Desktop remains unchanged (grid).

## Non-goals

- Do not change the product widget.
- Do not change copy/claims in this WO.
- Do not introduce new libraries.

## Files

- apps/shofar-store/src/brands/tooly/sections/TechnologySection.tsx (or the section file that renders this area)
- apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx (READ ONLY for dot styling reference; do not modify unless absolutely necessary)
- (optional) extract a small shared dot component if you can do it safely, but prefer duplication of tiny classes to avoid refactors.

## Mobile UX Spec (must match)

1. Mobile renders a horizontal scroll container with scroll-snap:
   - Wrapper: `flex overflow-x-auto snap-x snap-mandatory scrollbar-hide`
   - Each page: `snap-center shrink-0 w-full`
2. Inside each page, render exactly **3 cards stacked vertically** with the same card styling as today.
3. Swipe must feel “native” (browser drag).
4. Dots:
   - Use the same dot look as ProductCarousel
   - Dots count = number of pages (should be 2 for 6 items)
   - Active dot updates on swipe

## Implementation Steps

### A) Split features into pages of 3

- const pages = chunkArray(features, 3)
- features length is 6 → pages length should be 2

### B) Desktop unchanged

- Keep existing desktop grid code (md+)
- Hide mobile pager on md+ (`md:hidden`)
- Hide desktop grid on mobile (`hidden md:grid`)

### C) Mobile pager

- Add `scrollRef` and track activeIndex using onScroll:
  - activeIndex = Math.round(scrollLeft / offsetWidth)
- Ensure the scroll container has `scroll-smooth` for dot clicks (if you implement dot click-to-scroll).

### D) Dot indicator (match ProductCarousel style)

- Copy the dot classes from ProductCarousel exactly (do not reinvent).
- Render dots below the pager:
  - `flex justify-center gap-2 mt-4`
- Clicking a dot scrolls to that page (optional but recommended).

## Verification

- pnpm --filter @shofar/shofar-store build
- Mobile 390×844:
  - Page 1 shows exactly 3 cards
  - Swipe left shows next 3 cards
  - Dots update correctly
- Mobile 390×667:
  - Still readable, no weird clipping
- Desktop:
  - Grid looks same as before

## Screenshots

- wo-2.1.1-tech-page1-390x844.png
- wo-2.1.1-tech-page2-390x844.png

## Commit (after approval)

feat(web): WO 2.1.1 tech section mobile pager (3-card pages + dots)

Update CHECKPOINT.md with:

- commit hash
- screenshots
- verification command
