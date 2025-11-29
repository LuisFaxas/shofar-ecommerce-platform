import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  LanguageCode,
  DefaultLogger,
  LogLevel,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const IS_DEV = process.env.NODE_ENV !== 'production';

// Database configuration that can switch between SQLite and PostgreSQL
function getDbConfig(): any {
  const dbType = process.env.DB_TYPE || 'better-sqlite3';

  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'vendure',
      password: process.env.DB_PASSWORD || 'vendure',
      database: process.env.DB_NAME || 'vendure',
      synchronize: IS_DEV,
      migrations: [path.join(__dirname, '../migrations/*.+(js|ts)')],
      logging: false,
    };
  }

  // Default to SQLite for development
  return {
    type: 'better-sqlite3',
    synchronize: IS_DEV,
    migrations: [path.join(__dirname, '../migrations/*.+(js|ts)')],
    logging: false,
    database: path.join(__dirname, '..', process.env.DB_DATABASE_FILE || 'vendure-db.sqlite'),
  };
}

export const config: VendureConfig = {
  apiOptions: {
    port: parseInt(process.env.PORT || '3001', 10),
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    adminApiPlayground: IS_DEV,
    shopApiPlayground: IS_DEV,
    cors: {
      origin: true,
      credentials: true,
    },
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME || 'superadmin',
      password: process.env.SUPERADMIN_PASSWORD || 'superadmin123',
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET || 'cookie-secret-change-in-production',
    },
  },
  dbConnectionOptions: getDbConfig(),
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {},
  logger: new DefaultLogger({ level: IS_DEV ? LogLevel.Debug : LogLevel.Info }),
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '..', process.env.ASSET_UPLOAD_DIR || './static/assets'),
      // CDN configuration for production, falls back to local dev URL
      assetUrlPrefix: process.env.CDN_URL
        ? `${process.env.CDN_URL}/assets/`
        : process.env.ASSET_URL_PREFIX || 'http://localhost:3001/assets/',
      // S3/R2 Configuration (uncomment and configure for production)
      // storageStrategyFactory: configureS3AssetStorage({
      //   bucket: process.env.S3_BUCKET || 'shofar-assets',
      //   credentials: {
      //     accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      //     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      //   },
      //   region: process.env.S3_REGION || 'us-east-1',
      //   // For Cloudflare R2:
      //   // endpoint: process.env.R2_ENDPOINT || 'https://your-account.r2.cloudflarestorage.com',
      // }),
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: '"TOOLY Store" <noreply@tooly.com>',
      },
    }),
    AdminUiPlugin.init({
      route: 'admin',
      port: 3002,
      adminUiConfig: {
        brand: 'TOOLY Admin',
        hideVendureBranding: false,
        hideVersion: false,
        defaultLanguage: LanguageCode.en,
        availableLanguages: [LanguageCode.en],
      },
    }),
  ],
};