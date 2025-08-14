import { Queue } from "bullmq";

import { logger } from "../../utils";

interface IUploadJobData {
  fileId: string;
}

export default class UploadJob {
  private readonly _queue: Queue;

  constructor() {
    this._queue = new Queue("upload", {
      connection: {
        url: process.env.REDIS_URL,
      },
    });
  }

  public async add(data: IUploadJobData) {
    await this._queue.add("upload", data);

    logger(`Add document ${data.fileId} to processing queue`);
  }

  public async remove(fileId: string) {
    await this._queue.remove(fileId);

    logger(`Remove document ${fileId} from processing queue`);
  }
}
