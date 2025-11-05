import {
  ChannelService,
  RequestContext,
  ProductService,
  ProductVariantService,
  CollectionService,
  FacetService,
  LanguageCode,
} from '@vendure/core';

export async function seedProducts(app: any): Promise<void> {
  const channelService = app.get(ChannelService);
  const productService = app.get(ProductService);
  const variantService = app.get(ProductVariantService);
  const collectionService = app.get(CollectionService);
  const facetService = app.get(FacetService);

  try {
    // Get tooly channel
    const channels = await channelService.findAll();
    const toolyChannel = channels.items.find((c: any) => c.code === 'tooly');

    if (!toolyChannel) {
      console.log('⚠️ Tooly channel not found, skipping product seeding');
      return;
    }

    const ctx = new RequestContext({
      channel: toolyChannel,
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      apiType: 'admin',
    });

    console.log('🛍️ Creating product catalog...');

    // Create facets for product attributes
    try {
      const colorFacet = await facetService.create(ctx, {
        code: 'color',
        isPrivate: false,
        translations: [
          {
            languageCode: LanguageCode.en,
            name: 'Color',
          },
        ],
        values: [
          {
            code: 'black',
            translations: [{ languageCode: LanguageCode.en, name: 'Black' }],
          },
          {
            code: 'silver',
            translations: [{ languageCode: LanguageCode.en, name: 'Silver' }],
          },
          {
            code: 'gold',
            translations: [{ languageCode: LanguageCode.en, name: 'Gold' }],
          },
        ],
      });

      const categoryFacet = await facetService.create(ctx, {
        code: 'category',
        isPrivate: false,
        translations: [
          {
            languageCode: LanguageCode.en,
            name: 'Category',
          },
        ],
        values: [
          {
            code: 'main-product',
            translations: [{ languageCode: LanguageCode.en, name: 'Main Product' }],
          },
          {
            code: 'accessory',
            translations: [{ languageCode: LanguageCode.en, name: 'Accessory' }],
          },
        ],
      });

      console.log('✅ Created facets: color, category');

      // Create TOOLY main product
      const mainCategoryValue = categoryFacet.values.find((v: any) => v.code === 'main-product');
      const toolyProduct = await productService.create(ctx, {
        enabled: true,
        translations: [
          {
            languageCode: LanguageCode.en,
            name: 'TOOLY',
            slug: 'tooly',
            description: 'The ultimate multi-tool for modern life.',
          },
        ],
        facetValueIds: mainCategoryValue ? [mainCategoryValue.id] : [],
      });

      // Create a few variants
      const blackColor = colorFacet.values.find((v: any) => v.code === 'black');
      if (blackColor) {
        await variantService.create(ctx, [
          {
            productId: toolyProduct.id,
            sku: 'TOOLY-BLK-001',
            price: 9900,
            stockOnHand: 100,
            trackInventory: true,
            translations: [
              {
                languageCode: LanguageCode.en,
                name: 'TOOLY - Black',
              },
            ],
            facetValueIds: [blackColor.id],
          },
        ]);
      }

      console.log('✅ Created TOOLY product with variants');

      // Create one accessory product
      const accessoryCategoryValue = categoryFacet.values.find((v: any) => v.code === 'accessory');
      const caseProduct = await productService.create(ctx, {
        enabled: true,
        translations: [
          {
            languageCode: LanguageCode.en,
            name: 'Silicone Case for TOOLY',
            slug: 'silicone-case-tooly',
            description: 'Protective silicone case for TOOLY.',
          },
        ],
        facetValueIds: accessoryCategoryValue ? [accessoryCategoryValue.id] : [],
      });

      // Create variant for case
      await variantService.create(ctx, [
        {
          productId: caseProduct.id,
          sku: 'ACC-CASE-001',
          price: 1999,
          stockOnHand: 200,
          trackInventory: true,
          translations: [
            {
              languageCode: LanguageCode.en,
              name: 'Silicone Case',
            },
          ],
        },
      ]);

      console.log('✅ Created accessory products');

      // Create Accessories Collection
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
        filters: [],
      });

      console.log('✅ Created collections');
      console.log('🎉 Product catalog setup complete!');
    } catch (error: any) {
      console.error('Error creating products:', error?.message || error);
    }
  } catch (error: any) {
    console.error('Error in seedProducts:', error?.message || error);
  }
}