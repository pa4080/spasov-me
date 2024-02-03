"use server";

import { ObjectId } from "mongodb";

import { AttachedToDocument, FileData, FileDocument, FileListItem } from "@/interfaces/File";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import {
	connectToMongoDb,
	defaultChunkSize,
	gridFSBucket,
	mongo_id_obj,
} from "@/lib/mongodb-mongoose";
import { fileDocumentsToData } from "@/lib/process-data-files";
import { msgs } from "@/messages";
import AboutEntry from "@/models/about";
import FileGFS from "@/models/file";
import { Route } from "@/routes";

import { getSession, revalidatePaths } from "../_common.actions";

import { Readable } from "stream";

export const getFilesV1 = async (): Promise<FileData[] | null> => {
	try {
		/**
		 * This version of the function causes the following error at the build time:
		 *
		 * > TypeError: Cannot read properties of undefined (reading 'collection')
		 * > at new GridFSBucket (/config/workspace/spasov-me/node_modules/.pnpm/mongodb@6.2.0/node_modules/mongodb/lib/gridfs/index.js:29:35)
		 * > at f (/config/workspace/spasov-me/.next/server/chunks/843.js:1:16624)
		 * > at async m (/config/workspace/spasov-me/.next/server/app/admin/files/page.js:1:32576)
		 * > at async Z (/config/workspace/spasov-me/.next/server/app/admin/files/page.js:1:32099
		 *
		 * It is interesting on Vercel this error does not occur!
		 */
		const bucket = await gridFSBucket();

		const files = (await bucket.find().toArray()) as FileDocument[];

		if (files?.length === 0) {
			return null;
		}

		return fileDocumentsToData({ files });
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const getFiles = async (): Promise<FileData[] | null> => {
	try {
		await connectToMongoDb();
		const files = await FileGFS.find();

		if (files?.length === 0) {
			return null;
		}

		return fileDocumentsToData({ files: files.map((file) => file.toObject()) });
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const getFileList = async ({ images }: { images?: boolean } = {}): Promise<
	FileListItem[] | null
> => {
	const files = await getFiles();

	if (!files || files?.length === 0) {
		return null;
	}

	let filteredFiles = files;

	if (images) {
		filteredFiles = files.filter((file) =>
			file.filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx|gif)$/)
		);
	}

	return filteredFiles.map((file) => ({
		value: file._id.toString(),
		label: file.filename,
		sourceImage: `${Route.api.FILES}/${file._id.toString()}/${
			file.filename
		}?v=${new Date(file.uploadDate).getTime()}`,
		sourceDescription: file.filename,
	}));
};

export const createFile = async (data: FormData, paths: string[]): Promise<true | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// connect to the database and get the bucket
		const bucket = await gridFSBucket();

		/**
		 * This is much inconvenient approach.
		 * Be cause we cannot process in a loop in our case...
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
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Generate the ObjectId, connect to the db and get the bucket
		await connectToMongoDb();
		const _id = new ObjectId(file_id);
		const document = await FileGFS.findOne(_id);
		const bucket = await gridFSBucket();

		if (!document) {
			console.error(msgs("Errors")("invalidFile", { id: file_id }));

			return null;
		}

		const user_id = session?.user.id;
		const file = data.get("file") as File;
		const documentData_new = {
			description: data.get("description") as string,
			file_name: data.get("filename") as string,
			attachedTo: JSON.parse(data.get("attachedTo") as string) as AttachedToDocument[],
		};

		deleteFalsyKeys(documentData_new);

		// Process the "attachedTo" array first
		await fileAttachment_detach({
			attachedToArr_new: documentData_new.attachedTo,
			attachedToArr_old: document.toObject().metadata.attachedTo,
			file_id: file_id,
		});

		// Process the "file" itself --- TODO: uncomment the lines related to attachedTo
		if (typeof file === "object") {
			/**
			 * In this case we need to replace the file itself,
			 * so firs we need to remove it from the database, and
			 * then we need to create a new one with the same _id.
			 */

			// Remove the file from the database
			await bucket.delete(_id);

			// Override the original filename
			const filename = documentData_new.file_name || file.name;

			// Convert the blob to stream
			const buffer = Buffer.from(await file.arrayBuffer());
			const stream = Readable.from(buffer);

			const uploadStream = bucket.openUploadStreamWithId(_id, filename, {
				// Make sure to add content type so that it will be easier to set later.
				metadata: {
					description: documentData_new.description || document.metadata?.description,
					creator: new ObjectId(user_id),
					size: file.size,
					contentType: file.type,
					lastModified: file.lastModified,
					originalName: file.name,
					attachedTo: documentData_new.attachedTo || document.metadata?.attachedTo,
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

			if (document.metadata?.description !== documentData_new?.description) {
				document.metadata.description = documentData_new.description;
				await document.save();
			}

			if (documentData_new.attachedTo !== document.toObject().metadata.attachedTo) {
				document.metadata = {
					...document.toObject().metadata,
					attachedTo: documentData_new.attachedTo,
				};

				await document.save();
			}

			if (document.filename !== documentData_new?.file_name) {
				await bucket.rename(_id, documentData_new.file_name);
			}

			return true;
		}
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const deleteFile = async (file_id: string, paths: string[]): Promise<true | null> => {
	try {
		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
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

/**
 * This function is used within the other documents forms,
 * like as "About", "Portfolio/Projects", "Blog/Posts" etc.,
 * to ADD the relevant "attachedTo" item from a file.
 */
export const fileAttachment_add = async ({
	attachedDocument,
	target_file_id,
}: {
	attachedDocument: AttachedToDocument;
	target_file_id: string;
}): Promise<boolean> => {
	try {
		await connectToMongoDb();
		const target_file_ObjectId = new ObjectId(target_file_id);
		const dbFileGFSDoc = (await FileGFS.findOne(target_file_ObjectId)).toObject() as FileDocument;
		const attachedTo = (dbFileGFSDoc.metadata.attachedTo as AttachedToDocument[]) || [];

		if (!!attachedTo.find(({ _id }: { _id: string }) => _id === attachedDocument._id)) {
			return true;
		}

		return !!(await FileGFS.updateOne(
			{ _id: target_file_ObjectId },
			{
				$set: {
					"metadata.attachedTo": [
						...attachedTo,
						{
							type: attachedDocument.type,
							title: attachedDocument.title,
							_id: attachedDocument._id,
						},
					],
				},
			}
		));
	} catch (error) {
		console.error("Unable to add attached document", error);

		return false;
	}
};

/**
 * This function is used within the other documents forms,
 * like as "About", "Portfolio/Projects", "Blog/Posts" etc.,
 * to REMOVE the relevant "attachedTo" item from a file.
 */
export const fileAttachment_remove = async ({
	attachedDocument_id,
	target_file_id,
}: {
	attachedDocument_id: string;
	target_file_id: string;
}): Promise<boolean> => {
	try {
		await connectToMongoDb();
		const target_file_ObjectId = new ObjectId(target_file_id);
		const dbFileGFSDoc = (await FileGFS.findOne(target_file_ObjectId)).toObject() as FileDocument;
		const attachedTo = (dbFileGFSDoc.metadata.attachedTo as AttachedToDocument[]) || [];

		return !!(await FileGFS.updateOne(
			{ _id: target_file_ObjectId },
			{
				$set: {
					"metadata.attachedTo": attachedTo.filter(
						({ _id }: { _id: string }) => _id !== attachedDocument_id
					),
				},
			}
		));
	} catch (error) {
		console.error("Unable to remove attached document", error);

		return false;
	}
};

/**
 * This function is used within the file's form,
 * to DETACH (REMOVE) an "attachedTo" item from a file.
 * The function is used only within "fileUpdate()".
 *
 * The availability of some "attachedTo" items blocks
 * the "fileDelete()", so if we want to remove the file
 * We must manually remove the "attachedTo" items as
 * accident file remove prevention.
 */
export const fileAttachment_detach = async ({
	attachedToArr_new,
	attachedToArr_old,
	file_id,
}: {
	attachedToArr_new: AttachedToDocument[];
	attachedToArr_old: AttachedToDocument[];
	file_id: string;
}): Promise<boolean> => {
	try {
		// Init an empty array for the differences
		let attachedTo_diff: AttachedToDocument[] = [];

		// If all attachedTo items are removed
		if (attachedToArr_old?.length > 0 && !attachedToArr_new) {
			attachedTo_diff = attachedToArr_old;
		}

		// If partially "attachedTo" items are removed
		if (attachedToArr_old?.length > 0 && attachedToArr_new?.length > 0) {
			const attachedToArr_new_ids = attachedToArr_new.map(({ _id }) => _id);

			attachedTo_diff = attachedToArr_old.filter(({ _id }) => !attachedToArr_new_ids.includes(_id));
		}

		// If "attachedTo" array is not changed
		if (attachedTo_diff.length === 0) {
			return true;
		}

		// If there are differences, process them.
		await connectToMongoDb();

		// Deal with the "about-entry" documents
		const attachedTo_diff_about = attachedTo_diff.filter(({ type }) => type === "about");

		// TODO: Do the same for the other models like "portfolio", "blog", "pages", etc.
		// TODO: This should be a function with three params: attachedTo_diff_Arr, file_id, db Model
		if (attachedTo_diff_about.length > 0) {
			const about_ids = attachedTo_diff_about.map(({ _id }) => _id);

			about_ids.forEach(async (entry_id) => {
				const document = await AboutEntry.findOne(mongo_id_obj(entry_id));

				if (document) {
					if (document.attachment && document.attachment.toString() === file_id) {
						document.attachment = undefined;
					}

					if (document.gallery && document.gallery.length > 0) {
						document.gallery = document.gallery.filter(
							(gallery_file_id: ObjectId) => gallery_file_id.toString() !== file_id
						);
					}

					await document.save();
				} else {
					console.warn(
						`The entry '${entry_id}' does not exist.\n > It is safe to remove the relevant record from the 'attachedTo' array of '${file_id}'.`
					);
				}
			});
		}

		return true;
	} catch (error) {
		console.error("Unable to add attached document", error);

		return false;
	}
};
