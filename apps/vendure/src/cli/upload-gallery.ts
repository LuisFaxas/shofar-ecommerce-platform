/**
 * Upload Gallery Images CLI
 *
 * Uploads images to a product's assets[] gallery array.
 * First image becomes featuredAsset for both product and variant.
 *
 * Usage: npx ts-node src/cli/upload-gallery.ts
 */

if (process.env.NODE_ENV === "production") {
  throw new Error("Do not run in production!");
}

import { bootstrap } from "@vendure/core";
import { config } from "../vendure-config";
import {
  ChannelService,
  RequestContext,
  ProductService,
  ProductVariantService,
  AssetService,
  LanguageCode,
  Channel,
} from "@vendure/core";
import * as fs from "fs";
import * as path from "path";

const ASSETS_DIR = path.join(__dirname, "../../assets-import");
const PRODUCT_SLUG = "tooly";

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return ext === ".png" ? "image/png" : "image/jpeg";
}

async function uploadGallery() {
  console.log("\n========================================");
  console.log("Gallery Image Upload");
  console.log("========================================\n");

  // Get all jpg files in assets-import
  const files = fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => f.endsWith(".jpg") || f.endsWith(".png"))
    .sort();

  if (files.length === 0) {
    console.log("No images found in assets-import/");
    process.exit(0);
  }

  console.log(`Found ${files.length} images: ${files.join(", ")}\n`);

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
      apiType: "admin",
    });

    const channels = await channelService.findAll(initialCtx);
    const toolyChannel = channels.items.find(
      (c: Channel) => c.code === "tooly",
    );

    if (!toolyChannel) {
      throw new Error("tooly channel not found!");
    }

    const ctx = new RequestContext({
      channel: toolyChannel,
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      apiType: "admin",
    });

    // Find product
    const products = await productService.findAll(ctx, {
      filter: { slug: { eq: PRODUCT_SLUG } },
    });
    const toolyProduct = products.items[0];

    if (!toolyProduct) {
      throw new Error(`Product "${PRODUCT_SLUG}" not found!`);
    }

    console.log(`Product: ${toolyProduct.name} (ID: ${toolyProduct.id})\n`);

    // Upload each image
    const assetIds: string[] = [];
    let featuredAssetId: string | null = null;

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]!;
      const filePath = path.join(ASSETS_DIR, fileName);
      const fileBuffer = fs.readFileSync(filePath);
      const mimeType: string = getMimeType(filePath);

      console.log(`  📤 Uploading ${fileName}...`);

      const asset = await assetService.create(ctx, {
        file: {
          filename: fileName,
          mimetype: mimeType as string,
          createReadStream: () => {
            const { Readable } = require("stream");
            return Readable.from(fileBuffer);
          },
        },
      });

      if (!asset || "message" in asset) {
        console.log(
          `  ❌ Failed: ${(asset as any)?.message || "Unknown error"}`,
        );
        continue;
      }

      assetIds.push(asset.id.toString());
      console.log(`  ✅ Created asset ID: ${asset.id}`);

      // First image is the featured asset
      if (i === 0) {
        featuredAssetId = asset.id.toString();
      }
    }

    if (assetIds.length === 0) {
      throw new Error("No assets were created!");
    }

    // Update product with all assets
    console.log(`\n  📎 Attaching ${assetIds.length} assets to product...`);
    await productService.update(ctx, {
      id: toolyProduct.id,
      featuredAssetId: featuredAssetId!,
      assetIds: assetIds,
    });
    console.log(`  ✅ Product updated with gallery`);

    // Update variant with featured asset
    const variants = await variantService.findAll(ctx, {
      filter: { sku: { eq: "TOOLY-DLC-GM" } },
    });

    if (variants.items[0]) {
      console.log(`  📎 Setting variant featuredAsset...`);
      await variantService.update(ctx, [
        {
          id: variants.items[0].id,
          featuredAssetId: featuredAssetId!,
        },
      ]);
      console.log(`  ✅ Variant updated`);
    }

    console.log("\n========================================");
    console.log("UPLOAD COMPLETE");
    console.log("========================================");
    console.log(`Gallery images: ${assetIds.length}`);
    console.log(`Featured asset: ${featuredAssetId}`);
    console.log("========================================\n");
  } catch (error: any) {
    console.error("\nERROR:", error?.message || error);
    throw error;
  } finally {
    await app.close();
  }
}

uploadGallery()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
