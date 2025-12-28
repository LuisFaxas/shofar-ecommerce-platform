WORK ORDER: WO 2.0.6b — Final Carousel Polish (Thumbs Down + Small + Corner Fix)

GOAL
Finalize the ProductCarousel mobile layout with minimal changes:
1) Move image thumbnails from inside the image area to the “green space” directly below the image.
2) Make thumbnails smaller and less visually dominant.
3) Move the purchase/pricing row down slightly (small spacing tweak only).
4) Fix the left/right “corner/edge” artifacts indicated in the red boxes (no visible harsh edges).

CONSTRAINTS
- Do NOT change swipe logic, scroll container, handleScroll, currentIndex, or lightbox behavior.
- Do NOT introduce new layout systems (no grids, no new wrappers beyond what’s necessary).
- Desktop unchanged.
- This is the LAST change to the carousel.

FILES ALLOWED
- apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx
- apps/shofar-store/src/brands/tooly/sections/ProductSection.tsx (ONLY for a tiny spacing adjustment between carousel and purchase line if needed)

NO COMMIT until user approval.

---

## Phase A — Move thumbnails to green space (ProductCarousel.tsx)

Current:
- Thumbnails are positioned absolute near bottom of image area.

New:
- Thumbnails must render BELOW the image frame, centered in the green space.
- They should not overlap the photo.

Implementation:
1) Remove the absolute-positioned thumbnail block for mobile.
2) Render a new mobile thumbnail row AFTER the image frame:

- Use:
  - `mt-3` (tune), `flex`, `justify-center`
  - smaller size: `w-8 h-8` (or `w-9 h-9` max)
  - rounded: `rounded-md`
  - active state: thin cyan ring or border
  - inactive: subtle border-white/15

- Example target styling:
  - container: `md:hidden flex justify-center gap-2`
  - each thumb: `w-8 h-8 rounded-md overflow-hidden border`
  - active: `border-[#02fcef]`
  - inactive: `border-white/15`

3) Keep thumbs scrollable only if there are many images:
- If images <= 5: center, no scroll.
- If images > 5: allow horizontal scroll: `overflow-x-auto scrollbar-hide` and center-ish padding.

---

## Phase B — Remove scrim overlay (optional)
If the scrim is only needed for the old in-image thumb placement, remove it.
If it still improves image-to-widget transition, keep it but ensure it doesn’t create a hard edge.

---

## Phase C — Pricing row spacing nudge (ProductSection.tsx)
Goal: price line should sit slightly lower / breathe, but no big layout shift.

- Add a small top margin between carousel and purchase line:
  - e.g. `mt-2` or `mt-3` on the purchase line wrapper
- Keep it minimal. This is not a redesign.

---

## Phase D — Fix corner/edge artifacts (ProductCarousel.tsx)
In your second image, the left/right edges show harsh vertical bars/lines around the media frame.

Fix:
- Ensure the media frame wrapper clips cleanly:
  - `rounded-xl overflow-hidden`
- Ensure no inner element has its own background that creates edge bands.
- Remove any extra nested rounded containers that don’t match the outer radius.
- If there is a border + background causing a double-edge, soften:
  - border opacity down (white/0.06)
  - background consistent with widget surface
- Goal: the media frame looks like ONE clean rounded card, no side “pillars”.

---

## Verification
1) Build:
- pnpm --filter @shofar/shofar-store build

2) Mobile checks (390×844 + 390×667):
- Thumbnails appear in the green space under the image (not over the image).
- Thumbnails are noticeably smaller and unobtrusive.
- Swipe still works.
- Active thumbnail highlight updates correctly.
- Purchase line is slightly lower (minimal).
- The left/right edge artifacts are gone.

Screenshots required:
- wo-2.0.6b-390x844.png
- wo-2.0.6b-390x667.png

STOP after screenshots. No commit until approval.

---

## Commit (after approval)
fix(web): WO 2.0.6b final carousel polish (thumbs below image + corner fix)

Update CHECKPOINT.md with commit hash + screenshots.
