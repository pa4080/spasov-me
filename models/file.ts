import { type HydratedDocument, Schema, model, models } from "mongoose";

import { type FileDoc } from "@/interfaces/File";

import User from "./user";

/**
 * For the purpose of this object:
 * @see https://stackoverflow.com/questions/32073183/mongodb-populate-gridfs-files-metadata-in-parent-document
 *
 * For details about the Type Casting:
 * @see https://mongoosejs.com/docs/typescript.html#creating-your-first-document
 *
 * "fs" is the default GridFS bucket name:
 *
 * > const FileGFS = models.FileGFS || model("FileGFS", FileGFS_Schema, `fs.files`);
 */
const MONGODB_FILES_BUCKET_NAME = process.env.MONGODB_FILES_BUCKET_NAME;

const FileGFS_Schema = new Schema<FileDoc>(
  {
    metadata: {
      description: {
        type: String,
      },
      creator: {
        type: Schema.Types.ObjectId,
        ref: User,
      },
      size: {
        type: String,
      },
      contentType: {
        type: String,
      },
      lastModified: {
        type: Date,
      },
      originalName: {
        type: String,
      },
      visibility: {
        type: Boolean,
        default: true,
        required: [true, "Visibility is required!"],
      },
      attachedTo: [], // AttachedToDocument[]; use [], otherwise we need to use: Schema > Model > Collection > ObjectIds
    },
  },
  { strict: false }
);

const FileGFS =
  models.FileGFS<HydratedDocument<FileDoc>> ||
  model<FileDoc>("FileGFS", FileGFS_Schema, `${MONGODB_FILES_BUCKET_NAME}.files`);

export default FileGFS;
