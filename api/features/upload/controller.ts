import { Request, Response } from "express";

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

    socketService.emitToRoom(`upload:${newUpload._id}`, "upload:started", {
      uploadId: newUpload._id,
      fileName: newUpload.fileName,
      status: FileProcessingStatus.PENDING,
    });

    return response(res, 200, "File uploaded successfully", newUpload);
  }
}
