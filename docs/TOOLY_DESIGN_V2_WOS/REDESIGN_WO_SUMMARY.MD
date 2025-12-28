WO-MOBILE-NAV-ARROW-01

Title: Mobile “Next Section” Floating Arrow Navigation
Goal: Add a sleek floating arrow that always sits above the iPhone home indicator and moves the user to the next major section (“screen”), so the site feels app-like.

Constraints

Mobile only (md:hidden)

Must not break existing scroll or keyboard navigation

Must respect prefers-reduced-motion

No backend changes

No section reorder

Implementation

Create component:
apps/shofar-store/src/brands/tooly/components/ui/SectionNavArrow.tsx

Takes ordered section IDs (example):
["hero", "technology", "gallery", "product", "reviews", "faq"]
(only include IDs that actually exist)

Uses IntersectionObserver to detect “current section”

On click: document.getElementById(nextId)?.scrollIntoView({ behavior })

behavior = "smooth" unless reduced motion

Mount it once at the page level (Tooly brand entry):
apps/shofar-store/src/brands/tooly/index.tsx

Render <SectionNavArrow /> near the end so it overlays everything

Styling requirements

Fixed bottom center:

bottom: calc(12px + env(safe-area-inset-bottom))

Glass style consistent with TOOLY:

subtle border, blur, dark translucent background

Hit target >= 44px

Optional: show a tiny “down chevron” and rotate to “up” at last section (scroll to top)

Verification

Viewport 390×844: arrow visible, doesn’t cover important CTAs

Viewport 390×667: arrow still visible and usable

Clicking advances section-by-section

With keyboard tab: arrow is focusable and has aria-label="Next section"

Puppeteer screenshots

mobile-nav-arrow-hero-390x844.png

mobile-nav-arrow-tech-390x667.png

Build

pnpm --filter @shofar/shofar-store build

Commit

feat(web): WO-MOBILE-NAV-ARROW-01 floating next-section arrow

Stop

Update CHECKPOINT.md tracker and stop.

WO-TECH-PAGER-01

Title: Technology section becomes a paged carousel on mobile
Goal: “Engineered for Excellence” should feel like one clean screen: show 3 feature cards, swipe horizontally to the next 3.

Constraints

Desktop layout unchanged

Must use the established scroll-snap pattern (no new libraries)

Keep typography consistent

Files

apps/shofar-store/src/brands/tooly/sections/TechnologySection.tsx

(Optional demo) apps/shofar-store/src/app/design-system/page.tsx

Implementation

Mobile only:

Chunk features array into groups of 3

Render a full-width scroll-snap track:

container: flex overflow-x-auto snap-x snap-mandatory scrollbar-hide

page: w-full shrink-0 snap-center

Each page: vertical stack of 3 cards, sized to fit viewport better

Add small page indicator (dots or “1/2”) consistent with Gallery counter

Verification

390×844: header + 3 cards visible without feeling cut

Swipe follows finger and snaps

390×667: still usable; if needed, reduce padding only inside tech section (like density mode)

Puppeteer screenshots

tech-pager-page1-390x844.png

tech-pager-page2-390x844.png

Build

pnpm --filter @shofar/shofar-store build

Commit

feat(web): WO-TECH-PAGER-01 mobile paged technology carousel

WO-PRODUCT-SCREEN-01

Title: Mobile Product section “fits as a screen”
Goal: On mobile, the Product section must land in a clean state where:

The section title is visible

The product card and Add to Cart are visible

It feels like a deliberate “product screen,” not a cut-off scroll position.

Constraints

Desktop unchanged

No removing content globally (fake reviews stay; product copy stays unless absolutely required)

Prefer layout compression + smart grouping over hiding everything

Use svh + safe areas correctly

Files

apps/shofar-store/src/brands/tooly/sections/ProductSection.tsx

apps/shofar-store/src/brands/tooly/components/ui/ProductCard.tsx (or wherever the card is built)

apps/shofar-store/src/app/globals.css (only if needed for density tokens)

Implementation guidance (what “industry-leading” looks like here)

Reduce vertical waste:

Section padding: py-16 → smaller on mobile (py-10 / py-12)

Header spacing: mb-12 → mb-6

Reduce image height:

Change image container from square → aspect-[4/3] or a max-height using svh

Keep CTA visible:

Ensure Add to Cart is always within viewport on 390×844

For 390×667, enable a compact mode (same approach as density, but tuned to product card)

Keep it premium:

Don’t shrink fonts randomly; use consistent steps

Maintain glass/shadow language

Verification

390×844: title + price + CTA visible at once

390×667: CTA visible; if not, compact mode kicks in

The section “feels intentional” as a screen

Puppeteer screenshots

product-screen-390x844.png

product-screen-390x667.png

Build

pnpm --filter @shofar/shofar-store build

Commit

feat(web): WO-PRODUCT-SCREEN-01 mobile product section fits screen

WO-REVIEWS-SCREEN-01

Title: Reviews section uses the design-system marquee style and fits cleanly
Goal: Reviews feel like a premium app section: strong heading + marquee that doesn’t look cramped or endless.

Constraints

Keep fake reviews for now (per your instruction)

Must respect reduced motion (marquee pauses or becomes static)

Files

apps/shofar-store/src/brands/tooly/sections/ReviewsSection.tsx

apps/shofar-store/src/brands/tooly/components/ui/ReviewsMarquee.tsx (if adjustments needed)

apps/shofar-store/src/app/design-system/page.tsx (ensure demo matches production)

Build + screenshots + commit like prior WOs.

WO-SNAP-MODE-EXP-01 (optional experiment)

Prototype vertical “screen snapping” on mobile behind a flag:

CSS scroll-snap-type: y proximity on a wrapper

Only applies to screen sections

Off by default (query param or localStorage)

This is where we test whether it’s “nice” or “annoying” without risking the core UX.