import { logger } from "./../utils";
import { IJob } from "./i-jobs-worker";
import UploadWorker from "./upload/upload.worker";

export default class JobsConfig {
  private readonly _workers: IJob[];

  constructor() {
    this._workers = [new UploadWorker()];
  }

  public start() {
    this._workers.forEach((worker) => {
      worker.start();
    });

    logger("All workers started");
  }
}
