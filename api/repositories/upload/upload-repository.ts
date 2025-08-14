import { Upload } from "./../../models/upload";
import IUploadRepository from "./i-upload-repository";
import { Repository } from "repositories/base/repository";

export default class UploadRepository
  extends Repository<Upload>
  implements IUploadRepository {}
