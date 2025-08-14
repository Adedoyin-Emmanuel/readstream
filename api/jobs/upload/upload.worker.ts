import { logger } from "../../utils";

import { Worker, Job } from "bullmq";

export default class UploadWorker {
  private _worker: Worker;

  constructor() {
    this._worker = new Worker("uploads", async (job) => {
      logger(`Processing job ${job.id}`);
    });
  }

  public start() {
    logger("Starting upload worker");
  }
}
