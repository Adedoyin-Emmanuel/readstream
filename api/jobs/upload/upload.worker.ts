import { Worker } from "bullmq";

import { logger } from "../../utils";
import { IJob } from "../i-jobs-worker";

export default class UploadWorker implements IJob {
  private _worker: Worker;

  constructor() {
    this._worker = new Worker("uploads", async (job) => {
      logger(`Processing job ${job.id}`);
    });
  }
  process(): void {
    throw new Error("Method not implemented.");
  }

  public start() {
    logger("Starting upload worker");
  }
}
