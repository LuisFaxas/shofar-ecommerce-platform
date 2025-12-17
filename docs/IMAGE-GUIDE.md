# TOOLY Store Image Guide

## Quick Reference

| Location           | Source                  | Aspect Ratio | Min Size  | Best Format |
| ------------------ | ----------------------- | ------------ | --------- | ----------- |
| **Hero**           | Product `featuredAsset` | 16:9         | 1920x1080 | PNG/WebP    |
| **Gallery**        | Product `assets[0-5]`   | 1:1 + 16:9   | 1200x1200 | JPG/WebP    |
| **Product Card**   | Variant `featuredAsset` | 4:5          | 800x1000  | JPG/WebP    |
| **Cart Thumbnail** | Variant `featuredAsset` | 1:1          | 200x200   | JPG/WebP    |

---

## Image Types Explained

### 1. HERO IMAGE (Product Featured Asset)

**Where it shows:** Homepage hero section, large centered display

**Requirements:**

- **Aspect Ratio:** 16:9 (landscape)
- **Min Resolution:** 1920 x 1080px
- **Display Mode:** `object-contain` (product centered, won't crop)
- **Background:** Transparent or dark (#0b0e14) preferred

**Best Practice:**

- Clean product shot, centered
- Leave padding around the product
- Works best with transparent PNG
- This is your "hero shot" - make it stunning

**Vendure Location:** `Product > Featured Asset`

---

### 2. GALLERY IMAGES (Product Assets Array)

**Where it shows:** Gallery section grid (6 images max)

**Requirements:**

- **Image 1 (Featured):** 1:1 square (1200x1200px) - spans 2 columns
- **Images 2-6:** 16:9 landscape (1920x1080px)
- **Display Mode:** `object-cover` (will crop to fit)

**Best Practice:**

- Image 1: Best angle, hero-worthy shot
- Image 2: Side profile
- Image 3: Detail/close-up shot
- Image 4: Product in use / lifestyle
- Image 5: Components or parts
- Image 6: With accessories

**Vendure Location:** `Product > Assets` (drag to reorder, first = featured in gallery)

---

### 3. VARIANT IMAGES (ProductCard Display)

**Where it shows:** Product selection cards, accessory cards, cart

**Requirements:**

- **Aspect Ratio:** 4:5 (portrait) or 1:1 (square)
- **Min Resolution:** 800 x 1000px (4:5) or 800x800px (1:1)
- **Display Mode:** `object-cover` (will crop)

**Best Practice:**

- Center the product in frame
- Leave ~10% margin from edges (cropping safe zone)
- Consistent lighting across all variants
- Same angle for all color variants

**Vendure Location:** `Product Variant > Featured Asset`

---

## Vendure Upload Workflow

### Step 1: Main Product Images

```
Admin > Catalog > Products > TOOLY
├── Featured Asset: hero-tooly.png (1920x1080, transparent)
└── Assets (drag to reorder):
    ├── [1] gallery-hero.jpg (1200x1200, main angle)
    ├── [2] gallery-side.jpg (1920x1080)
    ├── [3] gallery-detail.jpg (1920x1080)
    ├── [4] gallery-lifestyle.jpg (1920x1080)
    ├── [5] gallery-components.jpg (1920x1080)
    └── [6] gallery-accessories.jpg (1920x1080)
```

### Step 2: Variant Images

```
Admin > Catalog > Products > TOOLY > Variants
├── TOOLY-DLC-GM (Gunmetal)
│   └── Featured Asset: variant-dlc-gunmetal.jpg (800x1000)
├── TOOLY-CK-MID (Midnight)
│   └── Featured Asset: variant-cerakote-midnight.jpg (800x1000)
├── TOOLY-CK-ARC (Arctic)
│   └── Featured Asset: variant-cerakote-arctic.jpg (800x1000)
... etc for each variant
```

### Step 3: Accessory Products

```
Admin > Catalog > Products > [Each Accessory]
├── Featured Asset: accessory-name.jpg (800x1000)
└── Variant > Featured Asset: (same or different angle)
```

---

## Naming Convention

```
[type]-[product]-[variant/description].[ext]

Examples:
hero-tooly-main.png           # Hero image (transparent)
gallery-tooly-front.jpg       # Gallery image 1
gallery-tooly-side.jpg        # Gallery image 2
gallery-tooly-detail.jpg      # Gallery image 3
variant-tooly-dlc-gunmetal.jpg
variant-tooly-cerakote-midnight.jpg
accessory-chain-gold.jpg
accessory-case-vial.jpg
```

---

## Bulk Import (CLI)

For bulk variant images, use the assets-import folder:

```
apps/vendure/assets-import/
├── map.json              # SKU to file mapping
├── variant-dlc-gm.jpg
├── variant-ck-mid.jpg
└── ... etc
```

**map.json format:**

```json
{
  "TOOLY-DLC-GM": "./assets-import/variant-dlc-gm.jpg",
  "TOOLY-CK-MID": "./assets-import/variant-ck-mid.jpg",
  "ACC-CHAIN-GLD": "./assets-import/accessory-chain-gold.jpg"
}
```

**Run import:**

```bash
pnpm --filter @shofar/vendure run bulk:assets
```

---

## Image Optimization Tips

1. **Format Priority:**
   - WebP for best compression (if supported)
   - PNG for transparent backgrounds
   - JPG for photos/lifestyle shots

2. **File Size Targets:**
   - Hero: < 500KB
   - Gallery: < 300KB each
   - Variants: < 200KB each
   - Thumbnails: < 50KB

3. **Tools:**
   - [Squoosh](https://squoosh.app/) - Free online optimizer
   - [TinyPNG](https://tinypng.com/) - PNG/JPG compression
   - Photoshop "Export for Web"

---

## Current Status

| Image Type       | Count Needed | Uploaded | Status  |
| ---------------- | ------------ | -------- | ------- |
| Hero (TOOLY)     | 1            | 1        | ✅      |
| Gallery (TOOLY)  | 6            | 0        | ❌ Need |
| Variants (TOOLY) | 6            | 6        | ✅      |
| Accessories      | 5            | 5        | ✅      |

**Missing:** Gallery images (upload via Admin > Products > TOOLY > Assets)

---

## Quick Checklist

- [ ] Hero image uploaded (Product > Featured Asset)
- [ ] 6 gallery images uploaded (Product > Assets)
- [ ] Each variant has its own image (Variant > Featured Asset)
- [ ] Each accessory has an image
- [ ] All images are optimized (< 500KB)
- [ ] Consistent styling across all images
