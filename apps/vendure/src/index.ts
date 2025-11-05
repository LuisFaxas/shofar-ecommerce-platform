import { bootstrap, runMigrations } from '@vendure/core';
import { config } from './vendure-config';
import * as dotenv from 'dotenv';

dotenv.config();

runMigrations(config)
  .then(() => bootstrap(config))
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });