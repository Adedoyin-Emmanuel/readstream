import { Request, Response } from "express";

import response from "../../utils/response";
import UploadQueue from "../../jobs/upload/upload.queue";
import { uploadRepository } from "../../repositories/upload/upload-repository";

export default class UploadController {
  private static readonly _uploadQueue = new UploadQueue();

  public static async uploadFile(req: Request, res: Response) {
    try {
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

      return response(res, 200, "File uploaded successfully", newUpload);
    } catch (error) {
      console.error("Upload error:", error);
      return response(res, 500, "Internal server error");
    }
  }
}
