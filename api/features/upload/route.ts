import { Router } from "express";

import {
  upload,
  useFileUpload,
  useFileSizeLimit,
} from "../../middlewares/upload";
import UploadController from "./controller";

const router = Router();

router.post(
  "/",
  [useFileUpload, upload.single("file"), useFileSizeLimit],
  UploadController.uploadFile
);

export default router;
