import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { logger } from "../utils";

export default async function localStorage() {
  return {
    async uploadFile(file: Express.Multer.File) {
      try {
        const uploadDir = path.join(__dirname, "..", "uploads");
        const fileExtension = file?.originalname
          ?.split(".")
          ?.pop()
          ?.toLowerCase();
        const newFileName = `${uuidv4().toString()}.${fileExtension}`;
        const filePath = path.join(uploadDir, newFileName);
        await fs.promises.mkdir(uploadDir, { recursive: true });
        await fs.promises.writeFile(filePath, file.buffer);
        return `/uploads/${newFileName}`;
      } catch (error) {
        logger(error.message);
      }
    },
  };
}
