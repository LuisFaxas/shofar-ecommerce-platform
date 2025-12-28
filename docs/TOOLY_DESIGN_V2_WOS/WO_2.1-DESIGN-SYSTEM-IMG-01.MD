WO-DESIGN-SYSTEM-IMG-01 — Update /design-system to demo the real carousel + lightbox (no duplication)

Goal:
Add design-system demos for the new premium image experience so we can test/iterate quickly.
Must import and use the SAME production components (no copied logic).

Scope:
apps/shofar-store only.

Rules:
- Do not duplicate carousel/lightbox logic.
- Keep /design-system lightweight and clearly labeled “Demos”.
- No Vendure/network calls in design-system unless already mocked.

Tasks:
1) Update /design-system page to add a new section "Image Experience"
2) Add demos:
   A) Gallery Mobile Carousel demo (render the mobile carousel component or render GallerySection inside a constrained mobile frame)
   B) ProductCarousel demo (same as PDP carousel)
   C) Lightbox demo (button opens Lightbox with sample images)
3) Ensure demos work with prefers-reduced-motion.
4) Build passes.

Commit:
docs(web): add design-system demos for image experience components

Update CHECKPOINT.md tracker with WO-DESIGN-SYSTEM-IMG-01.
