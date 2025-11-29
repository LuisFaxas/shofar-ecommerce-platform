/**
 * TOOLY Full Seed Script
 *
 * Creates demo products for development/testing.
 * - Idempotent: Upserts by slug/sku (NO deletes)
 * - Channel-scoped: All writes to 'tooly' channel only
 * - Manual only: NOT called from init-vendure.ts
 *
 * Run with: pnpm --filter @shofar/vendure run seed:tooly
 */

// Production guard - NEVER run in production
if (process.env.NODE_ENV === 'production') {
  throw new Error('Do not run seed scripts in production!');
}

import { bootstrap } from '@vendure/core';
import { config } from '../vendure-config';
import {
  ChannelService,
  RequestContext,
  ProductService,
  ProductVariantService,
  CollectionService,
  FacetService,
  FacetValueService,
  LanguageCode,
  Channel,
  Facet,
  FacetValue,
  Product,
  ID,
} from '@vendure/core';

// ============================================================================
// PRODUCT DATA
// ============================================================================

const TOOLY_VARIANTS = [
  {
    name: 'TOOLY - DLC Gunmetal',
    sku: 'TOOLY-DLC-GM',
    price: 14900, // $149.00
    color: 'gunmetal',
    finish: 'dlc',
    stock: 100,
  },
  {
    name: 'TOOLY - Cerakote Midnight',
    sku: 'TOOLY-CK-MID',
    price: 16900, // $169.00
    color: 'black',
    finish: 'cerakote',
    stock: 75,
  },
  {
    name: 'TOOLY - Cerakote Arctic',
    sku: 'TOOLY-CK-ARC',
    price: 16900,
    color: 'white',
    finish: 'cerakote',
    stock: 50,
  },
  {
    name: 'TOOLY - Cerakote Ember',
    sku: 'TOOLY-CK-EMB',
    price: 16900,
    color: 'orange',
    finish: 'cerakote',
    stock: 50,
  },
  {
    name: 'TOOLY - Cerakote Cobalt',
    sku: 'TOOLY-CK-COB',
    price: 16900,
    color: 'blue',
    finish: 'cerakote',
    stock: 50,
  },
  {
    name: 'TOOLY - Cerakote Titanium',
    sku: 'TOOLY-CK-TIT',
    price: 18900, // $189.00 - premium
    color: 'silver',
    finish: 'cerakote',
    stock: 25,
  },
];

const ACCESSORIES = [
  {
    name: 'Silicone Case + Glass Vial',
    slug: 'silicone-case-glass-vial',
    sku: 'ACC-CASE-VIAL',
    price: 2499, // $24.99
    description: 'Premium silicone protective case with integrated borosilicate glass vial.',
    stock: 200,
  },
  {
    name: 'Carry Chain - Gold',
    slug: 'carry-chain-gold',
    sku: 'ACC-CHAIN-GLD',
    price: 1999, // $19.99
    description: '18K gold-plated stainless steel chain for discreet carry.',
    stock: 150,
  },
  {
    name: 'Carry Chain - Silver',
    slug: 'carry-chain-silver',
    sku: 'ACC-CHAIN-SLV',
    price: 1999,
    description: 'Brushed stainless steel chain for discreet carry.',
    stock: 150,
  },
  {
    name: 'Cleaning Kit',
    slug: 'cleaning-kit',
    sku: 'ACC-CLEAN-KIT',
    price: 999, // $9.99
    description: 'Complete cleaning kit with precision brushes and cleaning solution.',
    stock: 300,
  },
];

// Facet definitions
const FINISH_FACET = {
  code: 'finish',
  name: 'Finish',
  values: [
    { code: 'dlc', name: 'DLC (Diamond-Like Coating)' },
    { code: 'cerakote', name: 'Cerakote' },
  ],
};

