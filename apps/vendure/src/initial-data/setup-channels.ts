import {
  ChannelService,
  RoleService,
  AdministratorService,
  RequestContext,
  Permission,
  LanguageCode,
  ID,
} from '@vendure/core';

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
        defaultShippingZoneId: '1' as ID,
        defaultTaxZoneId: '1' as ID,
      });
      console.log('✅ Created channel: tooly');
    } catch (error) {
      console.log('⚠️ Could not create tooly channel (may already exist)');
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
        defaultShippingZoneId: '1' as ID,
        defaultTaxZoneId: '1' as ID,
      });
      console.log('✅ Created channel: future');
    } catch (error) {
      console.log('⚠️ Could not create future channel (may already exist)');
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