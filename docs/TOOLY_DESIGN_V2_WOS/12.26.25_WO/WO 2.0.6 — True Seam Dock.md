# WO 2.0.6 — True Seam Dock (Thumbs in the Cut + Continuous Fade)

## Goal

Create the “true seam” design on **mobile** without breaking carousel logic:

1. Keep hero image size unchanged (no grid rows inside aspect ratio).
2. Thumbnails must live **in the seam between image and widget**, not on top of the image.
3. Seam must have a continuous hero-like gradient from image → widget surface (no hard line).
4. Preserve all interactions:
   - swipe updates `currentIndex`
   - active thumb highlight stays in sync
   - thumb tap scrolls to index
   - tap image opens lightbox at current index

## Scope

Modify ONLY:

- `apps/shofar-store/src/brands/tooly/components/ui/ProductCarousel.tsx`
- `apps/shofar-store/src/app/globals.css` (add seam gradient utility)

Do NOT modify:

- scroll container/ref logic
- `handleScroll` math
- `currentIndex` state logic
- split mobile/desktop into separate carousel trees

---

## Current Problem

Right now:

- scrim exists only _inside_ the image frame
- thumbs are absolutely positioned _inside_ the image frame
  That guarantees the “thumbs on image + hard edge below image” look.

---

## Implementation Plan

### Phase A — Wrap the image frame (clip only the image)

In `ProductCarousel.tsx`, introduce a 2-wrapper structure:

- **Outer wrapper**: `relative md:hidden overflow-visible`
- **Inner frame** (existing media frame): `relative rounded-xl overflow-hidden` keeps image clipped

IMPORTANT: The scroll container + slides remain inside the inner frame unchanged.

Pseudo-structure:

```tsx
{/* MOBILE */}
<div className="relative md:hidden overflow-visible">
  {/* INNER: clipped media frame (keeps image rounding) */}
  <div className={cn(
    "relative rounded-xl overflow-hidden",
    "bg-white/[0.04] border border-white/[0.08]",
    "tooly-product-media aspect-[3/4]" // whatever you currently use
  )}>
    {/* existing scroll container + slides — UNCHANGED */}
    ...
    {/* existing bottom scrim inside image — keep, maybe adjust height */}
    ...
  </div>

  {/* seam fade extender (outside the clipped frame) */}
  ...

  {/* thumbs positioned in the cut (outside the clipped frame) */}
  ...
</div>

Phase B — Add a seam fade extender (outside frame)

Add a new gradient that renders below the inner frame to remove the hard edge.

Place this as a sibling UNDER the inner frame inside the outer wrapper:

<div
  className="absolute inset-x-0 -bottom-6 h-20 md:hidden pointer-events-none"
  aria-hidden="true"
>
  <div className="absolute inset-0 tooly-media-seam" />
</div>

Notes:

    -bottom-6 pulls the fade down into widget area

    This is the “bridge” that makes the cut seamless.

Phase C — Move thumbs into the cut (NOT inside image)

Render thumbs as a sibling to the frame, positioned so they sit on the seam:

<div className="absolute left-4 right-4 bottom-0 translate-y-1/2 md:hidden pointer-events-none">
  <div className="flex gap-2 px-1 overflow-x-auto scrollbar-hide pointer-events-auto">
    {images.map((img, idx) => (
      <button
        key={img.id}
        onClick={(e) => {
          e.stopPropagation();
          scrollToIndex(idx);
        }}
        className={cn(
          "relative shrink-0 w-10 h-10 rounded-lg overflow-hidden",
          "border-2 transition-all duration-200",
          idx === currentIndex ? "border-[#02fcef]" : "border-white/20 hover:border-white/40",
          // OPTIONAL: subtle shadow to lift off seam
          "shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
        )}
        aria-label={`View image ${idx + 1}`}
      >
        <Image src={img.preview} alt="" fill className="object-cover" sizes="40px" />
      </button>
    ))}
  </div>
</div>

Key details:

    bottom-0 translate-y-1/2 puts thumbs half below the image frame (in the cut)

    thumbs are now not covering the hero image content area

    keep pointer-events pattern to avoid swipe interference

Phase D — Adjust spacing BELOW carousel (prevent collision)

Because thumbs now extend below the frame, we need a small spacing buffer so the purchase line doesn’t collide.

Cheapest + safest: add a mobile-only spacer inside ProductCarousel after the mobile wrapper:

{images.length > 1 && <div className="h-6 md:hidden" aria-hidden="true" />}

This reserves space for the “half thumb height” overlap.
Do NOT add more than needed.
Phase E — CSS for seam fade

In globals.css add:

/* WO 2.0.6 - Seam fade that bridges image -> widget */
.tooly-media-seam {
  background: linear-gradient(
    to bottom,
    rgba(11, 14, 20, 0) 0%,
    rgba(11, 14, 20, 0.55) 35%,
    rgba(11, 14, 20, 0.92) 75%,
    rgba(11, 14, 20, 1) 100%
  );
}

This must match the widget surface (#0b0e14).

Optional (only if needed to remove the “line”):

    on the inner frame, reduce bottom border visibility on mobile:

        keep full border on md+

        on mobile, use border-white/[0.06] or border-b-transparent

Acceptance Criteria

Mobile (390×844 and 390×667):

    Hero image remains full-size (no shrink).

    Thumbs visually sit in the seam cut (half below the frame).

    No hard line between image + widget (seam fade bridges).

    Swipe works normally.

    Active thumb highlight updates correctly while swiping.

    Thumb click scrolls to correct slide and updates highlight.

    Image tap opens lightbox at current index.

    Desktop unchanged.

Screenshots

    wo-2.0.6-seam-390x844.png

    wo-2.0.6-seam-390x667.png

Commit (after approval only)

feat(web): wo 2.0.6 true seam dock - thumbs in cut + continuous fade

    Keep carousel logic intact

    Move thumbs outside clipped frame into seam cut

    Add seam gradient extender bridging image -> widget

    Preserve swipe/index sync and lightbox behavior
```
