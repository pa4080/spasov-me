"use server";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { TagData, TagDoc } from "@/interfaces/Tag";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { tagDocuments_toData, tagFormData_toNewTagData } from "@/lib/process-data-tags";
import { msgs } from "@/messages";
import Tag from "@/models/tag";

export const getTags = async ({
	public: visible,
	hyphen = false,
	sorted = true,
}: {
	public?: boolean;
	hyphen?: boolean;
	sorted?: boolean;
} = {}): Promise<TagData[] | null> => {
	try {
		await connectToMongoDb();
		const tags: TagDoc[] = await Tag.find({});

		return tagDocuments_toData({ tags, visible, hyphen, sorted });
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createTag = async (data: FormData, paths: string[]): Promise<true | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		await connectToMongoDb();

		const documentData_new = tagFormData_toNewTagData({
			data,
			user_id: session?.user.id,
		});

		deleteFalsyKeys(documentData_new);

		const newTagDocument = new Tag(documentData_new);

		await newTagDocument.save();

		return true;
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const updateTag = async (
	data: FormData,
	tag_id: string,
	paths: string[]
): Promise<true | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		await connectToMongoDb();

		const documentData_new = tagFormData_toNewTagData({
			data,
			user_id: session?.user.id,
		});

		deleteFalsyKeys(documentData_new);

		const document_new = await Tag.findOneAndUpdate({ _id: tag_id }, documentData_new, {
			new: true,
			strict: true,
		});

		await document_new.save();

		return true;
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const deleteTag = async (tag_id: string, paths: string[]): Promise<true | null> => {
	try {
		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		await connectToMongoDb();

		const document_deleted = await Tag.findOneAndDelete({ _id: tag_id });

		return !!document_deleted ? true : null;
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};
