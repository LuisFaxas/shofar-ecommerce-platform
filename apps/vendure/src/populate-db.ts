import { bootstrap } from "@vendure/core";
import { populate } from "@vendure/core/cli";
import { config } from "./vendure-config";
import { initialData } from "./initial-data/initial-data";
import { seedProducts } from "./initial-data/seed-products";

/**
 * Main script to populate the database with initial data
 */
async function runPopulate(): Promise<void> {
  try {
    console.log("🌟 Starting database population...\n");

    // First, populate with Vendure's initial data
    console.log("📦 Setting up initial Vendure data...");
    await populate(
      () => bootstrap(config),
      initialData,
      process.env.SEED_PRODUCTS === "true" ? "./products.csv" : undefined,
    );

    // Bootstrap the app for custom population
    console.log("\n🔧 Setting up custom data...");
    const app = await bootstrap(config);

    // Seed products
    await seedProducts(app);

    await app.close();

    console.log("\n✨ Database population complete!");
    console.log("\n📝 Credentials:");
    console.log("  Superadmin: superadmin / superadmin123");
    console.log("  Tooly Manager: manager@tooly.com / manager123");
    console.log("\n🚀 You can now run `pnpm dev` to start the server");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error populating database:", error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  runPopulate();
}
