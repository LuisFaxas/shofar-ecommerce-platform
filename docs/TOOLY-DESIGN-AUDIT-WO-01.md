# TOOLY Storefront Design + UX Audit (As-Built)

> **Work Order**: WO-DESIGN-AUDIT-01
> **Date**: December 24, 2025
> **Scope**: apps/shofar-store (TOOLY brand only)
> **Purpose**: Complete as-built UI audit for TOOLY v2.0 design planning

---

## 1. Page Map (Section-by-Section, Render Order)

### App Shell (`src/brands/tooly/index.tsx`)

The ToolyApp is a **client component** wrapped in `CartProvider`. Debug mock mode augments data when enabled via localStorage.

```
ToolyApp (CartProvider wrapper)
├── ToolyAppInner
│   ├── Debug Banner (dev-only)
│   ├── Navbar (sticky)
│   └── main
│       ├── 1. HeroSection
│       ├── 2. CredibilitySection
│       ├── 3. TechnologySection
│       ├── 4. GallerySection
│       ├── 5. ProductSection
│       ├── 6. AccessoriesSection
│       ├── 7. ReviewsSection
│       └── 8. FaqSection
│   └── FooterSection
└── CartDrawer (overlay)
```

---

### Section 1: HeroSection

| Property               | Value                                                      |
| ---------------------- | ---------------------------------------------------------- |
| **File**               | `src/brands/tooly/sections/HeroSection.tsx`                |
| **ID**                 | `#hero`                                                    |
| **Min Height**         | 90vh                                                       |
| **Data Sources**       |                                                            |
| - Background Image     | Vendure Channel `customFields.heroImage.preview`           |
| - Fallback Image       | Product `featuredAsset.preview`                            |
| - All Text             | Vendure Channel `storefrontHero*` fields                   |
| **Props**              | `heroImage`, `featuredAsset`, `productName`, `content`     |
| **Layout Constraints** | Full-bleed background, centered content, gradient overlays |
| **Mobile Behavior**    | Same design, scaled typography (4xl → 6xl → 7xl)           |

**Key Elements**:

- Pulsing badge (availability indicator)
- 3-line headline with gradient accent line
- Subheadline paragraph
- Dual CTAs: Primary (Shop Now) + Secondary (Learn More) - smooth scroll to sections

---

### Section 2: CredibilitySection

| Property         | Value                                                                      |
| ---------------- | -------------------------------------------------------------------------- |
| **File**         | `src/brands/tooly/sections/CredibilitySection.tsx`                         |
| **ID**           | `#credibility`                                                             |
| **Background**   | `#0d1218` (secondary surface)                                              |
| **Data Sources** |                                                                            |
| - Stats          | **HARDCODED** (10,000+, 4.9 rating, 99%, 2 Year)                           |
| - Trust Badges   | Vendure Channel `storefrontTrust[1-4]*` fields (icons are code-controlled) |
| **Props**        | `trustBadges` (4-tuple)                                                    |
| **Layout**       | 2x4 grid on mobile, 4-column grid on desktop                               |

**Known Issue**: Stats are hardcoded - should be CMS-driven for truthful claims.

---

### Section 3: TechnologySection

| Property         | Value                                                                |
| ---------------- | -------------------------------------------------------------------- |
| **File**         | `src/brands/tooly/sections/TechnologySection.tsx`                    |
| **ID**           | `#technology`                                                        |
| **Background**   | Default (`#0b0e14`)                                                  |
| **Data Sources** |                                                                      |
| - Feature Text   | Vendure Channel `storefrontFeature[1-6]*` fields                     |
| - Feature Icons  | **HARDCODED** (precision, airflow, materials, design, temp, battery) |
| **Props**        | `features` (6-tuple)                                                 |
| **Layout**       | 1-col → 2-col → 3-col grid                                           |
| **Hover**        | Card background/border brightens, icon color shifts cyan → white     |

---

### Section 4: GallerySection

| Property            | Value                                                  |
| ------------------- | ------------------------------------------------------ |
| **File**            | `src/brands/tooly/sections/GallerySection.tsx`         |
| **ID**              | `#gallery`                                             |
| **Background**      | `#0d1218`                                              |
| **Data Sources**    |                                                        |
| - Images (Priority) | Vendure Channel `customFields.homeGalleryAssets[]`     |
| - Images (Fallback) | Product `assets[]`                                     |
| - Heading/Subhead   | Vendure Channel `storefrontGallery*` fields            |
| **Props**           | `assets`, `channelGalleryAssets`, `content`            |
| **Layout**          | 2x3 grid; first image spans 2 cols + 2 rows on desktop |
| **Aspect Ratio**    | 16:9 (featured: square on desktop)                     |
| **Hover**           | Scale 1.05 + gradient overlay with label               |
| **Mobile**          | 2-column grid, all 16:9 aspect                         |

**Placeholder Behavior**: Glass-bordered empty states with image icons when no assets.

---

### Section 5: ProductSection

| Property           | Value                                                              |
| ------------------ | ------------------------------------------------------------------ |
| **File**           | `src/brands/tooly/sections/ProductSection.tsx`                     |
| **ID**             | `#product`                                                         |
| **Background**     | Default                                                            |
| **Data Sources**   |                                                                    |
| - Product Data     | Vendure Product (name, description, variants, assets)              |
| - Shop Content     | Vendure Channel `storefrontShipping*`, `storefrontDelivery*`, etc. |
| **Props**          | `product`, `shopContent`                                           |
| **Key Components** |                                                                    |
| - ProductCarousel  | Product `assets[]` with swipe/snap                                 |
| - Variant Selector | Color swatches from `variant.facetValues`                          |
| - Price Display    | `variant.priceWithTax` formatted                                   |
| - Stock Status     | `variant.stockLevel` with indicator dot                            |
| **Layout**         | 2-column grid (carousel left, info right)                          |
| **Features List**  | **HARDCODED** - 3 bullet points about materials/warranty           |

---

### Section 6: AccessoriesSection

| Property         | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| **File**         | `src/brands/tooly/sections/AccessoriesSection.tsx`                 |
| **ID**           | `#accessories`                                                     |
| **Background**   | `#0d1218`                                                          |
| **Data Sources** | Vendure Collection `accessories` → `productVariants.items[]`       |
| **Props**        | `accessories`                                                      |
| **Layout**       | 2x2 grid (mobile) → 4-column (desktop), max 4 items                |
| **Empty State**  | "Coming Soon" with gift icon                                       |
| **Cards**        | Aspect-square image, title, description, price, add-to-cart button |

---

### Section 7: ReviewsSection

| Property         | Value                                          |
| ---------------- | ---------------------------------------------- |
| **File**         | `src/brands/tooly/sections/ReviewsSection.tsx` |
| **ID**           | `#reviews`                                     |
| **Background**   | Default                                        |
| **Data Sources** | **HARDCODED** - 6 static reviews               |
| **Props**        | None (fully static)                            |
| **Layout**       | 2-col → 3-col grid                             |
| **Trust Badge**  | 4.9 stars + "2,500+ reviews" - **HARDCODED**   |

**Critical Issue**: All reviews and stats are hardcoded. Should integrate real reviews or remove.

---

### Section 8: FaqSection

| Property         | Value                                                      |
| ---------------- | ---------------------------------------------------------- |
| **File**         | `src/brands/tooly/sections/FaqSection.tsx`                 |
| **ID**           | `#faq`                                                     |
| **Background**   | `#0d1218`                                                  |
| **Data Sources** | Vendure Channel `storefrontFaq[1-6]*`, `storefrontShowFaq` |
| **Props**        | `content` (FaqContent)                                     |
| **Layout**       | Max-width 3xl, stacked accordion                           |
| **Interaction**  | Single-item expand (others collapse)                       |
| **Keyboard**     | Enter/Space to toggle                                      |
| **Visibility**   | Can be hidden via `storefrontShowFaq: false`               |

---

### Section 9: FooterSection

