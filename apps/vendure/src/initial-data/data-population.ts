import {
  bootstrap,
  ChannelService,
  RoleService,
  AdministratorService,
  RequestContext,
  Permission,
  LanguageCode,
  AssetService,
  ProductService,
  CollectionService,
  FacetService,
  ProductVariantService,
  ConfigService,
  TransactionalConnection,
} from '@vendure/core';
import { config } from '../vendure-config';
import { initialData } from './initial-data';

/**
 * Populate database with channels, roles, and seed products
 */
export async function populateDatabase(): Promise<void> {
  const app = await bootstrap(config);

  await app.get(TransactionalConnection).withTransaction(async (ctx) => {
    const channelService = app.get(ChannelService);
    const roleService = app.get(RoleService);
    const adminService = app.get(AdministratorService);
    const configService = app.get(ConfigService);

    // Get superadmin context
    const superadminContext = new RequestContext({
      channel: await channelService.getDefaultChannel(),
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
    });

    console.log('🚀 Setting up channels...');

    // Create Tooly channel
    const toolyChannel = await channelService.create(superadminContext, {
      code: 'tooly',
      token: 'tooly',
      defaultLanguageCode: LanguageCode.en,
      availableLanguageCodes: [LanguageCode.en],
      pricesIncludeTax: false,
      currencyCode: 'USD',
      defaultShippingZoneId: 1,
      defaultTaxZoneId: 1,
    });

    // Create Future channel (placeholder)
    const futureChannel = await channelService.create(superadminContext, {
      code: 'future',
      token: 'future',
      defaultLanguageCode: LanguageCode.en,
      availableLanguageCodes: [LanguageCode.en],
      pricesIncludeTax: false,
      currencyCode: 'USD',
      defaultShippingZoneId: 1,
      defaultTaxZoneId: 1,
    });

    console.log('✅ Channels created: tooly, future');

    // Create RBAC Roles
    console.log('🔐 Setting up RBAC roles...');

    // ToolyStoreManager - Full permissions on tooly channel only
    const storeManagerPermissions = [
      Permission.CreateCatalog,
      Permission.ReadCatalog,
      Permission.UpdateCatalog,
      Permission.DeleteCatalog,
      Permission.CreateSettings,
      Permission.ReadSettings,
      Permission.UpdateSettings,
      Permission.DeleteSettings,
      Permission.CreateAdministrator,
      Permission.ReadAdministrator,
      Permission.UpdateAdministrator,
      Permission.DeleteAdministrator,
      Permission.CreateAsset,
      Permission.ReadAsset,
      Permission.UpdateAsset,
      Permission.DeleteAsset,
      Permission.CreateChannel,
      Permission.ReadChannel,
      Permission.UpdateChannel,
      Permission.DeleteChannel,
      Permission.CreateCollection,
      Permission.ReadCollection,
      Permission.UpdateCollection,
      Permission.DeleteCollection,
      Permission.CreateCountry,
      Permission.ReadCountry,
      Permission.UpdateCountry,
      Permission.DeleteCountry,
      Permission.CreateCustomer,
      Permission.ReadCustomer,
      Permission.UpdateCustomer,
      Permission.DeleteCustomer,
      Permission.CreateCustomerGroup,
      Permission.ReadCustomerGroup,
      Permission.UpdateCustomerGroup,
      Permission.DeleteCustomerGroup,
      Permission.CreateFacet,
      Permission.ReadFacet,
      Permission.UpdateFacet,
      Permission.DeleteFacet,
      Permission.CreateOrder,
      Permission.ReadOrder,
      Permission.UpdateOrder,
      Permission.DeleteOrder,
      Permission.CreatePaymentMethod,
      Permission.ReadPaymentMethod,
      Permission.UpdatePaymentMethod,
      Permission.DeletePaymentMethod,
      Permission.CreateProduct,
      Permission.ReadProduct,
      Permission.UpdateProduct,
      Permission.DeleteProduct,
      Permission.CreatePromotion,
      Permission.ReadPromotion,
      Permission.UpdatePromotion,
      Permission.DeletePromotion,
      Permission.CreateShippingMethod,
      Permission.ReadShippingMethod,
      Permission.UpdateShippingMethod,
      Permission.DeleteShippingMethod,
      Permission.CreateTag,
      Permission.ReadTag,
      Permission.UpdateTag,
      Permission.DeleteTag,
      Permission.CreateTaxCategory,
      Permission.ReadTaxCategory,
      Permission.UpdateTaxCategory,
      Permission.DeleteTaxCategory,
      Permission.CreateTaxRate,
      Permission.ReadTaxRate,
      Permission.UpdateTaxRate,
      Permission.DeleteTaxRate,
      Permission.CreateSeller,
      Permission.ReadSeller,
      Permission.UpdateSeller,
      Permission.DeleteSeller,
      Permission.CreateStockLocation,
      Permission.ReadStockLocation,
      Permission.UpdateStockLocation,
      Permission.DeleteStockLocation,
      Permission.CreateSystem,
      Permission.ReadSystem,
      Permission.UpdateSystem,
      Permission.DeleteSystem,
      Permission.CreateZone,
      Permission.ReadZone,
      Permission.UpdateZone,
      Permission.DeleteZone,
    ];

    const toolyStoreManagerRole = await roleService.create(superadminContext, {
      code: 'tooly-store-manager',
      description: 'Full permissions on Tooly channel',
      permissions: storeManagerPermissions,
      channelIds: [toolyChannel.id],
    });

    // ToolyFulfillment - Orders and fulfillment permissions on tooly only
    const fulfillmentPermissions = [
      Permission.ReadOrder,
      Permission.UpdateOrder,
      Permission.ReadCustomer,
      Permission.ReadProduct,
      Permission.ReadStockLocation,
      Permission.UpdateStockLocation,
    ];

    const toolyFulfillmentRole = await roleService.create(superadminContext, {
      code: 'tooly-fulfillment',
      description: 'Order fulfillment permissions on Tooly channel',
      permissions: fulfillmentPermissions,
      channelIds: [toolyChannel.id],
    });

    // ToolySupport - Read-only orders on tooly only
    const supportPermissions = [
      Permission.ReadOrder,
      Permission.ReadCustomer,
      Permission.ReadProduct,
    ];

    const toolySupportRole = await roleService.create(superadminContext, {
      code: 'tooly-support',
      description: 'Read-only order support on Tooly channel',
      permissions: supportPermissions,
      channelIds: [toolyChannel.id],
    });

    console.log('✅ RBAC roles created: tooly-store-manager, tooly-fulfillment, tooly-support');

    // Create test admin user scoped to tooly
    const testAdmin = await adminService.create(superadminContext, {
      emailAddress: 'manager@tooly.com',
      firstName: 'Tooly',
      lastName: 'Manager',
      password: 'manager123',
      roleIds: [toolyStoreManagerRole.id],
    });

    console.log('👤 Test admin created: manager@tooly.com (password: manager123)');
  });

  await app.close();
}