import fs from "fs";
import { Request, Response } from "express";

import response from "../../utils/response";

export default class UploadController {
  public static async uploadFile(req: Request, res: Response) {
    try {
      const file = req.file;

      if (!file) {
        return response(res, 400, "No file uploaded");
      }

      if (!req.storage) {
        return response(res, 500, "Storage service not available");
      }

      const filePath = await req.storage.uploadFile(file);

      if (!filePath) {
        return response(res, 500, "Failed to upload file");
      }

      const fileInfo = {
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: filePath,
        uploadedAt: new Date().toISOString(),
      };

      return response(res, 200, "File uploaded successfully", fileInfo);
    } catch (error) {
      console.error("Upload error:", error);
      return response(res, 500, "Internal server error");
    }
  }
}
