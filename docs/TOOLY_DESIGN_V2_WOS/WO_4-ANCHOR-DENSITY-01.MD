WORK ORDER: WO-ANCHOR-DENSITY-01
TITLE: Dual Anchors + Short-Height Density Mode (Mobile “Best Viewing Angle”)

GOAL
Fix “landing in the wrong place” across phones by:
1) Implementing **dual anchors** for Product section:
   - `#product` = lands on section title (navigation intent)
   - `#product-buy` = lands on CTA/card (conversion intent)
2) Implementing a **Short-Height Density Mode** (CSS-only) so on short phones the Product section uses space better without harming normal/tall phones.
3) Update links:
   - Navbar “Shop” → `#product`
   - Hero primary CTA (“Shop Now”) → `#product-buy`

LOCKED CONSTRAINTS
- Do NOT reorder sections or change global section IDs other than adding new anchor targets.
- Desktop layout must remain visually unchanged.
- No Vendure schema changes.
- No changes to Reviews content (keep fake reviews).

SCOPE
apps/shofar-store only (TOOLY brand)

BRANCH
Create: `wo/anchor-density-01`

---

## Phase A — Dual Anchors for Product Section

### A1) Add anchor targets (no layout impact)
In the Product section (the section that renders “Choose Your TOOLY” and the product card), add **two invisible anchor markers**:

1) `#product` anchor marker should sit immediately before the section title (H2).
2) `#product-buy` anchor marker should sit immediately before the product card / Add to Cart area.

Implementation pattern (example):
```tsx
<span id="product" className="block scroll-mt-[var(--scroll-offset)]" />
<h2>Choose Your TOOLY</h2>

...

<span id="product-buy" className="block scroll-mt-[var(--scroll-offset)]" />
<div className="product-card">...</div>
Rules:

These markers must NOT affect spacing.

They must respect the global scroll offset variable.

A2) Update links to use the correct intent

Navbar “Shop” link should point to #product (title anchor)

Hero “Shop Now” should point to #product-buy (CTA anchor)
Keep all other links unchanged.

Phase B — Global scroll offset system (if not already correct)

Confirm --scroll-offset exists and is applied via:

html { scroll-padding-top: var(--scroll-offset); }

[id] { scroll-margin-top: var(--scroll-offset); }

If already implemented in WO-A11Y-SCROLL-01, do not rework it—only ensure the new anchor markers follow it.

Also ensure scroll-behavior: smooth is gated behind:
@media (prefers-reduced-motion: no-preference).

Phase C — Short-Height Density Mode (CSS-only, minimal)

Goal: on short-height phones, reduce vertical “wasted space” so more of the product card/CTA is visible.

C1) Define short-height breakpoint

In globals.css (or an appropriate global styles file), add:

A media query for short height, e.g.:

@media (max-height: 700px) {
  :root { --tooly-density: 1; }
}


Default:

:root { --tooly-density: 0; }

C2) Apply density tweaks ONLY to Product section spacing

Do NOT redesign. Only reduce padding/gaps on short-height screens.

Approach:

Add a class to the Product section wrapper, e.g. data-density="product" or className="tooly-product-section".

In CSS, target that wrapper in the short-height media query and reduce:

top padding

spacing between title/subtitle and card

card internal padding only if necessary

avoid changing fonts/sizes

Example:

@media (max-height: 700px) {
  .tooly-product-section {
    padding-top: 2.5rem !important;
    padding-bottom: 2.5rem !important;
  }
  .tooly-product-section .tooly-product-heading {
    margin-bottom: 1rem !important;
  }
}


Rule:

Only apply to Product section (do not globally shrink the entire page).

Verification (must do before commit)
1) Build
pnpm --filter @shofar/shofar-store build

2) Manual checks (mobile)

Test in devtools with these viewports:

Short phone: 390×667 (iPhone 8-ish)

Normal phone: 390×844 (modern iPhone)
Actions:

Navbar “Shop” → lands with “Choose Your TOOLY” title visible and not hidden.

Hero “Shop Now” → lands with product card and Add to Cart visible (best effort; must be significantly better than before).

Ensure page scroll still feels normal (no jank).

3) Puppeteer MCP (token-light)

Capture screenshots:

anchor-product-390x667.png (after clicking Navbar Shop)

anchor-buy-390x667.png (after clicking Hero Shop Now)

anchor-product-390x844.png

anchor-buy-390x844.png
Save locally and report file paths only.

Deliverables / Report

Claude must report:

What files changed

The two anchor markers added and where

The short-height density rules added (exact media query + targeted selectors)

Screenshot file paths

Build output summary

Commit (only after approval)

Commit message:
fix(web): WO-ANCHOR-DENSITY-01 dual anchors + short-height density mode

Update CHECKPOINT.md Design v2.0 tracker with:

WO-ANCHOR-DENSITY-01 → Done

commit hash

screenshots path list

STOP after commit. Do not start the next WO.