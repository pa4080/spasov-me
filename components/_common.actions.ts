"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FileData, FileDocument, FileListItem } from "@/interfaces/File";
import { authOptions } from "@/lib/auth-options";
import fileDocumentToData from "@/lib/file-doc-to-file-data";
import { gridFSBucket } from "@/lib/mongodb-mongoose";

export const revalidatePaths = async <T extends string>({
	paths,
	redirectTo,
}: {
	paths: T[];
	redirectTo?: T;
}): Promise<T[] | null | void> => {
	"use server";

	try {
		paths.forEach((path) => {
			revalidatePath(path);
		});

		// redirect() cause a specific Next.js error,
		// so it must be outside the try block!

		return paths;
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		if (redirectTo) {
			redirect(redirectTo);
		}
	}
};

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

export const getSession = async () => {
	"use server";
	const session = await getServerSession(authOptions);

	return session;
};
