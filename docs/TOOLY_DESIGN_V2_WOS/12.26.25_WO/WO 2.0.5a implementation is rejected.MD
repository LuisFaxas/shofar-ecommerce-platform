STOP. Do not commit.

This WO 2.0.5a implementation is rejected:
- It shrinks the hero image by forcing a 2-zone grid inside a fixed aspect frame
- It broke swipe and thumbnail highlight sync
- It does not match the intended design

Do this now:

1) Revert ONLY ProductCarousel.tsx to last good state:
git checkout -- apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx
(or git restore ...)

2) Confirm interactions are back:
- swipe changes image
- currentIndex updates
- active thumbnail border updates
- image size returns to previous

3) Re-implement the “seam” concept WITHOUT changing the carousel structure:
- Do NOT convert to grid or split mobile/desktop into separate trees
- Keep the existing scroll container + handleScroll + currentIndex logic untouched

Seam design (visual seam, no structural seam):
- Add a bottom gradient scrim inside the media container:
  - absolute bottom-0 inset-x-0 h-28
  - gradient from transparent to widget surface color
- Render thumbnails positioned lower, on top of the scrim:
  - absolute bottom-3 left-4 right-4
  - NO large glass background
  - Thumbs smaller (w-10 h-10), unobtrusive
- Goal: the image remains big and swipe behavior stays perfect, while thumbs feel like they live in the transition zone.

After implementation:
- pnpm --filter @shofar/shofar-store build
- screenshots 390x844 + 390x667
- verify swipe + highlight works
NO COMMIT until I approve.
