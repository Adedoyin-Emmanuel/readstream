import { Queue } from "bullmq";

import { logger } from "../../utils";
import { Upload } from "../../models/upload";

export default class UploadQueue {
  private readonly _queue: Queue;

  constructor() {
    this._queue = new Queue("upload", {
      connection: {
        url: process.env.REDIS_URL,
      },
    });
  }

  public async add(data: Upload) {
    await this._queue.add("upload", data);

    logger(`Add document ${data._id} to processing queue`);
  }

  public async remove(fileId: string) {
    await this._queue.remove(fileId);

    logger(`Remove document ${fileId} from processing queue`);
  }
}
