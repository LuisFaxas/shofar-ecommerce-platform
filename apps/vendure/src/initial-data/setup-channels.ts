import {
  ChannelService,
  RoleService,
  AdministratorService,
  ZoneService,
  CountryService,
  RequestContext,
  Permission,
  LanguageCode,
  ID,
} from '@vendure/core';

/**
 * Ensure basic zones exist for channel creation
 */
async function ensureZones(app: any, ctx: RequestContext): Promise<{ zoneId: ID }> {
  const zoneService = app.get(ZoneService);
  const countryService = app.get(CountryService);

  // Check if zones already exist
  const existingZones = await zoneService.findAll(ctx);
  if (existingZones.items.length > 0) {
    console.log('✅ Zones already exist');
    return { zoneId: existingZones.items[0].id };
  }

  // Create USA country if it doesn't exist
  let usaCountry;
  try {
    const countries = await countryService.findAll(ctx);
    usaCountry = countries.items.find((c: any) => c.code === 'US');
    if (!usaCountry) {
      usaCountry = await countryService.create(ctx, {
        code: 'US',
        enabled: true,
        translations: [{ languageCode: LanguageCode.en, name: 'United States' }],
      });
      console.log('✅ Created country: US');
    }
  } catch (error) {
    console.log('⚠️ Country creation skipped');
  }

  // Create default zone
  try {
    const zone = await zoneService.create(ctx, {
      name: 'North America',
      memberIds: usaCountry ? [usaCountry.id] : [],
    });
    console.log('✅ Created zone: North America');
    return { zoneId: zone.id };
  } catch (error: any) {
    console.log('⚠️ Zone creation failed:', error?.message);
    // Return first zone if creation failed (might already exist)
    const zones = await zoneService.findAll(ctx);
    return { zoneId: zones.items[0]?.id || ('1' as ID) };
  }
}

/**
 * Set up channels and RBAC roles
 */
