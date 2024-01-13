import { Schema, model, models } from "mongoose";

import User from "./user";

/**
 * @see https://stackoverflow.com/questions/32073183/mongodb-populate-gridfs-files-metadata-in-parent-document
 */

const MONGODB_FILES_BUCKET_NAME = process.env.MONGODB_FILES_BUCKET_NAME;

const FileSchema = new Schema(
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

const File = models.GridFS || model("GridFS", FileSchema, `${MONGODB_FILES_BUCKET_NAME}.files`);

export default File;
