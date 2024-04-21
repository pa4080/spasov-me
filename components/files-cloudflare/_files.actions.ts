"use server";

import { ObjectId } from "mongodb";

import { FileData, FileDoc, FileListItem } from "@/interfaces/File";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import FileGFS from "@/models/file";

import { AttachedToDocument } from "@/interfaces/_common-data-types";

import {
	getObject,
	getObjectListAndDelete,
	listObjects,
	updateObject,
	uploadObject,
} from "@/lib/r2s3utils";

import { processMarkdown } from "@/lib/process-markdown";

import { r2BucketDomain } from "@/env";

import { getSession, revalidatePaths } from "../_common.actions";

export const getFiles = async ({
	hyphen = true,
	public: visible = false,
}: {
	hyphen?: boolean;
	public?: boolean;
} = {}): Promise<FileData[] | null> => {
	try {
		const filesRawR2List = await listObjects();

		if (filesRawR2List?.length === 0) {
			return null;
		}

		const files: FileData[] = [];

		/**
		 * Notes:
		 *
		 * We cannot use GetObjectAttributesCommand,
		 * because CloudFlare R2 returns not implemented...
		 * So this is the reason we are using the most expensive
		 * GetObjectCommand @getObject(), which returns also the
		 * object itself.
		 */

		await Promise.all(
			filesRawR2List.map(async (file_raw) => {
				const file = await getObject({ objectKey: file_raw.Key!, partNumber: 1 });

				const _id = file_raw.Key!.replace(/\..*$/, ""); // Note: file_id is the filename without extension!
				const filename = file_raw.Key!;
				const uploadDate = file?.LastModified || new Date();
				const length = file?.ContentLength || 0;
				const description = getMetadataValue(file?.Metadata, "description", "");

				const f: FileData = {
					_id,
					filename,
					uploadDate,
					length,
					metadata: {
						description: description,
						size: getMetadataValue(file?.Metadata, "size", ""),
						contentType: getMetadataValue(file?.Metadata, "contenttype", ""),
						lastModified: getMetadataValue(file?.Metadata, "lastmodified", new Date()),
						originalName: getMetadataValue(file?.Metadata, "originalname", ""),
						attachedTo: file?.Metadata?.attachedto
							? JSON.parse(file?.Metadata?.attachedto)
							: undefined,
						visibility:
							getMetadataValue(file?.Metadata, "visibility", "") === "true" ? true : false,
						html: {
							filename: filename,
							title: processMarkdown({ markdown: filename, hyphen: true }),
							description: processMarkdown({ markdown: description, hyphen }),
							fileUrl: `https://${r2BucketDomain}/${filename}`,
						},
					},
				};

				files.push(f);
			})
		);

		return visible ? files.filter((file) => file.metadata?.visibility === true) : files;
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
		sourceImage: file.metadata.html.fileUrl,
		sourceDescription: file.filename,
	}));
};

export const createFile = async (data: FormData, paths: string[]): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		const file = data.get("file") as File;
		const description = data.get("description") as string;
		const file_name = data.get("filename") as string;
		const visibility = data.get("visibility") as string;

		const user_id = session?.user.id as string;

		const metadata = {
			description,
			creator: user_id,
			size: file.size.toString(),
			contentType: file.type,
			lastModified: file.lastModified,
			originalName: file.name,
			visibility,
		};

		if (typeof file === "object") {
			// Override the original filename
			const filename = file_name || file.name;

			// Convert the blob to buffer
			const buffer = Buffer.from(await file.arrayBuffer());

			return await uploadObject({
				filename,
				metadata,
				fileBody: buffer,
			});
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
	filename: string,
	file_id: string,
	paths: string[]
): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		const file = data.get("file") as File;
		const description = data.get("description") as string;
		const file_name = data.get("filename") as string;
		const visibility = data.get("visibility") as string;

		const user_id = session?.user.id as string;

		if (file && typeof file === "object") {
			// If a new file is provided, delete the old file and upload the new one
			const metadata = {
				description,
				creator: user_id,
				size: file.size.toString(),
				contentType: file.type,
				lastModified: file.lastModified,
				originalName: file.name,
				visibility,
			};

			// Override the original filename
			const filename = file_name || file.name;

			// Delete the old file. Note: file_id is the filename without extension!
			await getObjectListAndDelete({ prefix: file_id });

			// Convert the blob to buffer
			const buffer = Buffer.from(await file.arrayBuffer());

			// Upload the new file
			return await uploadObject({
				filename,
				metadata,
				fileBody: buffer,
			});
		} else {
			// If no new file is provided, just update the metadata
			const file = await getObject({ objectKey: file_name, partNumber: 1 });

			if (!file || !file.Metadata) {
				throw new Error(msgs("Errors")("invalidFile", { id: file_name }));
			}

			const metadataParse: Record<string, string> = {};

			Object.entries(file.Metadata).forEach(([key, value]) => {
				metadataParse[key] = JSON.parse(value);
			});

			const metadata = {
				size: metadataParse.size,
				originalName: metadataParse.originalname,
				lastModified: new Date(),
				contentType: file.ContentType || metadataParse.contenttype || "application/octet-stream",
				description,
				creator: user_id,
				visibility,
			};

			return await updateObject({ filename, metadata });
		}
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const deleteFile = async (filename: string, paths: string[]): Promise<true | null> => {
	try {
		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Do the actual remove
		await getObjectListAndDelete({ prefix: filename });

		return true;
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

/**
 * This function is used within the other documents,
 * like as "About", "Portfolio/Projects", "Blog/Posts" etc.,
 * to ADD the relevant "attachedTo" item to a File.
 */
export const fileAttachment_add = async ({
	documentToAttach,
	target_file_id,
}: {
	documentToAttach: AttachedToDocument;
	target_file_id: string;
}): Promise<boolean> => {
	try {
		await connectToMongoDb();
		const target_file_ObjectId = new ObjectId(target_file_id);
		const dbFileGFSDoc = (await FileGFS.findOne(target_file_ObjectId)).toObject() as FileDoc;
		const attachedTo = (dbFileGFSDoc.metadata.attachedTo as AttachedToDocument[]) || [];

		// Check if the document is already attached
		if (!!attachedTo.find(({ _id }: { _id: string }) => _id === documentToAttach._id)) {
			return true;
		}

		return !!(await FileGFS.updateOne(
			{ _id: target_file_ObjectId },
			{
				$set: {
					"metadata.attachedTo": [
						...attachedTo,
						{
							modelType: documentToAttach.modelType,
							title: documentToAttach.title,
							_id: documentToAttach._id,
						},
					],
				},
			}
		));
	} catch (error) {
		console.error("Unable to add attached document to a File: ", error);

		return false;
	}
};

/**
 * This function is used within the other documents,
 * like as "About", "Portfolio/Projects", "Blog/Posts" etc.,
 * to REMOVE the relevant "attachedTo" item from a File.
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
		const dbFileGFSDoc = (await FileGFS.findOne(target_file_ObjectId)).toObject() as FileDoc;
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
		console.error("Unable to remove attached document from a File: ", error);

		return false;
	}
};

/**
 * Helper function to get the metadata value
 */
const getMetadataValue = <T>(
	metadata: Record<string, string> | undefined,
	key: string,
	defaultValue: T
) => {
	return metadata?.[key] ? JSON.parse(metadata?.[key]) : defaultValue;
};
