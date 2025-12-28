WORK ORDER: WO 2.0.4 — Product Header Layout Toggle (Classic vs Price-Inline)

GOAL
Reduce vertical space in the mobile product widget by optionally removing the “TOOLY + $109” header row and moving price inline with the variant selector row — WITHOUT losing clarity, and with a reversible toggle.

NON-GOALS

- No backend/Vendure changes.
- Do not touch media carousel behavior or lightbox.
- Desktop layout must remain unchanged.

SCOPE (allowed files)

- apps/shofar-store/src/brands/tooly/sections/ProductSection.tsx
- (optional) apps/shofar-store/src/brands/tooly/components/ui/ProductCard.tsx if the header lives there
- apps/shofar-store/src/app/design-system/page.tsx (demo toggle)

IMPLEMENTATION
A) Add a local layout mode switch (reversible)

- Introduce a variable like:
  const headerLayout: "classic" | "inline" = "inline";
- Keep it in code for now (later we can move to channel custom field if desired).

B) Implement BOTH layouts

1. Classic (existing):
   - Row: TOOLY (left) and price (right)

2. Inline (new):
   - Remove the TOOLY/price row entirely
   - Replace “Select Color — TOOLY - GOLD” with a compact row:
     - Left: “Color: GOLD” (or “Finish: GOLD”)
     - Right: “$109.00” (variant price)
   - Keep swatches below unchanged.

C) Explore a more graceful inline variant (optional)

- Inline v2: make the variant name a pill:
  - [ GOLD ] pill on left, $109 on right

D) Design-system demo

- Add a small toggle on /design-system to switch between the two header layouts so we can compare quickly without scrolling the homepage.

VERIFICATION

- pnpm --filter @shofar/shofar-store build
- Screenshots (real phone or puppeteer):
  - 390×844 product widget with classic layout
  - 390×844 product widget with inline layout
  - 390×667 product widget with inline layout
- Confirm:
  - Variant switching still updates price
  - Variant switching still updates images
  - Add to Cart remains visible more often

DO NOT COMMIT until user approval.

COMMIT (after approval)
feat(web): WO 2.0.4 product header layout toggle (classic vs inline)
Update CHECKPOINT.md with screenshots + decision notes.
