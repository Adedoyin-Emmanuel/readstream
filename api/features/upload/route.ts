import { Router } from "express";

import {
  upload,
  useFileUpload,
  useFileValidation,
} from "../../middlewares/upload";
import UploadController from "./controller";

const router = Router();

router.post(
  "/",
  [upload.single("file"), useFileValidation, useFileUpload],
  (req, res) => UploadController.uploadFile(req, res)
);

export default router;
