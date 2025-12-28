WORK ORDER: WO 2.0.5a — Seam Dock (Thumbnails in the Image→Widget Cut)

GOAL
Implement the thumbnail dock the way we intended:

- Thumbnails must NOT sit on top of the image.
- Thumbnails must live in a dedicated seam band BETWEEN the image and widget content.
- Create a true gradient transition from image → widget surface (hero-like).
- Keep overall widget height unchanged (do not make the widget taller).

SCOPE

- apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx only
- (optional) globals.css only for the scrim class, but prefer keeping the gradient inline if possible

DO NOT CHANGE

- Lightbox behavior
- Variant media logic
- Desktop behavior (mobile-only changes must be md: gated)

IMPLEMENTATION (mobile-only)
A) Replace current “floating thumbs over image” with a 2-zone media frame:

- Outer: rounded-xl overflow-hidden relative (this is the frame)
- Inside: grid with 2 rows:
  1. image area (flex-1)
  2. seam band (fixed height, e.g. h-16 or h-20)

B) Image area

- Image should fill the image area ONLY (not behind seam band)
- Keep zoom icon in top-right inside image area

C) Seam band (the cut)

- Background should match widget surface color (or subtle gradient)
- Place thumbnail row here (not on the image)
- Thumbnails still scroll horizontally and snap (same behavior)
- Remove big glass container; thumbs can have subtle individual styling only

D) Gradient seam overlay

- Add a gradient overlay that spans across the boundary:
  - It should start transparent over the image
  - Fade into the widget surface color as it reaches the seam band
- This overlay is pointer-events-none.

Suggested overlay:

- absolute inset-x-0 bottom-0
- height ~ 96px (covers bottom of image + top of seam band)
- bg-gradient-to-b from-transparent via-[#0b0e14]/60 to-[#0b0e14]

E) No dots row

- Dots are redundant (thumbs already indicate position). Remove dots entirely on mobile.

POINTER EVENTS

- The gradient overlay must be pointer-events-none
- The seam band thumbs must be pointer-events-auto
- Ensure the main carousel swipe still works normally

VERIFICATION

- 390×844: thumbnails are clearly below the image (in the cut), image unobstructed
- 390×667: same, and widget height did not increase
- Tap image opens lightbox, thumbs still switch images

SCREENSHOTS REQUIRED (no commit until approval)

- wo-2.0.5a-seam-390x844.png
- wo-2.0.5a-seam-390x667.png

IMPORTANT, COMMIT AND PUSH WHEN YOURE DONE, I WILL BE STEPPING OUT AND I WANT TO SEE THE RESULTS WHEN THEY ARE DONE.
