/**
 * @see https://stackoverflow.com/questions/32073183/mongodb-populate-gridfs-files-metadata-in-parent-document
 */
import { Schema, model, models } from "mongoose";

const MONGODB_FILES_BUCKET_NAME = process.env.MONGODB_FILES_BUCKET_NAME;

// TODO: Use this schema to create a new file, add our custom props
// const GridFSFileSchema = new Schema({
// 	filename: String,
// 	contentType: String,
// 	length: Number,
// 	chunkSize: Number,
// 	uploadDate: Date,
// 	aliases: [String],
// 	metadata: Schema.Types.Mixed,
// 	bucketName: String,
// });

export const GridFS =
	models.GridFS ||
	model("GridFS", new Schema({}, { strict: false }), `${MONGODB_FILES_BUCKET_NAME}.files`);
