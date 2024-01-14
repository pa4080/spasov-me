"use server";

import { ObjectId } from "mongodb";

import { FileData, FileDocument, FileListItem } from "@/interfaces/File";
import fileDocumentToData from "@/lib/file-doc-to-file-data";
import { defaultChunkSize, gridFSBucket } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";

import FileGFS from "@/models/file";

import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";

import { getSession, revalidatePaths } from "../_common.actions";

import { Readable } from "stream";

export const getFiles = async (): Promise<FileData[] | null> => {
	try {
		// connect to the database and get the bucket
		const bucket = await gridFSBucket();

		const files = (await bucket.find().toArray()) as FileDocument[];

		if (files?.length === 0) {
			return null;
		}

		return fileDocumentToData(files);
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const getFileList = async (): Promise<FileListItem[] | null> => {
	const files = await getFiles();

	if (!files || files?.length === 0) {
		return null;
	}

	return files
		.filter((file) => file.filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx|gif)$/))
		.map((file) => ({
			value: file._id.toString(),
			label: file.filename,
		}));
};

export const createFile = async (data: FormData, paths: string[]): Promise<true | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		// connect to the database and get the bucket
		const bucket = await gridFSBucket();

		/**
		 * This is much inconvenient approach.
		 *
		const formEntries = Array.from(data.entries());
		const description = formEntries.find((entry) => entry[0] === "description")?.[1] as string;
		const file_name = formEntries.find((entry) => entry[0] === "name")?.[1] as string;
		const user_id = formEntries.find((entry) => entry[0] === "user_id")?.[1] as string;
		const file_form_field = formEntries.find((entry) => entry[0] === "file")?.[1];
		 */

		const file = data.get("file") as File;
		const description = data.get("description") as string;
		const file_name = data.get("filename") as string;
		const user_id = session?.user.id as string;

		if (typeof file === "object") {
			// Override the original filename
			const filename = file_name || file.name;

			// Convert the blob to stream
			const buffer = Buffer.from(await file.arrayBuffer());
			const stream = Readable.from(buffer);

			const uploadStream = bucket.openUploadStream(filename, {
				// Make sure to add content type so that it will be easier to set later.
				metadata: {
					description,
					creator: new ObjectId(user_id),
					size: file.size,
					contentType: file.type,
					lastModified: file.lastModified,
					originalName: file.name,
				},
				chunkSizeBytes: file.size < defaultChunkSize ? file.size + 4 : defaultChunkSize,
			});

			// Pipe the readable stream to a writeable stream to save it to the database
			const dbObject = stream.pipe(uploadStream);

			await new Promise((resolve, reject) => {
				uploadStream.on("finish", resolve);
				uploadStream.on("error", reject);
			});

			return dbObject.id ? true : null;
		} else {
			console.error(msgs("Errors")("invalidFile"));

			return null;
		}
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const updateFile = async (
	data: FormData,
	file_id: string,
	paths: string[]
): Promise<true | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		// Generate the ObjectId, connect to the db and get the bucket
		const _id = new ObjectId(file_id);
		const dbDocument = await FileGFS.findOne(_id);
		const bucket = await gridFSBucket();

		if (!dbDocument) {
			console.error(msgs("Errors")("invalidFile", { id: file_id }));

			return null;
		}

		const user_id = session?.user.id as string;
		const file = data.get("file") as File;
		const newDocData = {
			description: data.get("description") as string,
			file_name: data.get("filename") as string,
		};

		deleteFalsyKeys(newDocData);

		if (typeof file === "object") {
			/**
			 * In this case we need to replace the file itself,
			 * so firs we need to remove it from the database, and
			 * then we need to create a new one with the same _id.
			 */

			// Remove the file from the database
			await bucket.delete(_id);

			// Override the original filename
			const filename = newDocData.file_name || file.name;

			// Convert the blob to stream
			const buffer = Buffer.from(await file.arrayBuffer());
			const stream = Readable.from(buffer);

			const uploadStream = bucket.openUploadStreamWithId(_id, filename, {
				// Make sure to add content type so that it will be easier to set later.
				metadata: {
					description: newDocData.description || dbDocument.metadata?.description,
					creator: new ObjectId(user_id),
					size: file.size,
					contentType: file.type,
					lastModified: file.lastModified,
					originalName: file.name,
				},
				chunkSizeBytes: file.size < defaultChunkSize ? file.size + 4 : defaultChunkSize,
			});

			// Pipe the readable stream to a writeable stream to save it to the database
			const dbObject = stream.pipe(uploadStream);

			await new Promise((resolve, reject) => {
				uploadStream.on("finish", resolve);
				uploadStream.on("error", reject);
			});

			return dbObject.id ? true : null;
		} else {
			/**
			 * In this case we only need to update the "metadata", and/or the "filename".
			 * So we do not need to create a new file and stream its content.
			 */

			if (
				newDocData.description !== undefined &&
				dbDocument.metadata?.description !== newDocData.description
			) {
				dbDocument.metadata.description = newDocData.description;
				dbDocument.save();
			}

			if (newDocData.file_name !== undefined && dbDocument.filename !== newDocData.file_name) {
				bucket.rename(_id, newDocData.file_name);
			}

			return null;
		}
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const removeFile = async (file_id: string, paths: string[]): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		const bucket = await gridFSBucket();
		const _id = new ObjectId(file_id);

		// Just check if does the file exists
		const files = await bucket.find({ _id }).toArray();

		if (files.length === 0) {
			return null;
		}

		// Do the actual remove
		await bucket.delete(_id);

		return true;
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};
