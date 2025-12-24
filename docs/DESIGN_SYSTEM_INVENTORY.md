# DESIGN_SYSTEM_INVENTORY.md

> WO-DESIGN-SYSTEM-INVENTORY-01 | Generated: 2025-12-24

## 1) Route Entrypoint

| Route            | File Path                                          |
| ---------------- | -------------------------------------------------- |
| `/design-system` | `apps/shofar-store/src/app/design-system/page.tsx` |

---

## 2) Component Inventory Table

### USED in Production

| Display Name    | Component File Path                              | Used In (production paths)                                                                                                | Notes                           |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| ButtonPrimary   | `brands/tooly/components/ui/ButtonPrimary.tsx`   | `sections/ProductSection.tsx`, `sections/HeroSection.tsx`, `checkout/page.tsx`, `CartDrawer.tsx`, `StripePaymentForm.tsx` | Primary CTA with rainbow border |
| ButtonSecondary | `brands/tooly/components/ui/ButtonSecondary.tsx` | `sections/HeroSection.tsx`, `sections/AccessoriesSection.tsx`, `ui/Navbar.tsx`, `CartDrawer.tsx`, `checkout/page.tsx`     | Ghost/secondary actions         |
| ButtonPill      | `brands/tooly/components/ui/ButtonPill.tsx`      | `ui/Navbar.tsx`                                                                                                           | Compact pill buttons            |
| Navbar          | `brands/tooly/components/ui/Navbar.tsx`          | `brands/tooly/index.tsx`                                                                                                  | Main navigation header          |
| ProductCard     | `brands/tooly/components/ui/ProductCard.tsx`     | `sections/ProductSection.tsx`, `sections/AccessoriesSection.tsx`                                                          | Product grid item               |
| ProductCarousel | `brands/tooly/components/ui/ProductCarousel.tsx` | `sections/ProductSection.tsx`                                                                                             | Image carousel with lightbox    |
| Lightbox        | `brands/tooly/components/ui/Lightbox.tsx`        | `sections/GallerySection.tsx`, `ui/ProductCarousel.tsx`                                                                   | Fullscreen image viewer         |
| Input           | `brands/tooly/components/ui/Input.tsx`           | `checkout/page.tsx`, `StripePaymentForm.tsx`                                                                              | Form input with floating label  |
| ReviewsMarquee  | `brands/tooly/components/ui/ReviewsMarquee.tsx`  | `sections/ReviewsSection.tsx`                                                                                             | Auto-scrolling testimonials     |

### UNUSED (Design-System Only)

| Display Name           | Component File Path                                                 | Dependencies  | Safe to Delete?     | Notes                            |
| ---------------------- | ------------------------------------------------------------------- | ------------- | ------------------- | -------------------------------- |
| ButtonGraphite         | `brands/tooly/components/ui/ButtonGraphite.tsx`                     | None          | KEEP (experimental) | Static rainbow border variant    |
| ButtonMarketingPrimary | `brands/tooly/components/ui/experiments/ButtonMarketingPrimary.tsx` | None          | KEEP (experimental) | Marketing variation              |
| ButtonRotatingWhite    | `brands/tooly/components/ui/experiments/index.ts`                   | None          | KEEP (experimental) | Rotating gradient effect         |
| ButtonRotatingPurple   | `brands/tooly/components/ui/experiments/index.ts`                   | None          | KEEP (experimental) | Rotating gradient effect         |
| ButtonConicShine       | `brands/tooly/components/ui/experiments/index.ts`                   | None          | KEEP (experimental) | Conic gradient with shine        |
| ButtonGlowUp           | `brands/tooly/components/ui/experiments/index.ts`                   | None          | KEEP (experimental) | Glow effect on hover             |
| ButtonRainbowShine     | `brands/tooly/components/ui/experiments/index.ts`                   | None          | KEEP (experimental) | Rainbow conic gradient           |
| ToolyWordmark          | `brands/tooly/components/ui/ToolyWordmark.tsx`                      | None          | KEEP (branding)     | Chromatic aberration logo        |
| ToolyWordmarkStacked   | `brands/tooly/components/ui/ToolyWordmark.tsx`                      | None          | KEEP (branding)     | Stacked version                  |
| Watermark              | `brands/tooly/components/ui/Watermark.tsx`                          | None          | KEEP (experimental) | Background watermark effect      |
| WatermarkGrid          | `brands/tooly/components/ui/Watermark.tsx`                          | None          | KEEP (experimental) | Grid watermark variant           |
| WatermarkAnimated      | `brands/tooly/components/ui/Watermark.tsx`                          | None          | KEEP (experimental) | Animated watermark               |
| FeatureRail            | `brands/tooly/components/ui/FeatureRail.tsx`                        | None          | KEEP (experimental) | Feature showcase with progress   |
| SearchBar              | `brands/tooly/components/ui/SearchBar.tsx`                          | Input         | KEEP (future)       | Advanced search with suggestions |
| ToastProvider          | `brands/tooly/components/ui/Toast.tsx`                              | None          | KEEP (future)       | Notification system              |
| useToast               | `brands/tooly/components/ui/Toast.tsx`                              | ToastProvider | KEEP (future)       | Toast hook                       |
| Card                   | `brands/tooly/components/ui/Card.tsx`                               | None          | KEEP (layout)       | Glass card container             |
| CardHeader/Body/Footer | `brands/tooly/components/ui/Card.tsx`                               | Card          | KEEP (layout)       | Card sub-components              |
| CardGrid               | `brands/tooly/components/ui/Card.tsx`                               | None          | KEEP (layout)       | Responsive card grid             |
| Section                | `brands/tooly/components/ui/Section.tsx`                            | None          | KEEP (layout)       | Page section wrapper             |
| HeroSection            | `brands/tooly/components/ui/Section.tsx`                            | Section       | USED (index.tsx)    | Hero with bg + headline          |
| CTASection             | `brands/tooly/components/ui/Section.tsx`                            | Section       | KEEP (layout)       | Call-to-action section           |
| PointerVarsProvider    | `components/providers/PointerVarsProvider.tsx`                      | None          | KEEP (effects)      | CSS vars for pointer position    |

---

## 3) Grep Evidence (Commands Used)

```bash
# Check ButtonPrimary usage
rg "ButtonPrimary" apps/shofar-store/src --files-with-matches
# Result: 13 files (includes definition + design-system + 5 production files)

# Check ButtonGraphite usage
rg "ButtonGraphite" apps/shofar-store/src --files-with-matches
# Result: 2 files (definition + design-system only) → UNUSED

# Check experiments usage
rg "from [\"']@/brands/tooly/components/ui/experiments" apps/shofar-store/src --files-with-matches
# Result: 1 file (design-system only) → ALL UNUSED

# Check SearchBar usage
rg "SearchBar" apps/shofar-store/src --files-with-matches
# Result: 3 files (definition + index + design-system) → UNUSED

# Check Lightbox usage
rg "Lightbox" apps/shofar-store/src --files-with-matches
# Result: 4 files (definition + ProductCarousel + GallerySection + design-system) → USED

# Check ToastProvider usage
rg "ToastProvider|useToast" apps/shofar-store/src --files-with-matches
# Result: 3 files (definition + index + design-system) → UNUSED in production
```

---

## Summary

- **USED in production**: 9 components
- **UNUSED (experimental/future)**: 21 components
- **Recommendation**: Keep all unused components as experimental/future use. No deletions needed.
