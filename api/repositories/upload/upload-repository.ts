import IUploadRepository from "./i-upload-repository";
import { Upload, UploadModel } from "./../../models/upload";
import { Repository } from "./../../repositories/base/repository";

export default class UploadRepository
  extends Repository<Upload>
  implements IUploadRepository {}

export const uploadRepository = new UploadRepository(UploadModel);
