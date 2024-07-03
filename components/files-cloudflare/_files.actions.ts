"use server";

import { Redis } from "@upstash/redis";

const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL,
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

import { FileData, FileListItem, FileMetadata } from "@/interfaces/File";
import { AttachedToDocument } from "@/interfaces/_common-data-types";
import {
	getObject,
	getObjectListAndDelete,
	listObjects,
	updateObject,
	uploadObject,
} from "@/lib/aws";
import { fileObject_toData } from "@/lib/process-data-files-cloudflare";
import { redisGet_SSR_Solution } from "@/lib/redis-get";
import { msgs } from "@/messages";
import { attachedTo_detachFromTarget, getSession, revalidatePaths } from "./../_common.actions";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

export const getFilesR2 = async ({
	hyphen = true,
	public: visible = false,
	prefix = files_prefix,
}: {
	hyphen?: boolean;
	public?: boolean;
	prefix?: string;
} = {}): Promise<FileData[] | null> => {
	try {
		// Check if the "files" array is already cached in Redis
		const cachedFiles = await redisGet_SSR_Solution<FileData[]>(prefix);

		if (cachedFiles) {
			return cachedFiles;
		}

		const filesRawR2List = await listObjects({ prefix });

		if (filesRawR2List?.length === 0) {
			return null;
		}

		const files = await fileObject_toData({
			files: filesRawR2List,
			hyphen,
			visible,
			prefix,
		});

		// Set the "files"/"icons" array in Redis
		await redis.set(prefix, JSON.stringify(files));

		return files;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const getFileList = async ({
	images,
	prefix,
}: { images?: boolean; prefix?: string } = {}): Promise<FileListItem[] | null> => {
	const files = await getFilesR2({ prefix });

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

export const createFile = async ({
	data,
	paths,
	prefix,
}: {
	data: FormData;
	paths: string[];
	prefix: string;
}): Promise<boolean | null> => {
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

		await redis.del("files");

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
				objectKey: filename,
				metadata,
				objectBody: buffer,
				prefix,
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

export const updateFile = async ({
	data,
	filename,
	file_id,
	paths,
	prefix,
}: {
	data: FormData;
	filename: string;
	file_id: string;
	paths: string[];
	prefix: string;
}): Promise<boolean | null> => {
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
		const fileOld = await getObject({ objectKey: file_name, partNumber: 1, prefix });
		const attachedToOld = JSON.parse(fileOld?.Metadata?.attachedto || "[]");

		// Process the "attachedTo" array first -- await attachedTo_detachFromTarget()
		await attachedTo_detachFromTarget({
			attachedToArr_new: attachedTo,
			attachedToArr_old: attachedToOld,
			target_id: file_id,
		});

		await redis.del("files");

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
			await getObjectListAndDelete({ prefix: `${prefix}/${file_id.replace(/^Id:/, "")}` });

			// Convert the blob to buffer
			const buffer = Buffer.from(await file.arrayBuffer());

			// Upload the new file
			return await uploadObject({
				objectKey: filename,
				metadata,
				objectBody: buffer,
				prefix,
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

			return await updateObject({ objectKey: filename, metadata, prefix });
		}
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const deleteFile = async ({
	file_id,
	paths,
	prefix,
}: {
	file_id: string;
	paths: string[];
	prefix: string;
}): Promise<boolean | null> => {
	try {
		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		await redis.del("files");

		// Do the actual remove
		return await getObjectListAndDelete({
			prefix: `${prefix}/${file_id.replace(/^Id:/, "")}`,
		});
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
	prefix,
}: {
	documentToAttach: AttachedToDocument;
	target_file_id: string;
	prefix: string;
}): Promise<boolean | null> => {
	try {
		let files: FileData[] | null;

		if (prefix === "all_prefixes") {
			const getFiles = (await getFilesR2({ prefix: files_prefix })) || [];
			const getIcons = (await getFilesR2({ prefix: icons_prefix })) || [];
			files = [...getFiles, ...getIcons];
		} else {
			files = await getFilesR2({ prefix });
		}

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

		return await updateObject({
			objectKey: targetFileObj.objectKey,
			metadata,
			prefix: prefix === "all_prefixes" ? undefined : prefix,
		});
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
	prefix,
}: {
	attachedDocument_id: string;
	target_file_id: string;
	prefix: string;
}): Promise<boolean | null> => {
	try {
		let files: FileData[] | null;

		if (prefix === "all_prefixes") {
			const getFiles = (await getFilesR2({ prefix: files_prefix })) || [];
			const getIcons = (await getFilesR2({ prefix: icons_prefix })) || [];
			files = [...getFiles, ...getIcons];
		} else {
			files = await getFilesR2({ prefix });
		}

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

		return await updateObject({
			objectKey: targetFileObj.objectKey,
			metadata,
			prefix: prefix === "all_prefixes" ? undefined : prefix,
		});
	} catch (error) {
		console.error("Unable to remove attached document from a File: ", error);

		return false;
	}
};
