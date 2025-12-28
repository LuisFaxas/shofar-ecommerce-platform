# WO 2.0.5 — Product Media Dock v2 + Purchase Line Polish (Cohesive Widget Pass)

## Goal

Make the mobile product widget feel like a premium “app screen”:

1. Remove the thumbnail dock **glass container** and replace it with a **scrim gradient** that blends into the widget background (hero-like fade).
2. Keep thumbnails overlayed **without intruding** on the product image.
3. Fix purchase line typography so it feels intentionally designed:
   - One line, never wraps
   - Consistent font sizing (no “random” scale differences)
   - Product name + selected variant label + price are clear
4. Fix variant label redundancy:
   - Never show `TOOLY` twice (e.g., “TOOLY — TOOLY GUNMETAL — $109.00” is invalid)
   - Strip product-name prefix from the selection label defensively (even if backend data regresses)

## Why This Approach (Design Rationale)

- UI controls over images should use a **scrim/gradient** to preserve legibility without blocking the image (common in modern mobile design). :contentReference[oaicite:4]{index=4}
- Use overlays that are localized (bottom scrim only) so the image remains “hero quality,” while controls stay readable.
- Ensure touch targets are large enough and not placed in unsafe areas. :contentReference[oaicite:6]{index=6}

## Scope / Guardrails

- Mobile-first changes must be `md:` gated (desktop behavior stays unchanged).
- No global utility overrides on generic classes.
- Owned classnames only (e.g., `.tooly-media-scrim`, `.tooly-purchase-line`).
- Do not commit until approval.

---

## Files To Modify

| File                                                                 | Change                                                             |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx | Replace glass dock with gradient scrim + “floating thumbs” overlay |
| apps/shofar-store/src/brands/tooly/sections/ProductSection.tsx       | Fix purchase line typography + robust variant label normalization  |
| apps/shofar-store/src/app/globals.css                                | Add owned scrim + micro-polish utilities (only if needed)          |
| apps/shofar-store/src/app/design-system/page.tsx                     | Update demo preview (if demo exists for this widget)               |

---

## Phase A — Product Media Dock v2 (Remove Glass Container)

### A1) Replace dock background with bottom scrim (mobile only)

**Current problem**

- The glass pill reads as a separate component and slightly “blocks” the image.

**New behavior**

- A subtle bottom scrim fades into the widget surface (hero-like).
- Thumbnails sit on top of the scrim (no big background container).

**Implementation sketch**
Inside each slide (mobile only):

- Add scrim layer (pointer-events none):
  - Positioned absolute bottom
  - Height ~ 88–120px (tune)
  - Gradient: transparent → widget surface tone
- Place thumbnail row on top (pointer-events auto)

Pseudo-structure:

```tsx
{/* Scrim (mobile only) */}
<div
  className="absolute inset-x-0 bottom-0 h-28 md:hidden pointer-events-none"
  aria-hidden="true"
>
  <div className="absolute inset-0 tooly-media-scrim" />
</div>

{/* Thumbs overlay (mobile only) */}
<div
  className="absolute left-4 right-4 bottom-4 md:hidden pointer-events-auto"
>
  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
    {/* thumb buttons */}
  </div>
</div>,

A2) Thumbnail buttons: less intrusive, still tappable

Use smaller visual footprint but keep tap target comfortable:

Button can be w-11 h-11 (comfortably tappable) while the visible image frame is smaller via padding.

Style suggestion:

No container background

Each thumb has its own subtle border + slight blur/backdrop if needed

Selected thumb: accent ring

A3) Remove dots entirely (mobile)

Dots are redundant once thumbs exist.

Optional replacement if you still want orientation:

A tiny “1/5” counter badge in a corner (like your Gallery pattern)

Phase B — Purchase Line Polish (One Cohesive Line, No Weird Typography)
B1) Normalize selection label (remove TOOLY redundancy)

We need a robust function that:

Prefers option value if present

Falls back to facet or variant.name

Then strips product name if it appears (case-insensitive), and trims separators

Example normalization:

"TOOLY Gunmetal" → "Gunmetal"

"TOOLY - GOLD" → "GOLD" (or "Gold" if you prefer title case)

"Tooly Gunmetal" → "Gunmetal"

Rule: product name must never be repeated in the middle lane.

B2) Typography rules

Current mismatch:

Price looks like a different “system” (bigger) vs name/variant label.

New spec (mobile)

Same font-size across the entire line for cohesion.

Use weight + opacity for hierarchy, not size.

Recommended:

Wrapper: flex items-center gap-2 whitespace-nowrap

Text size: text-sm for everything

Product name: text-white font-semibold

Variant label: text-white/60 font-medium truncate min-w-0

Price: text-white font-semibold tabular-nums (tabular keeps numbers stable)

This will still read premium but not chaotic.

B3) Optional “micro glass flare” behind the purchase line (tasteful)

If we want that extra “app” polish without adding height:

Add a very subtle background + hairline border only behind the purchase line:

bg-white/[0.03]

border border-white/[0.06]

backdrop-blur-sm (optional)

rounded-lg

Keep it thin and low contrast so it doesn’t look like a pill button.

This is optional—only do it if it improves cohesion after Phase A.

Acceptance Criteria
Visual (Mobile 390×844)

Product image remains tall/premium (portrait)

Thumbs overlay looks integrated, not like a separate chunky block

Purchase line reads cleanly:

TOOLY — Gunmetal — $109.00

No wrapping

Price and TOOLY feel like the same typographic system

Variant label never includes the product name redundantly

Visual (Mobile 390×667)

Dock does not consume too much image area

CTA remains reachable without “feels broken” scrolling

Purchase line still one line (variant truncates with ellipsis if needed)

Interaction

Thumbs are tappable (no accidental misses)

Tap main image opens lightbox at current index

Variant switching updates:

media

selection label

price

resets carousel index (already done previously)

Verification

Build:

pnpm --filter @shofar/shofar-store build

Manual:

Switch variants: verify media + label + price update

Confirm label normalization removes TOOLY prefix

Confirm thumbs overlay doesn’t block zoom affordance

Puppeteer Screenshots

wo-2.0.5-widget-390x844.png (main widget)

wo-2.0.5-widget-390x667.png (short phone)

wo-2.0.5-lightbox-390x844.png (lightbox open)

Commit Message (after approval)

feat(web): WO 2.0.5 product media dock v2 + purchase line polish

Replace thumbnail glass dock with gradient scrim overlay on media (mobile)

Make thumbs overlay unobtrusive + tappable

Unify purchase line typography (single-line, cohesive)

Normalize variant label to remove redundant product name

Desktop unchanged

STOP

After screenshots + report, stop and wait for approval before committing.
```