| Property         | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **File**         | `src/brands/tooly/sections/FooterSection.tsx`                |
| **ID**           | `#footer`                                                    |
| **Data Sources** |                                                              |
| - Disclaimer     | Vendure Channel `storefrontDisclaimer`                       |
| - Links          | **HARDCODED** (Product, Support, Company columns)            |
| - Social Links   | **HARDCODED** (Twitter, Instagram, YouTube - all `href="#"`) |
| **Props**        | `disclaimer`                                                 |
| **Layout**       | 2-col → 5-col grid                                           |
| **Newsletter**   | Form present but **non-functional** (e.preventDefault only)  |

---

## 2. Component Inventory

### Navigation & Cart

| Component      | Path                                         | Responsibility                                           |
| -------------- | -------------------------------------------- | -------------------------------------------------------- |
| **Navbar**     | `src/brands/tooly/components/ui/Navbar.tsx`  | Sticky header, logo, nav links, cart button, mobile menu |
| **CartDrawer** | `src/brands/tooly/components/CartDrawer.tsx` | Slide-out cart overlay with focus trap                   |

### UI Primitives

| Component           | Path                     | Purpose                       |
| ------------------- | ------------------------ | ----------------------------- |
| **ButtonPrimary**   | `ui/ButtonPrimary.tsx`   | Main CTA button with gradient |
| **ButtonSecondary** | `ui/ButtonSecondary.tsx` | Secondary actions             |
| **ButtonPill**      | `ui/ButtonPill.tsx`      | Pill-shaped ghost buttons     |
| **QuantityStepper** | `ui/QuantityStepper.tsx` | +/- quantity control          |
| **Input**           | `ui/Input.tsx`           | Form input field              |
| **Card**            | `ui/Card.tsx`            | Glass-styled card container   |
| **Dialog**          | `ui/Dialog.tsx`          | Modal dialog                  |
| **Popover**         | `ui/Popover.tsx`         | Floating popover              |
| **Toast**           | `ui/Toast.tsx`           | Notification toast            |
| **Section**         | `ui/Section.tsx`         | Section wrapper               |

### Product Components

| Component           | Path                     | Purpose                                        |
| ------------------- | ------------------------ | ---------------------------------------------- |
| **ProductCarousel** | `ui/ProductCarousel.tsx` | Mobile swipe carousel with dot/thumbnail nav   |
| **ProductCard**     | `ui/ProductCard.tsx`     | Individual product display                     |
| **ReviewsMarquee**  | `ui/ReviewsMarquee.tsx`  | Auto-scrolling testimonials (unused currently) |

### Experimental Buttons

Located in `ui/experiments/`:

- ButtonConicShine, ButtonGlowUp, ButtonMarketingPrimary
- ButtonRainbowShine, ButtonRotatingPurple, ButtonRotatingWhite

---

## 3. Gallery Audit

### Image Sources (Priority Order)

1. **Channel Gallery Assets**: `customFields.homeGalleryAssets[]` (marketing images)
2. **Product Assets**: `product.assets[]` (product photos)
3. **Placeholders**: Glass-bordered empty states with icons

### Cropping & Aspect Ratio

- **Standard tiles**: 16:9 aspect ratio (`aspect-video`)
- **Featured tile** (index 0): Square on desktop (`md:aspect-square`), 16:9 on mobile
- **Object-fit**: `object-cover` fills tiles completely

### Desktop vs Mobile

| Behavior | Desktop                    | Mobile            |
| -------- | -------------------------- | ----------------- |
| Grid     | 3-column                   | 2-column          |
| Featured | Spans 2 cols + 2 rows      | Normal 2-col span |
| Hover    | Scale 1.05 + label overlay | No hover (touch)  |

### Known Issues

1. **No lightbox**: Cannot view images fullscreen
2. **No zoom**: Cannot pinch-zoom on mobile
3. **Fixed 6-image limit**: Cannot display more gallery images
4. **No lazy loading**: All 6 images load at once

---

## 4. Motion/Interaction Audit

### CSS Motion System

Defined in `styles/motion.css` and `styles/tokens.css`:

| Token           | Value                          | Usage                              |
| --------------- | ------------------------------ | ---------------------------------- |
| `--motion-fast` | 160ms                          | Button presses, micro-interactions |
| `--motion-base` | 200ms                          | Standard transitions               |
| `--motion-slow` | 260ms                          | Larger element transitions         |
| `--ease-out`    | cubic-bezier(0.22, 1, 0.36, 1) | Primary easing                     |

### Transition Types

| Component      | Transition        | Properties                           |
| -------------- | ----------------- | ------------------------------------ |
| Buttons        | 160ms ease-out    | transform, background, border, color |
| Cards          | 200ms ease-out    | transform, box-shadow, border        |
| Gallery images | 300ms             | scale on hover                       |
| Cart drawer    | 300ms ease-out    | translateX                           |
| Mobile menu    | 300ms             | max-height                           |
| FAQ accordion  | 300ms ease-in-out | max-height, opacity                  |

### Keyframe Animations

- `fade-in/out`, `slide-in-up/down`, `scale-in` (standard)
- `shimmer` (loading states)
- `circuitTrace`, `gearRotate`, `laserScan` (industrial loaders - unused)
- `liquidMorph`, `energyFlow` (decorative - unused)

### Reduced Motion Support

**Properly implemented** in both motion CSS files:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Hover/Tap States

| Element         | Hover State                 | Active State |
| --------------- | --------------------------- | ------------ |
| Primary buttons | Scale 1.02, brighter        | Scale 0.98   |
| Cards           | Border brightens, lift      | -            |
| Gallery images  | Scale 1.05, overlay appears | -            |
| Nav links       | Background tint appears     | -            |

### Scroll Behavior

- `scroll-behavior: smooth` on `html`
- Smooth scroll to sections on CTA clicks
- Respects `prefers-reduced-motion`

---

## 5. UX + Conversion Friction Points

### Copy Issues

| Issue                                           | Location                   | Severity                                |
| ----------------------------------------------- | -------------------------- | --------------------------------------- |
| Hardcoded stats (10,000+ customers, 4.9 rating) | CredibilitySection         | **HIGH** - False claims if not verified |
| Hardcoded reviews                               | ReviewsSection             | **HIGH** - No real social proof         |
| "2,500+ reviews" claim                          | ReviewsSection trust badge | **HIGH** - Must be truthful             |
| Generic product features                        | ProductSection             | MEDIUM - Should be CMS-driven           |

### Trust Issues

1. **No real reviews integration** - All testimonials are static
2. **No third-party badges** - No TrustPilot/reviews.io integration
3. **Social links point to `#`** - Footer social media non-functional
4. **Newsletter form non-functional** - `e.preventDefault()` only

### Missing Information

1. **No shipping cost preview** - Must reach checkout to see shipping
2. **No product weight/dimensions** - Important for informed purchase
3. **No comparison chart** - If multiple variants exist
4. **No "What's in the box"** - Only visible in FAQ

### Checkout Friction

| Issue                       | Severity | Notes                                |
| --------------------------- | -------- | ------------------------------------ |
| No guest checkout messaging | MEDIUM   | User may think account required      |
| US-only country hardcoded   | **HIGH** | `countryCode: "US"` in address form  |
| No order summary editing    | MEDIUM   | Must go back to store to modify cart |
| No saved addresses          | LOW      | First-time user friction acceptable  |
| Loading state is minimal    | LOW      | "Loading checkout..." text only      |

### Mobile-Only Issues

1. **Sign In/Up buttons hidden on smaller screens** (under sm breakpoint)
2. **Newsletter input cramped** in footer on mobile
3. **No swipe gestures on gallery grid** (only on ProductCarousel)
4. **Thumbnail strip hidden on mobile** in ProductCarousel (dots only)

---

## 6. Accessibility Audit (Quick)

### Keyboard Navigation

| Component        | Status        | Notes                                     |
| ---------------- | ------------- | ----------------------------------------- |
| Navbar           | Good          | Tab through links, ESC closes mobile menu |
| CartDrawer       | **Excellent** | FocusTrap implemented, ESC closes         |
| ProductCarousel  | Good          | Arrow keys navigate, tab through dots     |
| FaqSection       | Good          | Enter/Space toggle, proper aria-expanded  |
| Variant selector | Good          | aria-pressed states                       |

