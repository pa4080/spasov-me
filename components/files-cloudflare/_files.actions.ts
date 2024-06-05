"use server";

import { FileData, FileListItem, FileMetadata } from "@/interfaces/File";
import { msgs } from "@/messages";

import { AttachedToDocument } from "@/interfaces/_common-data-types";

import {
	getObject,
	getObjectListAndDelete,
	listObjects,
	updateObject,
	uploadObject,
} from "@/lib/r2s3utils";

import { fileObject_toData } from "@/lib/process-data-files-cloudflare";

import { attachedTo_detachFromTarget, getSession, revalidatePaths } from "./../_common.actions";

export const getFilesR2 = async ({
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

		const files = await fileObject_toData({ files: filesRawR2List, hyphen, visible });

		return files;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const getFileList = async ({ images }: { images?: boolean } = {}): Promise<
	FileListItem[] | null
> => {
	const files = await getFilesR2();

	if (!files || files?.length === 0) {
		return null;
	}

	let filteredFiles = files;

	if (images) {
		filteredFiles = files.filter((file) =>
			file.filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|csv|txt|docx|gif)$/)
		);
	}

	return filteredFiles
		.map((file) => ({
			value: file._id.toString(),
			label: file.filename,
			sourceImage: file.metadata.html.fileUrl,
			sourceDescription: file.filename,
		}))
		.sort(({ label: a }, { label: b }) => a.localeCompare(b));
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
		const attachedTo = JSON.parse(data.get("attachedTo") as string) as AttachedToDocument[];

		const user_id = session?.user.id as string;

		// If no new file is provided, just update the metadata
		const fileOld = await getObject({ objectKey: file_name, partNumber: 1 });
		const attachedToOld = JSON.parse(fileOld?.Metadata?.attachedto || "[]");

		// Process the "attachedTo" array first -- await attachedTo_detachFromTarget()
		await attachedTo_detachFromTarget({
			attachedToArr_new: attachedTo,
			attachedToArr_old: attachedToOld,
			target_id: file_id,
		});

		if (file && typeof file === "object") {
			// If a new file is provided, delete the old file and upload the new one
			const metadata = {
				description,
				attachedTo,
				visibility,
				creator: user_id,
				size: file.size.toString(),
				contentType: file.type,
				lastModified: file.lastModified,
				originalName: file.name,
			};

			// Override the original filename
			const filename = file_name || file.name;

			// Delete the old file. Note: file_id is the filename without extension!
			await getObjectListAndDelete({ prefix: file_id.replace(/^Id:/, "") });

			// Convert the blob to buffer
			const buffer = Buffer.from(await file.arrayBuffer());

			// Upload the new file
			return await uploadObject({
				filename,
				metadata,
				fileBody: buffer,
			});
		} else {
			if (!fileOld || !fileOld.Metadata) {
				throw new Error(msgs("Errors")("invalidFile", { id: file_name }));
			}

			const metadataParse: Record<string, string> = {};

			Object.entries(fileOld.Metadata).forEach(([key, value]) => {
				metadataParse[key] = JSON.parse(value);
			});

			const metadata = {
				description,
				attachedTo,
				visibility,
				size: metadataParse.size,
				originalName: metadataParse.originalname,
				lastModified: new Date(),
				contentType: fileOld.ContentType || metadataParse.contenttype || "application/octet-stream",
				creator: user_id,
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

export const deleteFile = async (file_id: string, paths: string[]): Promise<boolean | null> => {
	try {
		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Do the actual remove
		return await getObjectListAndDelete({ prefix: file_id.replace(/^Id:/, "") });
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
}): Promise<boolean | null> => {
	try {
		const files = await getFilesR2();
		const targetFileObj = files?.find(({ _id }: { _id: string }) => _id === target_file_id);

		if (!targetFileObj) {
			throw new Error(msgs("Errors")("invalidFile", { id: target_file_id }));
		}

		const targetFileObj_attachedTo = targetFileObj?.metadata.attachedTo;

		// Check if the document is already attached
		if (
			targetFileObj_attachedTo &&
			!!targetFileObj_attachedTo.find(({ _id }: { _id: string }) => _id === documentToAttach._id)
		) {
			return true;
		}

		const attachedToNew = [...(targetFileObj_attachedTo || []), documentToAttach];
		const session = await getSession();
		const creator = session?.user.id as string;
		const visibility = targetFileObj.metadata.visibility ? "true" : "false";

		const metadata: FileMetadata = {
			description: targetFileObj.metadata.description,
			size: targetFileObj.metadata.size,
			contentType: targetFileObj.metadata.contentType,
			lastModified: targetFileObj.metadata.lastModified,
			originalName: targetFileObj.metadata.originalName,
			visibility,
			creator,
			attachedTo: attachedToNew,
		};

		return await updateObject({ filename: targetFileObj.filename, metadata });
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
}): Promise<boolean | null> => {
	try {
		const files = await getFilesR2();
		const targetFileObj = files?.find(({ _id }: { _id: string }) => _id === target_file_id);

		if (!targetFileObj) {
			throw new Error(msgs("Errors")("invalidFile", { id: target_file_id }));
		}

		const attachedToNew = targetFileObj?.metadata.attachedTo?.filter(
			({ _id }: { _id: string }) => _id !== attachedDocument_id
		);
		const session = await getSession();
		const creator = session?.user.id as string;
		const visibility = targetFileObj.metadata.visibility ? "true" : "false";

		const metadata: FileMetadata = {
			description: targetFileObj.metadata.description,
			size: targetFileObj.metadata.size,
			contentType: targetFileObj.metadata.contentType,
			lastModified: targetFileObj.metadata.lastModified,
			originalName: targetFileObj.metadata.originalName,
			visibility,
			creator,
			attachedTo: attachedToNew,
		};

		return await updateObject({ filename: targetFileObj.filename, metadata });
	} catch (error) {
		console.error("Unable to remove attached document from a File: ", error);

		return false;
	}
};
