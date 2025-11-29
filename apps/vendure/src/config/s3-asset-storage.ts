/**
 * S3 Asset Storage Strategy for Vendure
 *
 * Supports:
 * - AWS S3
 * - Cloudflare R2 (S3-compatible)
 * - MinIO (S3-compatible, for NAS)
 *
 * Environment Variables:
 * - ASSET_STORAGE: 's3' | 'local' (default: 'local')
 * - S3_ENDPOINT: Custom endpoint for R2/MinIO (optional for AWS S3)
 * - S3_REGION: AWS region (default: 'auto' for R2, 'us-east-1' for others)
 * - S3_BUCKET: Bucket name
 * - S3_ACCESS_KEY_ID: Access key
 * - S3_SECRET_ACCESS_KEY: Secret key
 * - S3_FORCE_PATH_STYLE: 'true' for MinIO, 'false' for R2/AWS (default: 'false')
 * - ASSET_URL_PREFIX: Public URL prefix for assets
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { AssetStorageStrategy } from '@vendure/core';
import { Request } from 'express';
import { Readable } from 'stream';

export interface S3AssetStorageConfig {
  bucket: string;
  region?: string;
  endpoint?: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  forcePathStyle?: boolean;
}

/**
 * Check if S3 storage is properly configured
 */
export function isS3Configured(): boolean {
  const storage = process.env.ASSET_STORAGE;
  const bucket = process.env.S3_BUCKET;
  const accessKey = process.env.S3_ACCESS_KEY_ID;
  const secretKey = process.env.S3_SECRET_ACCESS_KEY;

  return storage === 's3' && !!bucket && !!accessKey && !!secretKey;
}

/**
 * Get S3 configuration from environment variables
 */
export function getS3ConfigFromEnv(): S3AssetStorageConfig | null {
  if (!isS3Configured()) {
    return null;
  }

  return {
    bucket: process.env.S3_BUCKET!,
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  };
}

/**
 * Create an S3 client with the given configuration
 */
function createS3Client(config: S3AssetStorageConfig): S3Client {
  return new S3Client({
    region: config.region || 'us-east-1',
    endpoint: config.endpoint,
    credentials: config.credentials,
    forcePathStyle: config.forcePathStyle,
  });
}

/**
 * S3 Asset Storage Strategy for Vendure
 * Implements AssetStorageStrategy interface for S3-compatible storage
 */
export class S3AssetStorageStrategy implements AssetStorageStrategy {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private config: S3AssetStorageConfig) {
    this.s3Client = createS3Client(config);
    this.bucket = config.bucket;
  }

  async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: fileName,
        Body: data,
        ContentType: this.getMimeType(fileName),
      },
    });

    await upload.done();
    return fileName;
  }

  async writeFileFromStream(fileName: string, data: Readable): Promise<string> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: fileName,
        Body: data,
        ContentType: this.getMimeType(fileName),
      },
    });

    await upload.done();
    return fileName;
  }

  async readFileToBuffer(identifier: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: identifier,
    });

    const response = await this.s3Client.send(command);
    const stream = response.Body as Readable;

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async readFileToStream(identifier: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: identifier,
    });

    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  async deleteFile(identifier: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: identifier,
    });

    await this.s3Client.send(command);
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
      });
      await this.s3Client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  toAbsoluteUrl(_request: Request, identifier: string): string {
    // Use ASSET_URL_PREFIX if set, otherwise construct from endpoint/bucket
    const prefix = process.env.ASSET_URL_PREFIX;
    if (prefix) {
      return `${prefix.replace(/\/$/, '')}/${identifier}`;
    }

    // Fallback: construct URL from endpoint and bucket
    if (this.config.endpoint) {
      const baseUrl = this.config.endpoint.replace(/\/$/, '');
      if (this.config.forcePathStyle) {
        return `${baseUrl}/${this.bucket}/${identifier}`;
      }
      // Virtual-hosted style (R2)
      return `${baseUrl}/${identifier}`;
    }

    // AWS S3 default
    return `https://${this.bucket}.s3.${this.config.region}.amazonaws.com/${identifier}`;
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      mp4: 'video/mp4',
      webm: 'video/webm',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}

/**
 * Factory function to create S3 storage strategy
 * Returns undefined if S3 is not configured, allowing fallback to local storage
 */
export function configureS3AssetStorage(): S3AssetStorageStrategy | undefined {
  const config = getS3ConfigFromEnv();

  if (!config) {
    if (process.env.ASSET_STORAGE === 's3') {
      console.warn(
        '\n⚠️  S3 storage requested but credentials missing!\n' +
          '   Required env vars: S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY\n' +
          '   Falling back to local file storage.\n'
      );
    }
    return undefined;
  }

  console.log(`✅ S3 asset storage configured: ${config.endpoint || 'AWS S3'} / ${config.bucket}`);
  return new S3AssetStorageStrategy(config);
}
