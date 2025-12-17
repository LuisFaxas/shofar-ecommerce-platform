import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  LanguageCode,
  DefaultLogger,
  LogLevel,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
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
      synchronize: IS_DEV,
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
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        fromAddress: '"TOOLY Store" <noreply@tooly.com>',
      },
    }),
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
