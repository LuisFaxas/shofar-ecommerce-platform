import { bootstrapWorker } from "@vendure/core";
import { config } from "./vendure-config";
import * as dotenv from "dotenv";

dotenv.config();

bootstrapWorker(config)
  .then((worker) => worker.startJobQueue())
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
