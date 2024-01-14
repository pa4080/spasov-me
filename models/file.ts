import { Schema, model, models } from "mongoose";

import User from "./user";

/**
 * @see https://stackoverflow.com/questions/32073183/mongodb-populate-gridfs-files-metadata-in-parent-document
 */

const MONGODB_FILES_BUCKET_NAME = process.env.MONGODB_FILES_BUCKET_NAME;

const FileGFS_Schema = new Schema(
	{
		metadata: {
			description: String,
			creator: {
				type: Schema.Types.ObjectId,
				ref: User,
			},
		},
	},
	{ strict: false }
);

// const FileGFS = models.FileGFS || model("FileGFS", FileGFS_Schema, `fs.files`); // "fs" is the default GridFS bucket name
const FileGFS =
	models.FileGFS || model("FileGFS", FileGFS_Schema, `${MONGODB_FILES_BUCKET_NAME}.files`);

export default FileGFS;