### Focus States

- **Consistent focus rings** using `focus-visible:ring-2 ring-white/50`
- Focus offset properly configured in tokens
- No keyboard traps detected

### ARIA Labels

| Component    | Status                             |
| ------------ | ---------------------------------- |
| Hero section | `aria-labelledby="hero-heading"`   |
| All sections | Proper `aria-labelledby`           |
| Cart button  | Dynamic aria-label with count      |
| Carousel     | `aria-roledescription="carousel"`  |
| Star ratings | `aria-label="${n} out of 5 stars"` |

### Missing Accessibility

1. **Skip to main content link** - Not present
2. **Live regions for cart updates** - Present in CartDrawer but could be enhanced
3. **Image alt texts** - Generic "Product image 1" patterns
4. **Color contrast** - White text on dark backgrounds generally good, but low-opacity text (`text-white/40`) may fail

### Screen Reader Notes

- Section headings use proper h2 hierarchy
- sr-only classes used for hidden headings (e.g., Footer "Footer", Credibility "Why Choose TOOLY")

---

## 7. Performance Notes

### Potential LCP Contributors

1. **Hero Background Image**
   - Full-bleed 100vw image
   - `priority` attribute set
   - Should use `fetchpriority="high"`

2. **Gallery Images**
   - 6 images load at once
   - No lazy loading on initial viewport images
   - First image should be prioritized

### Image Loading Strategy

| Image Type       | Strategy                       |
| ---------------- | ------------------------------ |
| Hero background  | `priority` (preloaded)         |
| Product carousel | `priority` on first image only |
| Gallery grid     | No priority (should lazy load) |
| Accessory cards  | No priority                    |

### Potential Improvements

1. **Gallery images need lazy loading** - All 6 load immediately
2. **No image placeholder/blur** - LQIP not implemented
3. **Backdrop blur performance** - Reduced on mobile but still expensive:
   ```css
   @media (max-width: 768px) {
     --blur-lg: 10px; /* vs 16px desktop */
   }
   ```

### Render-Blocking Concerns

1. **Large CSS files** - `motion.css` includes unused industrial loaders
2. **"use client" on all sections** - Entire page is client-rendered
3. **CartContext on every page** - Context provider at root level

### Bundle Concerns

1. **Experimental buttons** - 7+ unused button variants in bundle
2. **focus-trap-react** - External dependency for CartDrawer
3. **All sections import design tokens** - No tree-shaking of unused CSS

---

## 8. Improvement Recommendations

### High Impact / Low Effort

| #   | Recommendation                                                                                                    | Impact      | Effort   |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----------- | -------- |
| 1   | **Remove or verify hardcoded stats** - 10,000+ customers, 4.9 rating, 2,500+ reviews are potentially false claims | Legal/Trust | Low      |
| 2   | **Add skip-to-main-content link** - Simple a11y win                                                               | A11y        | Very Low |
| 3   | **Fix social media links** - Either add real URLs or remove icons                                                 | Trust       | Very Low |
| 4   | **Lazy load gallery images** - Add `loading="lazy"` to non-priority images                                        | Perf        | Low      |
| 5   | **Make newsletter form functional** - Wire to email service or remove                                             | Trust       | Low-Med  |

### High Impact / Medium Effort

| #   | Recommendation                                                               | Impact          | Effort |
| --- | ---------------------------------------------------------------------------- | --------------- | ------ |
| 6   | **Integrate real reviews** - Connect to reviews platform or hide section     | Trust/Conv      | Medium |
| 7   | **Add gallery lightbox** - Allow fullscreen image viewing                    | UX              | Medium |
| 8   | **Make stats CMS-driven** - Move credibility stats to Vendure Channel fields | Maintainability | Medium |
| 9   | **Fix country selector** - Remove hardcoded US-only checkout                 | Conversion      | Medium |
| 10  | **Add product specs** - Dimensions, weight, materials in ProductSection      | Conversion      | Medium |

### Medium Impact / Higher Effort

| #   | Recommendation                                                                    | Impact  | Effort      |
| --- | --------------------------------------------------------------------------------- | ------- | ----------- |
| 11  | **Remove unused CSS/components** - Prune experimental buttons, industrial loaders | Perf    | Medium      |
| 12  | **Add LQIP/blur placeholders** - Improve perceived loading performance            | UX/Perf | Medium-High |

---

## Layout Constraints (Do Not Change)

The following elements are considered "locked" for v2.0:

