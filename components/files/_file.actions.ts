"use server";

import { FileData, FileDocument, FileListItem } from "@/interfaces/File";
import fileDocumentToData from "@/lib/file-doc-to-file-data";
import { gridFSBucket } from "@/lib/mongodb-mongoose";

export const getFiles = async (): Promise<FileData[] | null> => {
	"use server";

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
