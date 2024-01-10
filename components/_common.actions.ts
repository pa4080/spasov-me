"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { FileDocument, FileListItem } from "@/interfaces/File";
import { authOptions } from "@/lib/auth-options";
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

		return paths;
		// Using redirect() here cause a Next.js error
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		if (redirectTo) {
			redirect(redirectTo);
		}
	}
};

export const getFiles = async (): Promise<FileDocument[] | null> => {
	"use server";

	// connect to the database and get the bucket
	const bucket = await gridFSBucket();

	const files = (await bucket.find().toArray()) as FileDocument[];

	if (files?.length === 0) {
		return null;
	}

	return files;
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