export async function setupChannelsAndRoles(app: any): Promise<void> {
  const channelService = app.get(ChannelService);
  const roleService = app.get(RoleService);
  const adminService = app.get(AdministratorService);

  try {
    // Get default channel for superadmin context
    const defaultChannel = await channelService.getDefaultChannel();

    const superadminContext = new RequestContext({
      channel: defaultChannel,
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      apiType: 'admin',
    });

    console.log('🚀 Setting up channels...');

    // Ensure zones exist first
    const { zoneId } = await ensureZones(app, superadminContext);

    // Create Tooly channel
    try {
      await channelService.create(superadminContext, {
        code: 'tooly',
        token: 'tooly',
        defaultLanguageCode: LanguageCode.en,
        availableLanguageCodes: [LanguageCode.en],
        pricesIncludeTax: false,
        currencyCode: 'USD',
        defaultCurrencyCode: 'USD',
        defaultShippingZoneId: zoneId,
        defaultTaxZoneId: zoneId,
      });
      console.log('✅ Created channel: tooly');
    } catch (error: any) {
      // Check if it's a duplicate error
      if (error?.message?.includes('duplicate') || error?.message?.includes('already exists')) {
        console.log('ℹ️ Channel tooly already exists');
      } else {
        console.log('⚠️ Could not create tooly channel:', error?.message || 'unknown error');
      }
    }

    // Create Future channel
    try {
      await channelService.create(superadminContext, {
        code: 'future',
        token: 'future',
        defaultLanguageCode: LanguageCode.en,
        availableLanguageCodes: [LanguageCode.en],
        pricesIncludeTax: false,
        currencyCode: 'USD',
        defaultCurrencyCode: 'USD',
        defaultShippingZoneId: zoneId,
        defaultTaxZoneId: zoneId,
      });
      console.log('✅ Created channel: future');
    } catch (error: any) {
      if (error?.message?.includes('duplicate') || error?.message?.includes('already exists')) {
        console.log('ℹ️ Channel future already exists');
      } else {
        console.log('⚠️ Could not create future channel:', error?.message || 'unknown error');
      }
    }

    // Get channels
    const channels = await channelService.findAll(superadminContext);
    const toolyChannel = channels.items.find((c: any) => c.code === 'tooly');

    if (toolyChannel) {
      // Create RBAC Roles
      console.log('🔐 Setting up RBAC roles...');

      // ToolyStoreManager - Full permissions on tooly channel only
      try {
        const storeManagerPermissions = [
          Permission.CreateCatalog,
          Permission.ReadCatalog,
          Permission.UpdateCatalog,
          Permission.DeleteCatalog,
          Permission.CreateSettings,
          Permission.ReadSettings,
          Permission.UpdateSettings,
          Permission.CreateAdministrator,
          Permission.ReadAdministrator,
          Permission.UpdateAdministrator,
          Permission.CreateAsset,
          Permission.ReadAsset,
          Permission.UpdateAsset,
          Permission.DeleteAsset,
          Permission.CreateCollection,
          Permission.ReadCollection,
          Permission.UpdateCollection,
          Permission.DeleteCollection,
          Permission.CreateCustomer,
          Permission.ReadCustomer,
          Permission.UpdateCustomer,
          Permission.DeleteCustomer,
          Permission.CreateFacet,
          Permission.ReadFacet,
          Permission.UpdateFacet,
          Permission.DeleteFacet,
          Permission.CreateOrder,
          Permission.ReadOrder,
          Permission.UpdateOrder,
          Permission.DeleteOrder,
          Permission.CreateProduct,
          Permission.ReadProduct,
          Permission.UpdateProduct,
          Permission.DeleteProduct,
          Permission.CreatePromotion,
          Permission.ReadPromotion,
          Permission.UpdatePromotion,
          Permission.DeletePromotion,
        ];

        const toolyStoreManagerRole = await roleService.create(superadminContext, {
          code: 'tooly-store-manager',
          description: 'Full permissions on Tooly channel',
          permissions: storeManagerPermissions,
          channelIds: [toolyChannel.id],
        });
        console.log('✅ Created role: tooly-store-manager');

        // Create test admin user
        try {
          await adminService.create(superadminContext, {
            emailAddress: 'manager@tooly.com',
            firstName: 'Tooly',
            lastName: 'Manager',
            password: 'manager123',
            roleIds: [toolyStoreManagerRole.id],
          });
          console.log('👤 Created test admin: manager@tooly.com');
        } catch (error) {
          console.log('⚠️ Admin user might already exist');
        }
      } catch (error) {
        console.log('⚠️ Could not create tooly-store-manager role');
      }

      // ToolyFulfillment role
      try {
        const fulfillmentPermissions = [
          Permission.ReadOrder,
          Permission.UpdateOrder,
          Permission.ReadCustomer,
          Permission.ReadProduct,
        ];

        await roleService.create(superadminContext, {
          code: 'tooly-fulfillment',
          description: 'Order fulfillment permissions on Tooly channel',
          permissions: fulfillmentPermissions,
          channelIds: [toolyChannel.id],
        });
        console.log('✅ Created role: tooly-fulfillment');
      } catch (error) {
        console.log('⚠️ Could not create tooly-fulfillment role');
      }

      // ToolySupport role
      try {
        const supportPermissions = [
          Permission.ReadOrder,
          Permission.ReadCustomer,
          Permission.ReadProduct,
        ];

        await roleService.create(superadminContext, {
          code: 'tooly-support',
          description: 'Read-only order support on Tooly channel',
          permissions: supportPermissions,
          channelIds: [toolyChannel.id],
        });
        console.log('✅ Created role: tooly-support');
      } catch (error) {
        console.log('⚠️ Could not create tooly-support role');
      }
    }
  } catch (error: any) {
    console.error('Error in setupChannelsAndRoles:', error?.message || error);
    throw error;
  }
}