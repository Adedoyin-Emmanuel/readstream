import { Types } from "mongoose";

import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

export enum FileProcessingStatus {
  FAILED = "failed",
  PENDING = "pending",
  COMPLETED = "completed",
  PROCESSING = "processing",
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    versionKey: false,
  },
})
class Upload {
  _id?: Types.ObjectId;

  @prop({ required: true })
  fileName: string;

  @prop({ required: true })
  path: string;

  @prop({ required: true })
  size: number;

  @prop({ required: false, default: "" })
  htmlContent: string;

  @prop({ required: true, default: FileProcessingStatus.PENDING })
  status: FileProcessingStatus;
}

const UploadModel = getModelForClass(Upload);

export { Upload, UploadModel };
