# Asset Import Guide

This folder is used to bulk-import product images into Vendure.

## Usage

1. Place your product images in this folder
2. Update `map.json` if needed (maps SKU → image filename)
3. Run: `pnpm --filter @shofar/vendure run bulk:assets`

## Expected Files

Based on `map.json`, add the following images:

### TOOLY Main Product Variants

- `tooly-dlc-gunmetal.png` - DLC Gunmetal finish
- `tooly-cerakote-midnight.png` - Cerakote Midnight Black
- `tooly-cerakote-arctic.png` - Cerakote Arctic White
- `tooly-cerakote-ember.png` - Cerakote Ember Orange
- `tooly-cerakote-cobalt.png` - Cerakote Cobalt Blue
- `tooly-cerakote-titanium.png` - Cerakote Titanium Silver

### Accessories

- `accessory-case-vial.png` - Silicone Case + Glass Vial
- `accessory-chain-gold.png` - Carry Chain Gold
- `accessory-chain-silver.png` - Carry Chain Silver
- `accessory-cleaning-kit.png` - Cleaning Kit
- `accessory-silicone-case.png` - Silicone Case Only

## Recommended Specs

- Format: PNG or WebP
- Dimensions: 800x800px minimum (square)
- Background: Transparent or white/light gray
- Quality: High resolution for zoom

## Notes

- The script is idempotent - running it again won't duplicate assets
- Assets are attached to both variants and their parent products
- Operates in the `tooly` channel
