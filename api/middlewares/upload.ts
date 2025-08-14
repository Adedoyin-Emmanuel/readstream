import multer from "multer";
import { Request, Response, NextFunction } from "express";

import {
  MAX_FILE_SIZE,
  ALLOWED_FILE_UPLOAD_EXTENSIONS,
} from "../constants/app";
import { logger } from "../utils/";
import response from "../utils/response";
import localStorage from "../services/upload";
import { LIMIT_FILE_SIZE, UNSUPPORTED_FILE_TYPE } from "../constants/errors";

declare global {
  namespace Express {
    interface Request {
      storage?: {
        uploadFile: (file: Express.Multer.File) => Promise<string | undefined>;
      };
    }
  }
}

const storage = multer.memoryStorage();

const useFileSizeLimit = async (
  error: any,
  req: Request,
  res: Response,
  next: any
) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return response(res, 413, LIMIT_FILE_SIZE);
  }
};

const fileFilter = async (req: Request, file: Express.Multer.File, cb: any) => {
  try {
    const allowedExtension = ALLOWED_FILE_UPLOAD_EXTENSIONS;
    const fileExtension = file?.originalname?.split(".")?.pop()?.toLowerCase();
    if (allowedExtension.includes(fileExtension as string)) {
      return cb(null, true);
    }
    const error: any = new Error(UNSUPPORTED_FILE_TYPE);
    error.code = "UNSUPPORTED_FILE_TYPE";
    return cb(error);
  } catch (err) {
    logger(err.message);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

const useFileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    req.storage = await localStorage();
    next();
  } catch (error) {
    next(error);
  }
};

export { useFileUpload, upload, useFileSizeLimit };
