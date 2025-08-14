import { Request, Response } from "express";

import response from "../../utils/response";
import UploadQueue, { IFileInfo } from "./../../jobs/upload/upload";

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

      const fileInfo: IFileInfo = {
        path: filePath,
        size: file.size,
        mimeType: file.mimetype,
        filename: file.originalname,
        uploadedAt: new Date().toISOString(),
      };

      await this._uploadQueue.add(fileInfo);

      return response(res, 200, "File uploaded successfully", fileInfo);
    } catch (error) {
      console.error("Upload error:", error);
      return response(res, 500, "Internal server error");
    }
  }
}
