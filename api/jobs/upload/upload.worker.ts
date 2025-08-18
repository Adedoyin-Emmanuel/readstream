import fs from "fs";
import path from "path";
import { Job, Worker } from "bullmq";

import { logger } from "../../utils";
import { IJob } from "../i-jobs-worker";
import socketService from "../../services/socket";
import { FileProcessingStatus } from "../../models/upload";
import { uploadRepository } from "../../repositories/upload/upload-repository";

export default class UploadWorker implements IJob {
  private _worker: Worker;

  constructor() {
    this._worker = new Worker(
      "uploads",
      async (job) => {
        logger(`Processing job ${job.id}`);
        logger(`Job data: ${JSON.stringify(job.data)}`);

        await this.process(job);
      },
      {
        connection: {
          url: process.env.REDIS_URL,
        },
      }
    );
  }

  async process(job: Job) {
    const upload = await uploadRepository.findById(job.data._id);

    if (!upload) {
      throw new Error("Upload not found");
    }

    switch (upload.status) {
      case FileProcessingStatus.PENDING:
        await uploadRepository.update(upload._id, {
          status: FileProcessingStatus.PROCESSING,
        });

        socketService.emitToRoom(`upload:${upload._id}`, "upload:processing", {
          uploadId: upload._id,
          fileName: upload.fileName,
          status: FileProcessingStatus.PROCESSING,
        });
        break;
      case FileProcessingStatus.PROCESSING:
        logger(`Upload ${upload._id} is already being processed`);
        break;
      case FileProcessingStatus.COMPLETED:
        logger(`Upload ${upload._id} is already completed`);
        break;
      default:
        throw new Error("Invalid upload status");
    }

    const absolutePath = path.join(__dirname, "..", "..", upload.path);
    const file = fs.readFileSync(absolutePath, "utf8");

    const { marked } = await import("marked");
    const htmlContent = await marked.parse(file);

    await uploadRepository.update(upload._id, {
      status: FileProcessingStatus.COMPLETED,
      htmlContent: htmlContent,
    });

    socketService.emitToRoom(`upload:${upload._id}`, "upload:completed", {
      uploadId: upload._id,
      htmlContent: htmlContent,
      fileName: upload.fileName,
      status: FileProcessingStatus.COMPLETED,
    });
  }

  public start() {
    logger("Starting upload worker");

    this._worker.on("completed", (job) => {
      logger(`Job ${job.id} completed successfully`);
    });

    this._worker.on("failed", async (job, err) => {
      logger(`Job ${job?.id} failed: ${err.message}`);

      if (job?.data?._id) {
        socketService.emitToRoom(`upload:${job.data._id}`, "upload:failed", {
          uploadId: job.data._id,
          fileName: job.data.fileName,
          error: err.message,
          status: "failed",
        });

        socketService.emitToRoom("uploads", "upload:failed", {
          uploadId: job.data._id,
          fileName: job.data.fileName,
          error: err.message,
          status: "failed",
        });

        logger(`Emitted upload:failed to rooms for upload ${job.data._id}`);
      }

      if (job?.data?._id) {
        await uploadRepository.update(job.data._id, {
          status: FileProcessingStatus.FAILED,
        });
      }
    });

    this._worker.on("error", (err) => {
      logger(`Worker error: ${err.message}`);
    });
  }
}
