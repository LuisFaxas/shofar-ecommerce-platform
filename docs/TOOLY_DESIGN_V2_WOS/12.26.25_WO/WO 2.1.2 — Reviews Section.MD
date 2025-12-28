# WO 2.1.2 — Reviews Section (Exact Design-System 3-Row Marquee, Mock Data)

## Goal
Implement the Reviews section on the TOOLY page using the **exact same 3-row marquee layout** from `/design-system` (no redesign, no “close enough”).  
Keep **mock data** for now, but structure it so we can swap in real data later.

## Scope / Files
- `apps/shofar-store/src/brands/tooly/sections/ReviewsSection.tsx`
- Reuse existing design-system marquee component(s) (e.g. `components/ui/ReviewsMarquee.tsx`) — do NOT duplicate logic.
- Update `/design-system` only if needed to ensure both pages share the same component.

## Hard Rules
- Must render **3 rows** of review cards (like design system).
- Must be **future-proof**: reviews are passed as data props (array), no hardcoding inside the marquee component.
- Must respect `prefers-reduced-motion` (disable animation / show static rows).
- Keep mock reviews for now.

## Implementation
1) Locate the exact 3-row Reviews implementation in `/design-system` and extract/reuse it:
   - Same component, same classes, same fade edges, same motion settings.
2) In TOOLY `ReviewsSection.tsx`:
   - import the same marquee component
   - provide `MOCK_REVIEWS: Review[]`
   - pass props to produce **3 rows** (same row directions/speeds as design system)
3) Ensure the component API is clean:
   - `reviews: Review[]`
   - `rows?: 3` (or equivalent)
   - optional config (speed/direction) but defaults should match design system.

## Verify
- `pnpm --filter @shofar/shofar-store build`
- Desktop: 3 marquee rows visible, fade edges correct, no jumpy loop
- Mobile: still 3 rows, readable
- Reduced motion: marquee stops / becomes static (no animation)

## Screenshots
- `wo-2.1.2-reviews-desktop.png`
- `wo-2.1.2-reviews-mobile.png`

## Commit (after approval)
`feat(web): WO 2.1.2 reviews section (design-system 3-row marquee, mock data)`
Update CHECKPOINT.md with commit + screenshots.
