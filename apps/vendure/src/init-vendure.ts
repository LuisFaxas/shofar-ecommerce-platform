import { bootstrap, DefaultLogger, LogLevel } from '@vendure/core';
import { config } from './vendure-config';

/**
 * Initialize Vendure with channels, roles, and seed data
 */
async function initVendure(): Promise<void> {
  const logger = new DefaultLogger({ level: LogLevel.Info });

  try {
    logger.info('🌟 Initializing Vendure database...\n');

    // Bootstrap the app
    const app = await bootstrap(config);
    logger.info('✅ Vendure server initialized');

    // Import setup functions here to avoid circular dependencies
    const { setupChannelsAndRoles } = await import('./initial-data/setup-channels');
    const { seedProducts } = await import('./initial-data/seed-products');

    // Setup channels and roles
    logger.info('\n🔧 Setting up channels and roles...');
    await setupChannelsAndRoles(app);

    // Seed products
    logger.info('\n🛍️ Creating product catalog...');
    await seedProducts(app);

    await app.close();

    logger.info('\n✨ Vendure initialization complete!');
    logger.info('\n📝 Credentials:');
    logger.info('  Superadmin: superadmin / superadmin123');
    logger.info('  Tooly Manager: manager@tooly.com / manager123');
    logger.info('\n🚀 You can now run `pnpm dev` to start the server');

    process.exit(0);
  } catch (error: any) {
    logger.error('\n❌ Error initializing Vendure:', error?.message || String(error));
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  initVendure();
}