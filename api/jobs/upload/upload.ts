import { Queue } from "bullmq";

import { logger } from "../../utils";

export interface IFileInfo {
  size: number;
  path: string;
  mimeType: string;
  filename: string;
  uploadedAt: string;
}

export default class UploadQueue {
  private readonly _queue: Queue;

  constructor() {
    this._queue = new Queue("upload", {
      connection: {
        url: process.env.REDIS_URL,
      },
    });
  }

  public async add(data: IFileInfo) {
    await this._queue.add("upload", data);

    logger(`Add document ${data.filename} to processing queue`);
  }

  public async remove(fileId: string) {
    await this._queue.remove(fileId);

    logger(`Remove document ${fileId} from processing queue`);
  }
}
