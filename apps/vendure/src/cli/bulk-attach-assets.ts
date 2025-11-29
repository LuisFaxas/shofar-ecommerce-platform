/**
 * Bulk Asset Import CLI
 *
 * Reads a map.json file that maps SKU → image file path
 * and attaches images to products/variants in Vendure.
 *
 * Usage:
 *   1. Create assets-import/map.json with SKU → file path mappings
 *   2. Place image files in assets-import/ folder
 *   3. Run: pnpm --filter @shofar/vendure run bulk:assets
 *
 * map.json format:
 * {
 *   "TOOLY-DLC-GM": "./assets-import/tooly-gunmetal.png",
 *   "ACC-CASE-VIAL": "./assets-import/case-vial.png"
 * }
 *
 * Features:
 * - Idempotent: skips if asset already attached
 * - Channel-scoped: operates in 'tooly' channel
 * - Supports products and variants by SKU
 */

// Production guard
if (process.env.NODE_ENV === 'production') {
  throw new Error('Do not run asset import scripts in production!');
}

import { bootstrap } from '@vendure/core';
import { config } from '../vendure-config';
import {
  ChannelService,
  RequestContext,
  ProductService,
  ProductVariantService,
  AssetService,
  LanguageCode,
  Channel,
} from '@vendure/core';
import * as fs from 'fs';
import * as path from 'path';

interface AssetMap {
  [sku: string]: string; // SKU -> file path
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const ASSETS_DIR = path.join(__dirname, '../../assets-import');
const MAP_FILE = path.join(ASSETS_DIR, 'map.json');

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

async function findVariantBySku(
  ctx: RequestContext,
  variantService: ProductVariantService,
  sku: string
) {
  const result = await variantService.findAll(ctx, {
    filter: { sku: { eq: sku } },
    take: 1,
  });
  return result.items[0];
}

async function uploadAndAttachAsset(
  ctx: RequestContext,
  assetService: AssetService,
  productService: ProductService,
  variantService: ProductVariantService,
  sku: string,
  filePath: string
): Promise<boolean> {
  // Find variant by SKU
  const variant = await findVariantBySku(ctx, variantService, sku);

  if (!variant) {
    console.log(`  ⚠️  SKU not found: ${sku}`);
    return false;
  }

  // Check if variant already has a featured asset
  if (variant.featuredAssetId) {
    console.log(`  ⏭️  SKU ${sku} already has featured asset (skipping)`);
    return true;
  }

  // Resolve absolute path
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log(`  ❌ File not found: ${absolutePath}`);
    return false;
  }

  // Read file
  const fileBuffer = fs.readFileSync(absolutePath);
  const fileName = path.basename(absolutePath);
  const mimeType = getMimeType(absolutePath);

  console.log(`  📤 Uploading ${fileName} for ${sku}...`);

  // Create asset
  const asset = await assetService.create(ctx, {
    file: {
      filename: fileName,
      mimetype: mimeType,
      createReadStream: () => {
        const { Readable } = require('stream');
        return Readable.from(fileBuffer);
      },
    },
  });

  if (!asset || 'message' in asset) {
    console.log(`  ❌ Failed to create asset: ${(asset as any)?.message || 'Unknown error'}`);
    return false;
  }

  // Attach to variant as featured asset
  await variantService.update(ctx, [{
    id: variant.id,
    featuredAssetId: asset.id,
    assetIds: [asset.id],
  }]);

  // Also attach to parent product if it doesn't have one
  const product = await productService.findOne(ctx, variant.productId);
  if (product && !product.featuredAssetId) {
    await productService.update(ctx, {
      id: product.id,
      featuredAssetId: asset.id,
      assetIds: [...(product.assets?.map(a => a.id) || []), asset.id],
    });
    console.log(`  ✅ Attached to variant ${sku} and product ${product.slug}`);
  } else {
    console.log(`  ✅ Attached to variant ${sku}`);
  }

  return true;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function bulkAttachAssets() {
  console.log('\n========================================');
  console.log('Bulk Asset Import');
  console.log('========================================\n');

  // Check if map file exists
  if (!fs.existsSync(MAP_FILE)) {
    console.log(`Map file not found: ${MAP_FILE}`);
    console.log('\nTo use this script:');
    console.log('1. Create folder: apps/vendure/assets-import/');
    console.log('2. Create map.json with SKU → file path mappings');
    console.log('3. Place image files in the folder');
    console.log('\nExample map.json:');
    console.log(JSON.stringify({
      'TOOLY-DLC-GM': './assets-import/tooly-gunmetal.png',
      'ACC-CASE-VIAL': './assets-import/case-vial.png',
    }, null, 2));
    process.exit(0);
  }

  // Read map file
  const mapContent = fs.readFileSync(MAP_FILE, 'utf-8');
  const assetMap: AssetMap = JSON.parse(mapContent);
  const entries = Object.entries(assetMap);

  if (entries.length === 0) {
    console.log('No entries in map.json');
    process.exit(0);
  }

  console.log(`Found ${entries.length} SKU mappings\n`);

  const app = await bootstrap(config);

  const channelService = app.get(ChannelService);
  const productService = app.get(ProductService);
  const variantService = app.get(ProductVariantService);
  const assetService = app.get(AssetService);

  try {
    // Get tooly channel
    const defaultChannel = await channelService.getDefaultChannel();
    const initialCtx = new RequestContext({
      channel: defaultChannel,
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      apiType: 'admin',
    });

    const channels = await channelService.findAll(initialCtx);
    const toolyChannel = channels.items.find((c: Channel) => c.code === 'tooly');

    if (!toolyChannel) {
      throw new Error('tooly channel not found! Run setup first.');
    }

    const ctx = new RequestContext({
      channel: toolyChannel,
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      apiType: 'admin',
    });

    console.log(`Channel: ${toolyChannel.code}\n`);

    // Process each SKU
    let success = 0;
    let skipped = 0;
    let failed = 0;

    for (const [sku, filePath] of entries) {
      console.log(`Processing: ${sku}`);
      const result = await uploadAndAttachAsset(
        ctx,
        assetService,
        productService,
        variantService,
        sku,
        filePath
      );

      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    // Summary
    console.log('\n========================================');
    console.log('IMPORT COMPLETE');
    console.log('========================================');
    console.log(`Total: ${entries.length}`);
    console.log(`Success: ${success}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Failed: ${failed}`);
    console.log('========================================\n');

  } catch (error: any) {
    console.error('\nIMPORT ERROR:', error?.message || error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run
bulkAttachAssets()
  .then(() => {
    console.log('Asset import completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Asset import failed:', error);
    process.exit(1);
  });
