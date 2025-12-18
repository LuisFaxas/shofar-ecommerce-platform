import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  LanguageCode,
  DefaultLogger,
  LogLevel,
  Asset,
  Permission,
} from "@vendure/core";
// EmailPlugin disabled for initial deployment
// import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import { StripePlugin } from "@vendure/payments-plugin/package/stripe";
import path from "path";
import * as dotenv from "dotenv";
import { configureS3AssetStorage } from "./config/s3-asset-storage";

dotenv.config();

// Get S3 storage strategy if configured
const s3StorageStrategy = configureS3AssetStorage();

const IS_DEV = process.env.NODE_ENV !== "production";

// Database configuration that can switch between SQLite and PostgreSQL
function getDbConfig(): any {
  const dbType = process.env.DB_TYPE || "better-sqlite3";

  if (dbType === "postgres") {
    return {
      type: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      username: process.env.DB_USERNAME || "vendure",
      password: process.env.DB_PASSWORD || "vendure",
      database: process.env.DB_NAME || "vendure",
      synchronize: true, // Enable for initial schema creation
      migrations: [path.join(__dirname, "../migrations/*.+(js|ts)")],
      logging: false,
    };
  }

  // Default to SQLite for development
  return {
    type: "better-sqlite3",
    synchronize: IS_DEV,
    migrations: [path.join(__dirname, "../migrations/*.+(js|ts)")],
    logging: false,
    database: path.join(
      __dirname,
      "..",
      process.env.DB_DATABASE_FILE || "vendure-db.sqlite",
    ),
  };
}