1. **Section order** - Hero → Credibility → Technology → Gallery → Product → Accessories → Reviews → FAQ → Footer
2. **9 distinct sections** - Cannot merge or remove without breaking anchor navigation
3. **Section IDs** - Used by navbar anchor links (#hero, #product, etc.)
4. **Sticky navbar** - Core navigation pattern
5. **Cart drawer overlay** - Established cart UX
6. **Dark theme** - `#0b0e14` / `#0d1218` surface colors
7. **Glass morphism** - Signature visual style

---

## Data Sources Summary

| Content           | Source                                | Editable In Admin?               |
| ----------------- | ------------------------------------- | -------------------------------- |
| Hero text         | Channel customFields                  | Yes                              |
| Hero image        | Channel customFields                  | Yes                              |
| Trust badges      | Channel customFields                  | Yes (text only, icons hardcoded) |
| Features          | Channel customFields                  | Yes (text only, icons hardcoded) |
| Gallery images    | Channel customFields / Product assets | Yes                              |
| Gallery text      | Channel customFields                  | Yes                              |
| Product data      | Product entity                        | Yes                              |
| Shop labels       | Channel customFields                  | Yes                              |
| Accessories       | Collection entity                     | Yes                              |
| Reviews           | **HARDCODED**                         | No                               |
| Credibility stats | **HARDCODED**                         | No                               |
| FAQ               | Channel customFields                  | Yes                              |
| Footer disclaimer | Channel customFields                  | Yes                              |
| Footer links      | **HARDCODED**                         | No                               |
| Social links      | **HARDCODED**                         | No                               |

---

## 9. Puppeteer Visual Audit

> **Test Date**: December 24, 2025
> **Live URL**: https://shofar-ecommerce-platform-shofar-st.vercel.app
> **Viewports Tested**: Desktop (1440×900), Mobile (393×852 - iPhone 14 Pro equivalent)

### Desktop Visual Audit (1440×900)

| Section         | Status  | Notes                                                                                                                                            |
| --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero**        | ✅ Pass | Full-bleed background image renders correctly. 3-line headline properly centered. Dual CTAs visible and properly spaced. Pulsing badge animates. |
| **Credibility** | ✅ Pass | 4-column stats grid aligns properly. Trust badges display in row. All icons render.                                                              |
| **Technology**  | ✅ Pass | 3-column feature card grid. Hover states work. Card borders visible.                                                                             |
| **Gallery**     | ✅ Pass | Asymmetric grid with featured image spanning 2 cols + 2 rows. All 6 images load. Hover overlays appear.                                          |
| **Product**     | ✅ Pass | 2-column layout (carousel left, info right). Variant selector visible. Add to Cart button prominent. Stock indicator shows.                      |
| **Accessories** | ✅ Pass | "Coming Soon" empty state displays correctly with gift icon.                                                                                     |
| **Reviews**     | ✅ Pass | 3-column review cards. Star ratings render. 4.9 aggregate badge visible at bottom.                                                               |
| **FAQ**         | ✅ Pass | Accordion items stack properly. Expand/collapse works. "Contact Support" button visible.                                                         |
| **Footer**      | ✅ Pass | Multi-column layout. Social icons visible. Newsletter form renders. Copyright and legal links at bottom.                                         |

**Desktop Verdict**: All sections render correctly with no visual issues, overflow, or alignment problems.

---

### Mobile Visual Audit (393×852)

| Section         | Status   | Notes                                                                                                                          |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Navbar**      | ✅ Pass  | Logo visible, cart icon accessible, hamburger menu icon present.                                                               |
| **Hero**        | ✅ Pass  | Typography scales down appropriately (responsive sizing works). CTAs stack vertically. Background image still visible.         |
| **Credibility** | ⚠️ Issue | Trust badge labels truncate on narrow screens. "Secure Checkout" shows as "Secure..." - text overflow hidden.                  |
| **Technology**  | ✅ Pass  | Single-column layout. Cards stack vertically. Full-width cards with proper padding.                                            |
| **Gallery**     | ✅ Pass  | 2-column grid. All images fit. No overflow. 16:9 aspect maintained.                                                            |
| **Product**     | ✅ Pass  | Full-width layout. Add to Cart button spans full width. Carousel with dot navigation (no thumbnails). Price and stock visible. |
| **Accessories** | ✅ Pass  | "Coming Soon" displays properly.                                                                                               |
| **Reviews**     | ✅ Pass  | Review cards stack single-column. Full text visible. Star ratings render correctly. Aggregate badge visible.                   |
| **FAQ**         | ✅ Pass  | Accordion items full-width. Expanded answer text wraps properly. "Contact Support" button accessible.                          |
| **Footer**      | ✅ Pass  | Columns stack vertically. Newsletter input + Subscribe button fit on same row. Social icons centered. Legal links visible.     |

---

### Interactive Elements (Mobile)

| Element            | Status      | Notes                                                                                                                                               |
| ------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hamburger Menu** | ✅ Pass     | Opens smoothly with slide-down animation. Shows: Shop, Technology, Reviews, FAQ links. Sign In text + Sign Up button visible. X close button works. |
| **Cart Drawer**    | ⏸️ Untested | Cart icon present but drawer requires items to test. Cart functionality verified in codebase review.                                                |
| **FAQ Accordion**  | ✅ Pass     | Tap to expand/collapse works. Only one item open at a time (proper accordion behavior).                                                             |

---

### Issues Found

#### Issue 1: Trust Badge Text Truncation (Mobile)

**Severity**: Medium
**Location**: CredibilitySection, trust badges row
**Device**: Mobile (393px and below)

**Description**: Trust badge labels truncate with ellipsis. "Secure Checkout" displays as "Secure..." and similar truncation on other badges.

**Root Cause**: Text container has `overflow-hidden` and `text-overflow-ellipsis` but insufficient width at mobile breakpoints.

**Recommendation**:

- Consider 2×2 grid layout on mobile instead of 4-across
- Or reduce icon size to allow more text space
- Or use shorter labels for mobile viewport

---

#### Issue 2: Sign In/Up Hidden on Smallest Screens

**Severity**: Low
**Location**: Navbar mobile menu
**Device**: < 640px (sm breakpoint)

**Description**: The Sign In/Sign Up buttons are conditionally hidden below the sm breakpoint in the navbar. They DO appear in the mobile hamburger menu, so functionality is preserved.

**Current Behavior**: Acceptable - auth links accessible via hamburger menu.

---

### Viewport-Specific Observations

#### Breakpoint Transitions

| Breakpoint | Width      | Behavior Verified                                   |
| ---------- | ---------- | --------------------------------------------------- |
| Mobile     | < 640px    | Single-column layouts, hamburger menu, stacked CTAs |
| Tablet     | 640-1024px | Mixed layouts (not specifically tested)             |
| Desktop    | > 1024px   | Multi-column grids, horizontal layouts              |

#### Touch Targets (Mobile)

| Element               | Size                     | Status       |
| --------------------- | ------------------------ | ------------ |
| Hamburger menu button | ~44×44px                 | ✅ Adequate  |
| Cart icon             | ~44×44px                 | ✅ Adequate  |
| Navigation links      | Full-width in menu       | ✅ Adequate  |
| Add to Cart button    | Full-width               | ✅ Excellent |
| FAQ accordion items   | Full-width, ~60px height | ✅ Adequate  |
| Footer links          | ~44px tap height         | ✅ Adequate  |

---

### Performance Observations (Visual)

1. **Hero image load**: Background image loads promptly with `priority` attribute working
2. **Gallery images**: All 6 images load simultaneously (no lazy loading observed)
3. **No layout shift**: CLS appears minimal - no visible content jumping during load
4. **Animations**: Smooth on both desktop and mobile (no jank observed)

---

### Screenshots Captured

| Name                        | Viewport | Description                       |
| --------------------------- | -------- | --------------------------------- |
| `tooly-desktop-hero`        | 1440×900 | Hero section                      |
| `tooly-desktop-credibility` | 1440×900 | Stats + trust badges              |
| `tooly-desktop-technology`  | 1440×900 | Feature grid                      |
| `tooly-desktop-gallery`     | 1440×900 | Image gallery                     |
| `tooly-desktop-product`     | 1440×900 | Product section                   |
| `tooly-desktop-accessories` | 1440×900 | Coming soon state                 |
| `tooly-desktop-reviews`     | 1440×900 | Reviews grid                      |
| `tooly-desktop-faq`         | 1440×900 | FAQ accordion                     |
| `tooly-desktop-footer`      | 1440×900 | Footer                            |
| `tooly-mobile-hero`         | 393×852  | Mobile hero                       |
| `tooly-mobile-credibility`  | 393×852  | Trust badges (truncation visible) |
| `tooly-mobile-technology`   | 393×852  | Feature cards stacked             |
| `tooly-mobile-gallery`      | 393×852  | 2-col grid                        |
| `tooly-mobile-product`      | 393×852  | Full-width product                |
| `tooly-mobile-reviews`      | 393×852  | Stacked reviews                   |
| `tooly-mobile-faq-section`  | 393×852  | FAQ accordion                     |
| `tooly-mobile-footer`       | 393×852  | Stacked footer                    |
| `tooly-mobile-menu-open`    | 393×852  | Hamburger menu expanded           |

---

### Visual Audit Summary

| Category               | Desktop      | Mobile                       |
| ---------------------- | ------------ | ---------------------------- |
| Layout integrity       | ✅ Excellent | ✅ Good                      |
| No horizontal overflow | ✅ Pass      | ✅ Pass                      |
| Touch target sizes     | N/A          | ✅ Pass                      |
| Text readability       | ✅ Pass      | ⚠️ Minor issues (truncation) |
| Interactive elements   | ✅ Pass      | ✅ Pass                      |
| Responsive images      | ✅ Pass      | ✅ Pass                      |
| Animation smoothness   | ✅ Pass      | ✅ Pass                      |

**Overall Mobile Compatibility**: **Good** - One minor text truncation issue in trust badges; otherwise fully functional and visually correct across both viewport sizes.

---

### Product Widget Deep Dive (Mobile)

> **Test Device**: iPhone 16 Pro Max viewport (430×932)
> **Critical Section**: #product (Shopping Widget)

#### Measurements (iPhone 16 Pro Max - 430×932)

| Element                  | Height      | Notes                        |
| ------------------------ | ----------- | ---------------------------- |
| Viewport                 | 932px       | Full device height           |
| Navbar                   | 65px        | Sticky header                |
| **Usable viewport**      | **867px**   | After navbar                 |
| Section padding (top)    | 64px        | `py-16`                      |
| Header + margin          | 128px       | `h2` (80px) + `mb-12` (48px) |
| Product card             | 770px       | Contains carousel + info     |
| Section padding (bottom) | 64px        | `py-16`                      |
| **Total widget height**  | **~1026px** | Exceeds viewport by 159px    |

**Result**: When user taps "Shop Now", the Add to Cart button is **cut off by ~95px** and requires scrolling.

---

#### Issue 1: Anchor Navigation Misalignment

**Severity**: HIGH
**Impact**: Conversion friction - CTA not visible on landing

**Problem**: When clicking "Shop Now" (anchor to `#product`), the browser scrolls to the section top, but:

1. Section has `py-16` (64px) top padding
2. Header "Choose Your TOOLY" takes 80px + 48px margin
3. This pushes the product card down, cutting off Add to Cart button

**Current Behavior**:

```
Visible on landing:
├── "Choose Your TOOLY" heading
├── "Premium craftsmanship..." subhead
├── Product image carousel
├── Product title "TOOLY"
├── Price "$109.00"
├── Stock status
└── Feature bullets (partially)

Cut off (requires scroll):
├── Add to Cart button  ← CRITICAL
└── Shipping text
```

**Recommendation**:

- Reduce section top padding on mobile (`py-8 md:py-16`)
- Reduce header bottom margin on mobile (`mb-6 md:mb-12`)
- Or implement `scroll-margin-top` to account for navbar + optimal position

---

#### Issue 2: Product Images Too Small

**Severity**: MEDIUM
**Impact**: Poor product visualization, reduced purchase confidence

**Problem**: Product images appear small within the carousel due to:

| Factor                    | Value                                 | Impact                            |
| ------------------------- | ------------------------------------- | --------------------------------- |
| Container                 | `aspect-square` (1:1)                 | Good                              |
| Image fit                 | `object-contain`                      | Preserves aspect but doesn't fill |
| Image padding             | `p-4` (16px all sides)                | Shrinks visible image             |
| Product photo composition | Dark background with centered product | Lots of negative space            |

**Visual Result**: The actual product takes up ~60% of the carousel area. On a 430px wide screen, the carousel is ~382px wide (after card padding), minus 32px image padding = ~350px effective image width. The product itself occupies maybe 200-250px of that.

**Recommendation**:

- Remove or reduce `p-4` padding on carousel images
- Consider `object-cover` for full-bleed product shots
- Request product photos with tighter cropping
- Consider larger carousel height on mobile

---

#### Issue 3: No Image Zoom/Lightbox

**Severity**: HIGH
**Impact**: Users cannot examine product details, reduces purchase confidence

**Problem**: Tapping product images does nothing. No zoom, no lightbox, no fullscreen view.

**Code Analysis** (`ProductCarousel.tsx`):

```tsx
// Line 146-153 - No click handler
<Image
  src={image.preview}
  alt={`${altPrefix} ${index + 1}`}
  fill
  className="object-contain p-4" // cursor: auto (not pointer)
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={index === 0}
/>
```

**Missing Features**:

- ❌ Tap to zoom
- ❌ Pinch-to-zoom gesture
- ❌ Lightbox/modal view
- ❌ Fullscreen gallery
- ❌ Visual affordance (no zoom icon, cursor unchanged)

**Recommendation**:

- Add tap-to-open lightbox modal
- Implement pinch-to-zoom within lightbox
- Add zoom icon overlay on images
- Change cursor to `zoom-in` on hover (desktop)

---

#### Issue 4: Variant Selector Not Visible (Single Variant)

**Severity**: LOW (current) → HIGH (when variants added)
**Impact**: Future scalability concern

**Problem**: The variant selector (color swatches) is conditionally rendered only when `product.variants.length > 1`. Currently TOOLY has only 1 variant (DLC Gunmetal), so no selector appears.

**Code** (`ProductSection.tsx:221`):

```tsx
{
  hasProduct && product.variants.length > 1 && (
    <div className="mb-6">
      <label>Select Color</label>
      <div className="flex flex-wrap gap-3">{/* Color swatches */}</div>
    </div>
  );
}
```

**Current State**: Acceptable for single variant.

**Future Concerns** (when colors added):

- Swatch buttons are 48×48px (`w-12 h-12`) - good touch targets
- `flex-wrap gap-3` will wrap properly
- BUT: Adding 6+ colors will add ~60px height, pushing Add to Cart even further down
- Color labels appear below swatches (tooltip) - may get cut off on mobile

**Recommendation**:

- Consider horizontal scrolling swatch strip instead of wrap
- Or place swatches inline with price
- Test with 6+ variants before launch

---

#### Issue 5: Mobile-Only Carousel Limitations

**Severity**: MEDIUM

**Missing on Mobile** (hidden via `hidden md:flex`):

- Thumbnail strip navigation
- Arrow navigation buttons
- Only dot indicators available

**Impact**:

- Less intuitive navigation than desktop
- Users may not realize there are more images
- Dot indicators are small (8px) and easy to miss

**Recommendation**:

- Add swipe hint animation on first load
- Consider larger dot indicators on mobile
- Or show mini thumbnail strip below dots

---

#### Product Widget Mobile Redesign Recommendations

**Priority 1 - Critical (Conversion Impact)**:

| Issue               | Recommended Fix                                            |
| ------------------- | ---------------------------------------------------------- |
| Add to Cart cut off | Reduce mobile padding: `py-8 md:py-16`, `mb-6 md:mb-12`    |
| No image zoom       | Implement lightbox with pinch-zoom                         |
| Images too small    | Remove `p-4` from carousel images, optimize photo cropping |

**Priority 2 - Important (UX Polish)**:

| Issue               | Recommended Fix                                    |
| ------------------- | -------------------------------------------------- |
| Anchor alignment    | Add `scroll-margin-top: 80px` to `#product`        |
| Variant scalability | Design for 6+ color options with horizontal scroll |
| Carousel navigation | Add swipe indicator, larger dots                   |

**Priority 3 - Nice to Have**:

| Issue                 | Recommended Fix                             |
| --------------------- | ------------------------------------------- |
| Mobile thumbnails     | Show 4-5 mini thumbs below carousel         |
| Image zoom affordance | Add magnifying glass icon overlay           |
| Sticky Add to Cart    | Consider sticky bottom CTA on mobile scroll |

---

### Gallery Section Deep Dive (Mobile)

> **Test Device**: iPhone 16 Pro Max viewport (430×932)
> **Critical Section**: #gallery

#### Current Implementation Analysis

**File**: `src/brands/tooly/sections/GallerySection.tsx`

The gallery is a **static CSS grid** with no carousel functionality:

```tsx
// Line 82 - Static grid, not a carousel
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
```

#### Measurements (iPhone 16 Pro Max - 430px)

| Element           | Value     | Notes               |
| ----------------- | --------- | ------------------- |
| Viewport width    | 430px     | iPhone 16 Pro Max   |
| Container padding | 32px      | `px-4` × 2 sides    |
| Available width   | 398px     | After padding       |
| Grid gap          | 16px      | `gap-4`             |
| Columns           | 2         | `grid-cols-2`       |
| **Image width**   | **183px** | Tiny!               |
| **Image height**  | **103px** | 16:9 aspect ratio   |
| Total images      | 5         | (6 slots available) |

**Result**: Gallery images are only **183×103 pixels** on mobile - far too small to appreciate product details.

---

#### Issue 1: Images Are Extremely Small

**Severity**: HIGH
**Impact**: Users cannot see product details, defeats purpose of gallery

**Problem**: The 2-column grid with 16:9 aspect ratio produces tiny thumbnails.

**Math**:

```
Viewport:        430px
- Padding:       -32px (16px each side)
- Grid gap:      -16px (between 2 columns)
= Available:     382px
÷ 2 columns:     191px per image
× 0.5625 (16:9): 107px height (actual: 103px)
```

**Visual Impact**: Each image is smaller than a typical social media thumbnail. Product details are indiscernible.

---

#### Issue 2: No Carousel Functionality

**Severity**: HIGH
**Impact**: Poor mobile UX, no touch optimization

**Current State**: Static CSS grid with no interactivity.

**Missing Features**:

- ❌ No swipe gestures
- ❌ No horizontal/vertical scrolling
- ❌ No image navigation
- ❌ No active state indicator
- ❌ No momentum scrolling

**Code** (`GallerySection.tsx`):

```tsx
// Just a div grid - no carousel component
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {items.map((item, index) => (
    <div className="group relative overflow-hidden rounded-xl">
      <Image ... />
    </div>
  ))}
</div>
```

---

#### Issue 3: No Zoom/Lightbox

**Severity**: HIGH
**Impact**: Users cannot examine product closely

**Current State**: Images have no click handlers.

```tsx
// Line 114-124 - No onClick, no cursor change
<Image
  src={asset.preview}
  alt={label}
  fill
  className="object-cover ..." // cursor: auto
/>
```

**Missing**:

- ❌ Tap to enlarge
- ❌ Pinch-to-zoom
- ❌ Fullscreen view
- ❌ Lightbox modal
- ❌ Swipe between images in lightbox

---

#### Issue 4: Desktop-Only Hover Effects

**Severity**: LOW
**Impact**: Touch devices get no feedback

**Code**:

```tsx
className = "... group-hover:scale-105"; // Useless on touch
```

The hover overlay with labels only works on desktop. Mobile users see static images with no interaction feedback.

---

#### Issue 5: Wasted Space (Odd Number of Images)

**Severity**: LOW
**Impact**: Asymmetric layout looks incomplete

With 5 images in a 2-column grid:

- Row 1: 2 images
- Row 2: 2 images
- Row 3: 1 image + empty space

The last row looks unfinished and wastes ~50% of that row.

---

#### Recommended Solution: Vertical Touch Carousel

**User Requirement**:

> "The gallery section should be a very robust vertical gallery touch responsive carousel in mobile mode, and also have a smaller carousel under the big image to swipe the finger and quickly select other images."

##### Proposed Mobile Gallery Architecture

```
┌─────────────────────────────────┐
│           GALLERY               │
│   "Every angle showcases..."    │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │                             │ │
│ │      LARGE MAIN IMAGE       │ │  ← Full-width, ~60% viewport
│ │      (swipeable)            │ │  ← Touch to zoom
│ │                             │ │  ← Swipe L/R to change
│ │              🔍             │ │  ← Zoom affordance icon
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐│  ← Thumbnail strip
│   │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 ││  ← Horizontally scrollable
│   └───┘ └───┘ └───┘ └───┘ └───┘│  ← Tap to select
│     ●     ○     ○     ○     ○  │  ← Active indicator
│                                 │
└─────────────────────────────────┘
```

##### Implementation Approach

**Option A: Reuse ProductCarousel Component**

Adapt the existing `ProductCarousel.tsx` for the gallery:

```tsx
// Mobile-only carousel wrapper
<div className="md:hidden">
  <GalleryCarousel
    images={galleryAssets}
    showThumbnails={true}
    enableZoom={true}
  />
</div>

// Keep grid for desktop
<div className="hidden md:grid grid-cols-3 gap-4">
  {/* Existing grid */}
</div>
```

**Option B: New GalleryCarousel Component**

Create a dedicated gallery carousel with:

```tsx
interface GalleryCarouselProps {
  images: GalleryAsset[];
  showThumbnails?: boolean; // Thumbnail strip below
  enableZoom?: boolean; // Tap to lightbox
  thumbnailPosition?: "bottom" | "side";
}

function GalleryCarousel({ images, showThumbnails = true }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image - Full Width */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
        onClick={openLightbox}
      >
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={img.id} className="w-full flex-shrink-0">
              <Image
                src={img.preview}
                alt={img.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 bg-black/50 rounded-full p-2">
          <MagnifyingGlassIcon className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Thumbnail Strip */}
      {showThumbnails && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden",
                "border-2 transition-all",
                activeIndex === i ? "border-[#02fcef]" : "border-white/20",
              )}
            >
              <Image src={img.preview} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

##### Key Features to Implement

| Feature                      | Priority | Description                              |
| ---------------------------- | -------- | ---------------------------------------- |
| **Full-width main image**    | P1       | Single large image, ~60% viewport height |
| **Swipe gestures**           | P1       | Horizontal swipe to change images        |
| **Thumbnail strip**          | P1       | Horizontally scrollable row below main   |
| **Tap thumbnail to select**  | P1       | Instant image switch                     |
| **Active indicator**         | P1       | Visual feedback on current image         |
| **Tap to zoom/lightbox**     | P1       | Fullscreen view with pinch-zoom          |
| **Smooth transitions**       | P2       | CSS transform animations                 |
| **Momentum scrolling**       | P2       | Natural-feeling thumbnail scroll         |
| **Swipe velocity detection** | P3       | Faster swipe = skip images               |

##### Mobile vs Desktop Behavior

| Viewport              | Behavior                                       |
| --------------------- | ---------------------------------------------- |
| **Mobile** (< 768px)  | Vertical carousel with thumbnail strip         |
| **Desktop** (≥ 768px) | Keep existing 3-column grid with hover effects |

##### Measurements for Mobile Carousel

| Element           | Recommended Size                         |
| ----------------- | ---------------------------------------- |
| Main image width  | 100% (398px after padding)               |
| Main image height | 60vh (~560px) or aspect-[4/3]            |
| Thumbnail width   | 64px (`w-16`)                            |
| Thumbnail height  | 64px (`h-16`)                            |
| Thumbnail gap     | 8px (`gap-2`)                            |
| Thumbnail strip   | Horizontally scrollable, shows 5+ thumbs |

##### Visual Comparison

**Current Mobile Gallery** (problematic):

```
┌───────────────────────────┐
│         Gallery           │
│    "Every angle..."       │
│                           │
│  ┌─────┐  ┌─────┐        │
│  │ 183 │  │ 183 │        │  ← Tiny thumbnails
│  │×103 │  │×103 │        │
│  └─────┘  └─────┘        │
│  ┌─────┐  ┌─────┐        │
│  │     │  │     │        │
│  └─────┘  └─────┘        │
│  ┌─────┐                  │  ← Lonely last image
│  │     │  (empty)         │
│  └─────┘                  │
│                           │
└───────────────────────────┘
```

**Recommended Mobile Gallery**:

```
┌───────────────────────────┐
│         Gallery           │
│    "Every angle..."       │
│                           │
│  ┌───────────────────────┐│
│  │                       ││
│  │                       ││
│  │    LARGE IMAGE        ││  ← 398×298px (4:3)
│  │    (tap to zoom)      ││
│  │                       ││
│  │              🔍       ││
│  └───────────────────────┘│
│                           │
│  ┌──┐┌──┐┌──┐┌──┐┌──┐→   │  ← Scrollable thumbnails
│  │1 ││2 ││3 ││4 ││5 │    │     64×64px each
│  └──┘└──┘└──┘└──┘└──┘    │
│   ●   ○   ○   ○   ○      │  ← Active dot
│                           │
└───────────────────────────┘
```

---

#### Gallery Section Priority Fixes

**Priority 1 - Critical**:

| Issue            | Recommended Fix                                 |
| ---------------- | ----------------------------------------------- |
| Tiny images      | Replace grid with full-width carousel on mobile |
| No interactivity | Add swipe gestures and touch handling           |
| No zoom          | Implement lightbox with pinch-zoom              |

**Priority 2 - Important**:

| Issue                   | Recommended Fix                   |
| ----------------------- | --------------------------------- |
| No thumbnail navigation | Add horizontal thumbnail strip    |
| No active indicator     | Highlight current thumbnail       |
| Desktop hover only      | Add touch feedback (scale on tap) |

**Priority 3 - Polish**:

| Issue             | Recommended Fix                   |
| ----------------- | --------------------------------- |
| Odd image count   | Add 6th image or adjust layout    |
| No loading states | Add skeleton/shimmer placeholders |
| No image counter  | Show "3 of 6" indicator           |

---

#### Widget Layout Comparison

**Current Mobile Layout** (problematic):

```
┌─────────────────────────────┐
│         NAVBAR (65px)       │
├─────────────────────────────┤
│      padding-top (64px)     │
│                             │
│   "Choose Your TOOLY"       │
│   subhead text              │
│      margin (48px)          │
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    PRODUCT IMAGE        │ │ ← Image appears small
│ │    (with p-4 padding)   │ │
│ │                         │ │
│ │    ● ● ● ● (dots)       │ │
│ └─────────────────────────┘ │
│                             │
│   TOOLY                     │
│   $109.00                   │
│   ● In Stock...             │
│   ✓ Feature 1               │
│   ✓ Feature 2               │
│   ✓ Feature 3               │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│← VIEWPORT CUTS HERE
│                             │
│   [  ADD TO CART  ]         │ ← CUT OFF!
│   Shipping text             │
│                             │
│      padding-bottom         │
└─────────────────────────────┘
```

**Recommended Mobile Layout**:

```
┌─────────────────────────────┐
│         NAVBAR (65px)       │
├─────────────────────────────┤
│      padding-top (32px)     │ ← Reduced
│                             │
│   "Choose Your TOOLY"       │
│      margin (24px)          │ ← Reduced
│                             │
│ ┌─────────────────────────┐ │
│ │    PRODUCT IMAGE        │ │ ← Larger, edge-to-edge
│ │    (no padding)         │ │
│ │         🔍              │ │ ← Zoom affordance
│ │    ● ● ● ●              │ │
│ └─────────────────────────┘ │
│   TOOLY          $109.00    │ ← Inline price
│   ○ ○ ○ ○ ○ ○ (swatches)   │ ← Horizontal scroll
│   ● In Stock...             │
│   ✓ Feature bullets         │
│                             │
│   [  ADD TO CART  ]         │ ← VISIBLE!
│   Shipping text             │
└─────────────────────────────┘
```

---

### Reviews Section Deep Dive

> **Test Viewports**: Desktop (1440×900), Mobile iPhone 14 Pro Max (430×932)
> **Critical Section**: #reviews

#### Current Implementation Analysis

**File**: `src/brands/tooly/sections/ReviewsSection.tsx`

**CRITICAL NOTE**: All reviews are **HARDCODED PLACEHOLDERS** (lines 20-63). This is acceptable for MVP but must be replaced with real reviews integration before launch.

```tsx
// Line 20-63 - Static hardcoded reviews
const REVIEWS = [
  { id: 1, author: "Alex M.", rating: 5, text: "...", verified: true },
  // ... 6 total hardcoded reviews
];
```

#### Desktop Layout (1440×900)

| Element     | Current State                                   |
| ----------- | ----------------------------------------------- |
| Grid        | `grid md:grid-cols-2 lg:grid-cols-3` (3×2)      |
| Cards       | Static glass cards with hover effect            |
| Animation   | None                                            |
| Trust Badge | "4.9 ★★★★★ Based on 2,500+ reviews" (HARDCODED) |

**Desktop Issues**:

- ❌ No auto-scrolling marquee animation
- ❌ Static grid feels lifeless
- ❌ No visual movement to draw attention
- ❌ Hardcoded "2,500+ reviews" claim

#### Mobile Layout (430×932)

| Element     | Current State                 |
| ----------- | ----------------------------- |
| Grid        | Single column (`grid-cols-1`) |
| Cards       | Full-width stacked vertically |
| Interaction | None - just scroll            |
| Animation   | None                          |

**Mobile Issues**:

- ❌ Just a long vertical list - "terrible" UX
- ❌ No carousel functionality
- ❌ No horizontal swipe navigation
- ❌ User must scroll through all 6 reviews
- ❌ No touch-friendly navigation

---

#### Recommended Solution: Review Carousel with Auto-Scroll

**User Requirement**:

> "Reviews should show as a touch friendly carousel, single or maybe double (one review or two reviews at a time TBD) and we should be able to navigate through the reviews horizontally. Also if the user is not interacting the reviews should animate and constantly move to the left so it looks alive and cool (this should happen in desktop, TBD if this feature looks good on mobile but definitely on desktop)."

##### Proposed Architecture

**Desktop Behavior**:

```
┌─────────────────────────────────────────────────────────────────┐
│                  What Our Customers Say                          │
│         Join thousands of satisfied customers...                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ← ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ →           │
│    │ Review  │ │ Review  │ │ Review  │ │ Review  │  AUTO-SCROLL │
│    │   1     │ │   2     │ │   3     │ │   4     │  ←←←←←←←←←  │
│    │ ★★★★★   │ │ ★★★★★   │ │ ★★★★☆   │ │ ★★★★★   │             │
│    └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                  │
│              ○ ○ ● ○ ○ ○  (navigation dots)                     │
│                                                                  │
│                    4.9 ★★★★★ Based on X reviews                 │
└─────────────────────────────────────────────────────────────────┘

Features:
- Shows 3-4 reviews at a time
- Auto-scrolls left continuously (marquee style)
- Pauses on hover
- Click arrows or dots to navigate
- Smooth infinite loop animation
```

**Mobile Behavior**:

```
┌───────────────────────────┐
│  What Our Customers Say   │
│                           │
│ ┌───────────────────────┐ │
│ │      ★★★★★            │ │
│ │                       │ │  ← Show 1-2 reviews
│ │  "Review text here"   │ │    at a time
│ │                       │ │
│ │  👤 Alex M.           │ │  ← Swipe L/R to
│ │  ✓ Verified Purchase  │ │    navigate
│ └───────────────────────┘ │
│                           │
│    ← ○ ● ○ ○ ○ ○ →       │  ← Dot indicators
│                           │
│   4.9 ★★★★★ Based on X   │
└───────────────────────────┘

Features:
- Touch swipe gestures (horizontal)
- 1-2 reviews visible at a time (TBD)
- Dot navigation
- Optional: auto-scroll when idle (test this)
```

##### Implementation Approach

**Option A: CSS Marquee Animation (Desktop)**

```tsx
function ReviewsMarquee({ reviews, speed = 30 }: Props) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={cn(
          "flex gap-6 animate-marquee",
          isPaused && "animation-play-state-paused"
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {/* Duplicate reviews for seamless loop */}
        {[...reviews, ...reviews].map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

// CSS
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee linear infinite;
}
```

**Option B: Swiper/Embla Carousel (Mobile)**

```tsx
function ReviewsCarousel({ reviews }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  // Auto-scroll on desktop
  useEffect(() => {
    if (!emblaApi || isMobile) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex gap-4">
        {reviews.map((review) => (
          <div className="flex-[0_0_100%] md:flex-[0_0_33%]">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

##### Key Features to Implement

| Feature                   | Desktop      | Mobile      | Priority |
| ------------------------- | ------------ | ----------- | -------- |
| **Auto-scroll animation** | ✅ Required  | TBD (test)  | P1       |
| **Pause on hover**        | ✅ Required  | N/A         | P1       |
| **Horizontal swipe**      | Nice-to-have | ✅ Required | P1       |
| **Dot navigation**        | ✅ Required  | ✅ Required | P1       |
| **Arrow buttons**         | ✅ Required  | Optional    | P2       |
| **Infinite loop**         | ✅ Required  | ✅ Required | P1       |
| **Smooth transitions**    | ✅ Required  | ✅ Required | P1       |

##### Real Reviews Integration Path

**Phase 1 (Current)**: Hardcoded placeholder reviews
**Phase 2**: Connect to reviews service (options):

- Judge.me
- Yotpo
- Stamped.io
- Custom Vendure reviews plugin

**Data structure needed**:

```typescript
interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
  verified: boolean;
  productId?: string;
  helpfulCount?: number;
  images?: string[];
}
```

---

### Credibility Section Deep Dive ("Trusted by Professionals")

> **Test Viewports**: Desktop (1440×900), Mobile iPhone 14 Pro Max (430×932)
> **Critical Section**: #credibility

#### Current Implementation Analysis

**File**: `src/brands/tooly/sections/CredibilitySection.tsx`

**CRITICAL NOTE**: Stats are **HARDCODED** (line 24-29). These claims ("10,000+ Happy Customers", "4.9 Average Rating", "99% Satisfaction Rate") must be verified or made CMS-driven.

```tsx
// Line 24-29 - HARDCODED stats (potential legal issue)
const STATS = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "4.9", label: "Average Rating", stars: true },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "2 Year", label: "Warranty" },
];
```

#### Desktop Layout (1440×900)

| Element      | Current State            |
| ------------ | ------------------------ |
| Stats Grid   | 4-column grid            |
| Trust Badges | 4-column row below stats |
| Visual       | Static glass cards       |
| Animation    | None                     |

**Desktop Assessment**: Layout is clean but static. Could benefit from subtle animations or count-up effects on stats.

#### Mobile Layout (430×932)

| Element      | Current State                                            |
| ------------ | -------------------------------------------------------- |
| Stats Grid   | 2×2 grid                                                 |
| Trust Badges | 2×2 grid                                                 |
| Text         | **TRUNCATED** - "Secure..." instead of "Secure Checkout" |
| Animation    | None                                                     |

**Mobile Issues**:

- ⚠️ Trust badge text truncates (uses `line-clamp-1`)
- ❌ Static, no visual interest
- ❌ Stats could use count-up animation
- ❌ No touch interactivity

---

#### Recommended Improvements

##### 1. Fix Trust Badge Truncation (P1)

```tsx
// Current (problematic)
<span className="text-sm font-medium text-white/80 line-clamp-1">
  {badge.title}
</span>

// Recommended options:
// Option A: Allow wrapping
<span className="text-sm font-medium text-white/80">
  {badge.title}
</span>

// Option B: Smaller text on mobile
<span className="text-xs sm:text-sm font-medium text-white/80 line-clamp-2">
  {badge.title}
</span>

// Option C: Stack icon above text on mobile
<div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
  <TrustIcon />
  <div className="text-center md:text-left">...</div>
</div>
```

##### 2. Stats Count-Up Animation (P2)

```tsx
function AnimatedStat({ value, label }: Props) {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(value.replace(/\D/g, ""));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        // Animate count from 0 to target
        animateCount(0, targetValue, 2000, setCount);
      }
    });
    // ...
  }, []);

  return <div className="text-3xl font-bold">{count.toLocaleString()}+</div>;
}
```

##### 3. Visual Enhancements (P3)

| Enhancement      | Description                            |
| ---------------- | -------------------------------------- |
| Gradient borders | Subtle animated gradient on stat cards |
| Icon animations  | Pulse or glow on trust badges          |
| Stagger entrance | Cards animate in sequence on scroll    |
| Hover lift       | Cards lift slightly on hover (desktop) |

##### Mobile Layout Recommendation

```
Current Mobile (2×2 cramped):       Recommended (Vertical stack):
┌─────────┐ ┌─────────┐            ┌─────────────────────────┐
│ 10,000+ │ │  4.9★   │            │  10,000+ Happy Customers│
└─────────┘ └─────────┘            ├─────────────────────────┤
┌─────────┐ ┌─────────┐            │  4.9 ★★★★★ Avg Rating  │
│   99%   │ │ 2 Year  │            ├─────────────────────────┤
└─────────┘ └─────────┘            │  99% Satisfaction Rate  │
                                   ├─────────────────────────┤
┌────────┐ ┌────────┐              │  2 Year Warranty        │
│Secure..│ │Premium.│              └─────────────────────────┘
└────────┘ └────────┘
┌────────┐ ┌────────┐              Trust badges as horizontal
│Easy Re.│ │Support │              scrolling strip below
└────────┘ └────────┘
```

---

### Technology Section Deep Dive ("Engineered for Excellence")

> **Test Viewports**: Desktop (1440×900), Mobile iPhone 14 Pro Max (430×932)
> **Critical Section**: #technology

#### Current Implementation Analysis

**File**: `src/brands/tooly/sections/TechnologySection.tsx`

```tsx
// Line 149 - Static grid layout
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {displayFeatures.map((feature, index) => (
    <div className="group p-6 rounded-xl ...">{/* Static feature card */}</div>
  ))}
</div>
```

#### Desktop Layout (1440×900)

| Element   | Current State                               |
| --------- | ------------------------------------------- |
| Grid      | 3×2 grid (6 feature cards)                  |
| Cards     | Glass cards with icon + title + description |
| Hover     | Background brightens, icon color changes    |
| Animation | None (except hover)                         |

**Desktop Assessment**: Functional but static. Could benefit from being a carousel.

#### Mobile Layout (430×932)

| Element     | Current State                   |
| ----------- | ------------------------------- |
| Grid        | Single column (6 stacked cards) |
| Cards       | Full-width, stacked vertically  |
| Interaction | None - just scroll              |
| Animation   | None                            |

**Mobile Issues**:

- ❌ Long vertical list - requires lots of scrolling
- ❌ No carousel functionality
- ❌ Not interactive or engaging
- ❌ All 6 cards visible at once creates visual overwhelm

---

#### Recommended Solution: Feature Carousel (2-3 Stack)

**User Requirement**:

> "The Engineered for Excellence section should be also a carousel maybe a 2 or three stack. The goal is to have a mobile friendly and interactive experience not just a long list of elements."

##### Proposed Mobile Layout

```
┌─────────────────────────────┐
│  Engineered for Excellence  │
│    Every detail has been... │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │  ⚙️ Precision         │  │  ← Card 1 (visible)
│  │     Machining         │  │
│  │  CNC-machined from... │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │  💨 Optimized         │  │  ← Card 2 (visible)
│  │     Airflow           │  │
│  │  Engineered chamber...│  │
│  └───────────────────────┘  │
│                             │
│    ← ○ ● ○ →               │  ← Page indicators (3 pages of 2)
│                             │
└─────────────────────────────┘

- Show 2 cards at a time (or 3 TBD)
- Swipe horizontally to see more
- 3 pages: [1,2] [3,4] [5,6]
```

##### Desktop Layout Option

```
Desktop could also benefit from a carousel:

┌─────────────────────────────────────────────────────────────┐
│               Engineered for Excellence                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ←  ┌─────────┐ ┌─────────┐ ┌─────────┐  →                 │
│     │Feature 1│ │Feature 2│ │Feature 3│                     │
│     └─────────┘ └─────────┘ └─────────┘                     │
│                                                              │
│              ○ ● ○  (showing page 2 of 2)                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘

OR keep 3×2 grid on desktop, only carousel on mobile
```

##### Implementation Approach

```tsx
function TechnologyCarousel({ features }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const cardsPerPage = isMobile ? 2 : 3;

  if (!isMobile) {
    // Keep existing grid for desktop (or convert to carousel)
    return <TechnologyGrid features={features} />;
  }

  return (
    <Carousel slidesToShow={cardsPerPage}>
      {features.map((feature) => (
        <FeatureCard key={feature.icon} feature={feature} />
      ))}
    </Carousel>
  );
}
```

##### Key Features to Implement

| Feature               | Mobile      | Desktop         | Priority |
| --------------------- | ----------- | --------------- | -------- |
| **Carousel view**     | ✅ Required | Optional        | P1       |
| **2-3 cards visible** | ✅ 2 cards  | 3 cards or grid | P1       |
| **Swipe gestures**    | ✅ Required | Nice-to-have    | P1       |
| **Page indicators**   | ✅ Required | ✅ Required     | P1       |
| **Arrow navigation**  | Optional    | ✅ Required     | P2       |
| **Auto-advance**      | Optional    | Optional        | P3       |

---

### Section Priority Summary

| Section         | Mobile Priority | Desktop Priority | Key Changes Needed             |
| --------------- | --------------- | ---------------- | ------------------------------ |
| **Reviews**     | HIGH            | HIGH             | Carousel + auto-scroll marquee |
| **Credibility** | MEDIUM          | LOW              | Fix truncation, add count-up   |
| **Technology**  | HIGH            | LOW              | Convert to 2-3 card carousel   |
| **FAQ**         | LOW             | LOW              | Looks good as-is               |

### Shared Carousel Component Opportunity

All three sections could share a base carousel component:

```tsx
interface BaseCarouselProps {
  children: React.ReactNode[];
  slidesToShow: number;
  autoScroll?: boolean;
  autoScrollSpeed?: number;
  showDots?: boolean;
  showArrows?: boolean;
  pauseOnHover?: boolean;
  loop?: boolean;
}

function BaseCarousel(props: BaseCarouselProps) {
  // Shared carousel logic using Embla or custom implementation
}

// Usage:
<BaseCarousel slidesToShow={2} autoScroll loop>
  {reviews.map(r => <ReviewCard {...r} />)}
</BaseCarousel>

<BaseCarousel slidesToShow={2} showDots>
  {features.map(f => <FeatureCard {...f} />)}
</BaseCarousel>
```

---

_End of WO-DESIGN-AUDIT-01_