const COLOR_EXTENSIONS = [
  { code: 'gunmetal', name: 'Gunmetal' },
  { code: 'white', name: 'Arctic White' },
  { code: 'orange', name: 'Ember Orange' },
  { code: 'blue', name: 'Cobalt Blue' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getOrCreateFacet(
  ctx: RequestContext,
  facetService: FacetService,
  code: string,
  name: string,
): Promise<Facet> {
  const existing = await facetService.findByCode(ctx, code, LanguageCode.en);
  if (existing) {
    console.log(`  Found existing facet: ${code}`);
    return existing;
  }

  console.log(`  Creating facet: ${code}`);
  return facetService.create(ctx, {
    code,
    isPrivate: false,
    translations: [{ languageCode: LanguageCode.en, name }],
    values: [],
  });
}

async function getOrCreateFacetValue(
  ctx: RequestContext,
  facetService: FacetService,
  facetValueService: FacetValueService,
  facet: Facet,
  code: string,
  name: string,
): Promise<FacetValue> {
  // Reload facet to get latest values
  const updatedFacet = await facetService.findByCode(ctx, facet.code, LanguageCode.en);
  const existing = updatedFacet?.values?.find((v: FacetValue) => v.code === code);
  if (existing) {
    console.log(`    Found existing facet value: ${code}`);
    return existing;
  }

  console.log(`    Creating facet value: ${code}`);
  return facetValueService.create(ctx, facet, {
    code,
    translations: [{ languageCode: LanguageCode.en, name }],
  });
}

async function findProductBySlug(
  ctx: RequestContext,
  productService: ProductService,
  slug: string,
): Promise<Product | undefined> {
  const result = await productService.findAll(ctx, {
    filter: { slug: { eq: slug } },
    take: 1,
  });
  return result.items[0];
}

async function findVariantBySku(
  ctx: RequestContext,
  variantService: ProductVariantService,
  sku: string,
) {
  const result = await variantService.findAll(ctx, {
    filter: { sku: { eq: sku } },
    take: 1,
  });
  return result.items[0];
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seedToolyFull() {
  console.log('\n========================================');
  console.log('TOOLY Full Seed Script');
  console.log('========================================\n');

  const app = await bootstrap(config);

  const channelService = app.get(ChannelService);
  const productService = app.get(ProductService);
  const variantService = app.get(ProductVariantService);
  const collectionService = app.get(CollectionService);
  const facetService = app.get(FacetService);
  const facetValueService = app.get(FacetValueService);

  try {
    // ========================================================================
    // 1. Get tooly channel
    // ========================================================================
    console.log('1. Finding tooly channel...');

    // First get default channel to create initial context
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
      throw new Error('tooly channel not found! Run setup first: pnpm --filter @shofar/vendure run setup');
    }

    // Create context scoped to tooly channel
    const ctx = new RequestContext({
      channel: toolyChannel,
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      apiType: 'admin',
    });

    console.log(`   Channel: ${toolyChannel.code} (ID: ${toolyChannel.id})`);

    // ========================================================================
    // 2. Create/update facets
    // ========================================================================
    console.log('\n2. Setting up facets...');

    // Create finish facet
    const finishFacet = await getOrCreateFacet(ctx, facetService, FINISH_FACET.code, FINISH_FACET.name);
    const finishValues: Record<string, FacetValue> = {};
    for (const val of FINISH_FACET.values) {
      finishValues[val.code] = await getOrCreateFacetValue(
        ctx, facetService, facetValueService, finishFacet, val.code, val.name
      );
    }

    // Get or create color facet and extend with new values
    const colorFacet = await getOrCreateFacet(ctx, facetService, 'color', 'Color');
    const colorValues: Record<string, FacetValue> = {};

    // First, load existing color values
    const existingColorFacet = await facetService.findByCode(ctx, 'color', LanguageCode.en);
    if (existingColorFacet?.values) {
      for (const v of existingColorFacet.values) {
        colorValues[v.code] = v;
      }
    }

    // Add any missing color values
    for (const val of COLOR_EXTENSIONS) {
      if (!colorValues[val.code]) {
        colorValues[val.code] = await getOrCreateFacetValue(
          ctx, facetService, facetValueService, colorFacet, val.code, val.name
        );
      }
    }

    // Also ensure standard colors exist
    const standardColors = [
      { code: 'black', name: 'Black' },
      { code: 'silver', name: 'Silver' },
    ];
    for (const val of standardColors) {
      if (!colorValues[val.code]) {
        colorValues[val.code] = await getOrCreateFacetValue(
          ctx, facetService, facetValueService, colorFacet, val.code, val.name
        );
      }
    }

    // Get or create category facet
    const categoryFacet = await getOrCreateFacet(ctx, facetService, 'category', 'Category');
    const categoryValues: Record<string, FacetValue> = {};
    const categories = [
      { code: 'main-product', name: 'Main Product' },
      { code: 'accessory', name: 'Accessory' },
    ];
    for (const val of categories) {
      categoryValues[val.code] = await getOrCreateFacetValue(
        ctx, facetService, facetValueService, categoryFacet, val.code, val.name
      );
    }

    console.log('   Facets ready: finish, color, category');

    // ========================================================================
    // 3. Upsert TOOLY product
    // ========================================================================
    console.log('\n3. Upserting TOOLY product...');

    let toolyProduct = await findProductBySlug(ctx, productService, 'tooly');
    const mainProductFacetId = categoryValues['main-product']?.id;

    if (toolyProduct) {
      console.log(`   Found existing TOOLY product (ID: ${toolyProduct.id})`);
      // Update if needed
      await productService.update(ctx, {
        id: toolyProduct.id,
        enabled: true,
        facetValueIds: mainProductFacetId ? [mainProductFacetId] : [],
      });
    } else {
      console.log('   Creating new TOOLY product...');
      toolyProduct = await productService.create(ctx, {
        enabled: true,
        translations: [
          {
            languageCode: LanguageCode.en,
            name: 'TOOLY',
            slug: 'tooly',
            description: 'Premium nostril delivery device. Precision-machined 316 stainless steel with DLC or Cerakote finish. Hexagonal cross-section for secure grip.',
          },
        ],
        facetValueIds: mainProductFacetId ? [mainProductFacetId] : [],
      });
      console.log(`   Created TOOLY product (ID: ${toolyProduct.id})`);
    }

    // ========================================================================
    // 4. Upsert TOOLY variants
    // ========================================================================
    console.log('\n4. Upserting TOOLY variants...');

    for (const variantData of TOOLY_VARIANTS) {
      const existingVariant = await findVariantBySku(ctx, variantService, variantData.sku);

      const facetValueIds: ID[] = [];
      const colorVal = colorValues[variantData.color];
      const finishVal = finishValues[variantData.finish];
      if (colorVal?.id) {
        facetValueIds.push(colorVal.id);
      }
      if (finishVal?.id) {
        facetValueIds.push(finishVal.id);
      }

      if (existingVariant) {
        console.log(`   Updating variant: ${variantData.sku}`);
        await variantService.update(ctx, [
          {
            id: existingVariant.id,
            price: variantData.price,
            stockOnHand: variantData.stock,
            facetValueIds,
            translations: [{ languageCode: LanguageCode.en, name: variantData.name }],
          },
        ]);
      } else {
        try {
          console.log(`   Creating variant: ${variantData.sku}`);
          await variantService.create(ctx, [
            {
              productId: toolyProduct.id,
              sku: variantData.sku,
              price: variantData.price,
              stockOnHand: variantData.stock,
              trackInventory: true as any,
              facetValueIds,
              translations: [{ languageCode: LanguageCode.en, name: variantData.name }],
            },
          ]);
        } catch (err: any) {
          if (err?.message?.includes('already-exists') || err?.code === 'USER_INPUT_ERROR') {
            console.log(`   ⚠️ Variant ${variantData.sku} already exists (skipping)`);
          } else {
            throw err;
          }
        }
      }
    }

    console.log(`   TOOLY variants: ${TOOLY_VARIANTS.length}`);

    // ========================================================================
    // 5. Upsert accessory products
    // ========================================================================
    console.log('\n5. Upserting accessory products...');

    const accessoryFacetId = categoryValues['accessory']?.id;

    for (const accessoryData of ACCESSORIES) {
      let accessoryProduct = await findProductBySlug(ctx, productService, accessoryData.slug);

      if (accessoryProduct) {
        console.log(`   Found existing accessory: ${accessoryData.slug}`);
        await productService.update(ctx, {
          id: accessoryProduct.id,
          enabled: true,
          facetValueIds: accessoryFacetId ? [accessoryFacetId] : [],
        });
      } else {
        console.log(`   Creating accessory: ${accessoryData.slug}`);
        accessoryProduct = await productService.create(ctx, {
          enabled: true,
          translations: [
            {
              languageCode: LanguageCode.en,
              name: accessoryData.name,
              slug: accessoryData.slug,
              description: accessoryData.description,
            },
          ],
          facetValueIds: accessoryFacetId ? [accessoryFacetId] : [],
        });
      }

      // Upsert variant
      const existingVariant = await findVariantBySku(ctx, variantService, accessoryData.sku);

      if (existingVariant) {
        await variantService.update(ctx, [
          {
            id: existingVariant.id,
            price: accessoryData.price,
            stockOnHand: accessoryData.stock,
            translations: [{ languageCode: LanguageCode.en, name: accessoryData.name }],
          },
        ]);
      } else {
        try {
          await variantService.create(ctx, [
            {
              productId: accessoryProduct.id,
              sku: accessoryData.sku,
              price: accessoryData.price,
              stockOnHand: accessoryData.stock,
              trackInventory: true as any,
              translations: [{ languageCode: LanguageCode.en, name: accessoryData.name }],
            },
          ]);
        } catch (err: any) {
          if (err?.message?.includes('already-exists') || err?.code === 'USER_INPUT_ERROR') {
            console.log(`   ⚠️ Accessory variant ${accessoryData.sku} already exists (skipping)`);
          } else {
            throw err;
          }
        }
      }
    }

    console.log(`   Accessory products: ${ACCESSORIES.length}`);

    // ========================================================================
    // 6. Upsert Accessories collection
    // ========================================================================
    console.log('\n6. Upserting Accessories collection...');

    const existingCollections = await collectionService.findAll(ctx, {
      filter: { slug: { eq: 'accessories' } },
      take: 1,
    });

    if (existingCollections.items.length > 0 && existingCollections.items[0]) {
      const existingCollection = existingCollections.items[0];
      console.log(`   Found existing Accessories collection (ID: ${existingCollection.id})`);
      // Update collection filters to use accessory facet value
      if (accessoryFacetId) {
        await collectionService.update(ctx, {
          id: existingCollection.id,
          filters: [
            {
              code: 'facet-value-filter',
              arguments: [
                { name: 'facetValueIds', value: JSON.stringify([accessoryFacetId]) },
                { name: 'containsAny', value: 'false' },
              ],
            },
          ],
        });
      }
    } else {
      console.log('   Creating Accessories collection...');
      await collectionService.create(ctx, {
        isPrivate: false,
        translations: [
          {
            languageCode: LanguageCode.en,
            name: 'Accessories',
            slug: 'accessories',
            description: 'Essential accessories for TOOLY',
          },
        ],
        filters: accessoryFacetId ? [
          {
            code: 'facet-value-filter',
            arguments: [
              { name: 'facetValueIds', value: JSON.stringify([accessoryFacetId]) },
              { name: 'containsAny', value: 'false' },
            ],
          },
        ] : [],
      });
    }

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('\n========================================');
    console.log('SEED COMPLETE');
    console.log('========================================');
    console.log(`Channel: tooly`);
    console.log(`TOOLY variants: ${TOOLY_VARIANTS.length}`);
    console.log(`Accessories: ${ACCESSORIES.length}`);
    console.log(`Facets: finish (${FINISH_FACET.values.length}), color extended, category`);
    console.log('Collection: accessories');
    console.log('========================================\n');

  } catch (error: any) {
    console.error('\nSEED ERROR:', error?.message || error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the seed
seedToolyFull()
  .then(() => {
    console.log('Seed script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