export const config: VendureConfig = {
  apiOptions: {
    port: parseInt(process.env.PORT || "3001", 10),
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    adminApiPlayground: IS_DEV,
    shopApiPlayground: IS_DEV,
    cors: {
      origin: true,
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ["bearer", "cookie"],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME || "superadmin",
      password: process.env.SUPERADMIN_PASSWORD || "superadmin123",
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET || "cookie-secret-change-in-production",
      // Use distinct cookie name to avoid collision with admin session on localhost
      name: "vendure-shop-session",
    },
  },
  dbConnectionOptions: getDbConfig(),
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {
    // ============================================================================
    // PEPTIDE CUSTOM FIELDS (pharma-store)
    // These fields support the PEPTIDES research peptide catalog
    // ============================================================================
    Product: [
      {
        name: "casNumber",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "CAS Number" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "Chemical Abstracts Service registry number",
          },
        ],
        nullable: true,
        requiresPermission: Permission.SuperAdmin,
      },
      {
        name: "sequence",
        type: "text",
        label: [
          { languageCode: LanguageCode.en, value: "Amino Acid Sequence" },
        ],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "Peptide amino acid sequence",
          },
        ],
        nullable: true,
        requiresPermission: Permission.SuperAdmin,
      },
      {
        name: "family",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "Peptide Family" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value:
              "Classification family (e.g., GH secretagogue, Melanocortin)",
          },
        ],
        nullable: true,
        requiresPermission: Permission.SuperAdmin,
      },
      {
        name: "researchGoals",
        type: "string",
        list: true,
        label: [{ languageCode: LanguageCode.en, value: "Research Goals" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value:
              "Research goal categories (Recovery, Metabolic, Longevity, Cognitive, Cosmetic, Research)",
          },
        ],
        requiresPermission: Permission.SuperAdmin,
      },
      {
        name: "molecularWeight",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "Molecular Weight" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: 'Molecular weight (e.g., "1419.53 g/mol")',
          },
        ],
        nullable: true,
        requiresPermission: Permission.SuperAdmin,
      },
      {
        name: "molecularFormula",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "Molecular Formula" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: 'Chemical formula (e.g., "C62H98N16O22")',
          },
        ],
        nullable: true,
        requiresPermission: Permission.SuperAdmin,
      },
      {
        name: "sdsUrl",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "SDS Document URL" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "URL to Safety Data Sheet PDF",
          },
        ],
        nullable: true,
        requiresPermission: Permission.SuperAdmin,
      },
      {
        name: "coaUrl",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "COA Document URL" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "URL to Certificate of Analysis PDF",
          },
        ],
        nullable: true,
        requiresPermission: Permission.SuperAdmin,
      },
      {
        name: "featured",
        type: "boolean",
        label: [{ languageCode: LanguageCode.en, value: "Featured Product" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "Show on homepage featured section",
          },
        ],
        defaultValue: false,
      },
      {
        name: "popularity",
        type: "int",
        label: [{ languageCode: LanguageCode.en, value: "Popularity Score" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "Used for default sorting (higher = more popular)",
          },
        ],
        defaultValue: 0,
      },
    ],
    ProductVariant: [
      {
        name: "purityPercent",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "Purity" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: 'Purity percentage (e.g., "≥99%")',
          },
        ],
        nullable: true,
      },
      {
        name: "sizeMg",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "Size (mg)" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: 'Vial size in milligrams (e.g., "5mg")',
          },
        ],
        nullable: true,
      },
      {
        name: "storage",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "Storage Instructions" },
        ],
        description: [
          {
            languageCode: LanguageCode.en,
            value: 'Storage conditions (e.g., "Store at -20°C")',
          },
        ],
        nullable: true,
      },
      {
        name: "administrationRoute",
        type: "string",
        label: [
          { languageCode: LanguageCode.en, value: "Administration Route" },
        ],
        description: [
          {
            languageCode: LanguageCode.en,
            value: 'Route of administration (e.g., "Subcutaneous injection")',
          },
        ],
        nullable: true,
      },
      {
        name: "form",
        type: "string",
        label: [{ languageCode: LanguageCode.en, value: "Form" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value: 'Physical form (e.g., "Lyophilized powder")',
          },
        ],
        defaultValue: "Lyophilized powder",
        nullable: true,
      },
    ],
    // ============================================================================
    // CHANNEL CUSTOM FIELDS (Hero Images, Branding)
    // Per-channel storefront configuration managed via Admin UI
    // ============================================================================
    Channel: [
      {
        name: "heroImage",
        type: "relation",
        entity: Asset,
        eager: true,
        nullable: true,
        public: true,
        label: [
          { languageCode: LanguageCode.en, value: "Hero Background Image" },
        ],
        description: [
          {
            languageCode: LanguageCode.en,
            value:
              "Full-width hero background image for the storefront homepage",
          },
        ],
        ui: { tab: "Marketing" },
      },
      {
        name: "homeGalleryAssets",
        type: "relation",
        entity: Asset,
        list: true,
        eager: true,
        nullable: true,
        public: true,
        label: [
          { languageCode: LanguageCode.en, value: "Homepage Gallery Images" },
        ],
        description: [
          {
            languageCode: LanguageCode.en,
            value: "Decorative images for homepage gallery section (max 6)",
          },
        ],
        ui: { tab: "Marketing" },
      },
      // ============================================================================
      // STOREFRONT CONTENT - Hero Section
      // ============================================================================
      {
        name: "storefrontHeroPill",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Precision Aroma Delivery",
        label: [{ languageCode: LanguageCode.en, value: "Hero Badge Text" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value:
              "Small badge text above headline (e.g., 'Precision Aroma Delivery')",
          },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontHeroHeadlineLine1",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Precision.",
        label: [
          { languageCode: LanguageCode.en, value: "Hero Headline Line 1" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontHeroHeadlineAccent",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Aroma.",
        label: [
          {
            languageCode: LanguageCode.en,
            value: "Hero Headline Accent (gradient)",
          },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontHeroHeadlineLine3",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Perfection.",
        label: [
          { languageCode: LanguageCode.en, value: "Hero Headline Line 3" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontHeroSubhead",
        type: "text",
        nullable: true,
        public: true,
        defaultValue:
          "Experience the art of precision aroma delivery. Crafted for connoisseurs, designed for ritual.",
        label: [{ languageCode: LanguageCode.en, value: "Hero Subheadline" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontPrimaryCtaLabel",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Shop Now",
        label: [{ languageCode: LanguageCode.en, value: "Primary CTA Label" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontSecondaryCtaLabel",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Learn More",
        label: [
          { languageCode: LanguageCode.en, value: "Secondary CTA Label" },
        ],
        ui: { tab: "Storefront" },
      },
      // ============================================================================
      // STOREFRONT CONTENT - Trust Badges (4)
      // ============================================================================
      {
        name: "storefrontTrust1Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Secure Checkout",
        label: [
          { languageCode: LanguageCode.en, value: "Trust Badge 1 Title" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontTrust1Sub",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "256-bit encryption",
        label: [
          { languageCode: LanguageCode.en, value: "Trust Badge 1 Subtitle" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontTrust2Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Premium Quality",
        label: [
          { languageCode: LanguageCode.en, value: "Trust Badge 2 Title" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontTrust2Sub",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Crafted with care",
        label: [
          { languageCode: LanguageCode.en, value: "Trust Badge 2 Subtitle" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontTrust3Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Easy Returns",
        label: [
          { languageCode: LanguageCode.en, value: "Trust Badge 3 Title" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontTrust3Sub",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "30-day return policy",
        label: [
          { languageCode: LanguageCode.en, value: "Trust Badge 3 Subtitle" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontTrust4Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Support",
        label: [
          { languageCode: LanguageCode.en, value: "Trust Badge 4 Title" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontTrust4Sub",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Email support available",
        label: [
          { languageCode: LanguageCode.en, value: "Trust Badge 4 Subtitle" },
        ],
        ui: { tab: "Storefront" },
      },
      // ============================================================================
      // STOREFRONT CONTENT - Feature Grid (6 cards)
      // ============================================================================
      {
        name: "storefrontFeature1Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Precision Machining",
        label: [{ languageCode: LanguageCode.en, value: "Feature 1 Title" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature1Body",
        type: "text",
        nullable: true,
        public: true,
        defaultValue:
          "CNC-machined from aerospace-grade aluminum with tolerances under 0.01mm.",
        label: [{ languageCode: LanguageCode.en, value: "Feature 1 Body" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature2Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Optimized Airflow",
        label: [{ languageCode: LanguageCode.en, value: "Feature 2 Title" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature2Body",
        type: "text",
        nullable: true,
        public: true,
        defaultValue:
          "Engineered chamber design delivers smooth, consistent draws every time.",
        label: [{ languageCode: LanguageCode.en, value: "Feature 2 Body" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature3Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Premium Materials",
        label: [{ languageCode: LanguageCode.en, value: "Feature 3 Title" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature3Body",
        type: "text",
        nullable: true,
        public: true,
        defaultValue:
          "Medical-grade stainless steel and borosilicate glass for purity.",
        label: [{ languageCode: LanguageCode.en, value: "Feature 3 Body" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature4Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Easy Maintenance",
        label: [{ languageCode: LanguageCode.en, value: "Feature 4 Title" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature4Body",
        type: "text",
        nullable: true,
        public: true,
        defaultValue:
          "Simple disassembly and cleaning. Dishwasher-safe components.",
        label: [{ languageCode: LanguageCode.en, value: "Feature 4 Body" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature5Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Ergonomic Design",
        label: [{ languageCode: LanguageCode.en, value: "Feature 5 Title" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature5Body",
        type: "text",
        nullable: true,
        public: true,
        defaultValue:
          "Balanced weight distribution and textured grip for comfortable use.",
        label: [{ languageCode: LanguageCode.en, value: "Feature 5 Body" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature6Title",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Travel Ready",
        label: [{ languageCode: LanguageCode.en, value: "Feature 6 Title" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontFeature6Body",
        type: "text",
        nullable: true,
        public: true,
        defaultValue:
          "Compact form factor with included protective case for portability.",
        label: [{ languageCode: LanguageCode.en, value: "Feature 6 Body" }],
        ui: { tab: "Storefront" },
      },
      // ============================================================================
      // STOREFRONT CONTENT - Gallery Section
      // ============================================================================
      {
        name: "storefrontGalleryHeading",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Gallery",
        label: [
          { languageCode: LanguageCode.en, value: "Gallery Section Heading" },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontGallerySubhead",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Every angle showcases the precision craftsmanship",
        label: [
          { languageCode: LanguageCode.en, value: "Gallery Section Subhead" },
        ],
        ui: { tab: "Storefront" },
      },
      // ============================================================================
      // STOREFRONT CONTENT - Shop Widget / Product Section
      // ============================================================================
      {
        name: "storefrontShippingBlurb",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Shipping calculated at checkout",
        label: [{ languageCode: LanguageCode.en, value: "Shipping Blurb" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value:
              "Text shown near price (e.g., 'Free shipping over $100' or 'Shipping calculated at checkout')",
          },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontDeliveryEstimate",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Ships within 3-5 business days",
        label: [{ languageCode: LanguageCode.en, value: "Delivery Estimate" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontInStockLabel",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "In Stock",
        label: [{ languageCode: LanguageCode.en, value: "In Stock Label" }],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontOutOfStockLabel",
        type: "string",
        nullable: true,
        public: true,
        defaultValue: "Out of Stock",
        label: [{ languageCode: LanguageCode.en, value: "Out of Stock Label" }],
        ui: { tab: "Storefront" },
      },
      // ============================================================================
      // STOREFRONT CONTENT - Footer / Compliance
      // ============================================================================
      {
        name: "storefrontDisclaimer",
        type: "text",
        nullable: true,
        public: true,
        defaultValue: "For aromatic and sensory evaluation purposes only.",
        label: [{ languageCode: LanguageCode.en, value: "Footer Disclaimer" }],
        ui: { tab: "Storefront" },
      },
      // ============================================================================
      // STOREFRONT CONTENT - Header Toggles
      // ============================================================================
      {
        name: "storefrontShowAuthLinks",
        type: "boolean",
        nullable: true,
        public: true,
        defaultValue: false,
        label: [
          { languageCode: LanguageCode.en, value: "Show Sign In/Up Links" },
        ],
        description: [
          {
            languageCode: LanguageCode.en,
            value:
              "Enable authentication links in header (disable if auth not ready)",
          },
        ],
        ui: { tab: "Storefront" },
      },
      {
        name: "storefrontShowSearch",
        type: "boolean",
        nullable: true,
        public: true,
        defaultValue: false,
        label: [{ languageCode: LanguageCode.en, value: "Show Search" }],
        description: [
          {
            languageCode: LanguageCode.en,
            value:
              "Enable search functionality in header (disable if search not ready)",
          },
        ],
        ui: { tab: "Storefront" },
      },
    ],
  },
  logger: new DefaultLogger({ level: IS_DEV ? LogLevel.Debug : LogLevel.Info }),
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(
        __dirname,
        "..",
        process.env.ASSET_UPLOAD_DIR || "./static/assets",
      ),
      // CDN configuration for production, falls back to local dev URL
      assetUrlPrefix: process.env.CDN_URL
        ? `${process.env.CDN_URL}/assets/`
        : process.env.ASSET_URL_PREFIX || "http://localhost:3001/assets/",
      // S3/R2 storage strategy (auto-configured from env vars when ASSET_STORAGE=s3)
      // Falls back to local file storage if S3 not configured
      ...(s3StorageStrategy && {
        storageStrategyFactory: () => s3StorageStrategy,
      }),
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    // EmailPlugin disabled for initial deployment (no templates in prod yet)
    // EmailPlugin.init({
    //   devMode: true,
    //   outputPath: path.join(__dirname, "../static/email/test-emails"),
    //   route: "mailbox",
    //   handlers: defaultEmailHandlers,
    //   templatePath: path.join(__dirname, "../static/email/templates"),
    //   globalTemplateVars: {
    //     fromAddress: '"TOOLY Store" <noreply@tooly.com>',
    //   },
    // }),
    AdminUiPlugin.init({
      route: "admin",
      port: 3002,
      adminUiConfig: {
        brand: "TOOLY Admin",
        hideVendureBranding: false,
        hideVersion: false,
        defaultLanguage: LanguageCode.en,
        availableLanguages: [LanguageCode.en],
      },
    }),
    // Stripe Payment Integration
    // API key and webhook secret are configured per PaymentMethod in Admin UI
    StripePlugin.init({
      storeCustomersInStripe: true,
    }),
  ],
};
