"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { FileDocument } from "@/interfaces/File";
import { authOptions } from "@/lib/auth-options";
import { gridFSBucket } from "@/lib/mongodb-mongoose";

export const revalidatePaths = async <T extends string>(paths: T[]): Promise<T[] | null> => {
	"use server";

	try {
		paths.forEach((path) => {
			revalidatePath(path);
		});

		return paths;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const getFileList = async (): Promise<FileDocument[] | null> => {
	"use server";

	// connect to the database and get the bucket
	const bucket = await gridFSBucket();

	const files = (await bucket.find().toArray()) as FileDocument[];

	if (files?.length === 0) {
		return null;
	}

	return files;
};

export const getSession = async () => {
	"use server";
	const session = await getServerSession(authOptions);

	return session;
};
