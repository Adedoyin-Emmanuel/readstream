import { Request, Response } from "express";

import { logger } from "../../utils";
import response from "../../utils/response";
import socketService from "../../services/socket";
import UploadQueue from "../../jobs/upload/upload.queue";
import { FileProcessingStatus } from "../../models/upload";
import { uploadRepository } from "../../repositories/upload/upload-repository";

export default class UploadController {
  private static readonly _uploadQueue = new UploadQueue();

  public static async uploadFile(req: Request, res: Response) {
    const file = req.file;

    if (!file) {
      return response(res, 400, "No file uploaded");
    }

    const filePath = await req.storage.uploadFile(file);

    if (!filePath) {
      return response(res, 500, "Failed to upload file");
    }

    const newUpload = await uploadRepository.create({
      fileName: file.originalname,
      path: filePath,
      size: file.size,
      htmlContent: "",
    });

    await this._uploadQueue.add(newUpload);

    const uploadEvent = {
      uploadId: newUpload._id,
      fileName: newUpload.fileName,
      status: FileProcessingStatus.PENDING,
    };

    await new Promise((resolve) => setTimeout(resolve, 10000));

    socketService.emitToRoom("uploads", "upload:started", uploadEvent);

    logger(
      `Emitted upload:started to general room for upload ${newUpload._id}`
    );

    socketService.emitToRoom(
      `upload:${newUpload._id}`,
      "upload:started",
      uploadEvent
    );

    logger(`Emitted upload:started to specific room upload:${newUpload._id}`);

    return response(res, 200, "File uploaded successfully", newUpload);
  }
}
