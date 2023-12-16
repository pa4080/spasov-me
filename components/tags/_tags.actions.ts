"use server";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { NewTagData, TagDoc } from "@/interfaces/Tag";
import { TagItem } from "@/interfaces/_dataTypes";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb, mongo_id_obj } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import Tag from "@/models/tag";

export const getTags = async (): Promise<TagDoc[] | null> => {
	"use server";

	try {
		await connectToMongoDb();
		const tags: TagDoc[] = await Tag.find(mongo_id_obj());

		return tags;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createTag = async (data: FormData, paths: string[]): Promise<true | null> => {
	"use server";

	try {
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		await connectToMongoDb();

		const newTagData: NewTagData = {
			name: data.get("name") as string,
			description: data.get("description") as string,
			icon: data.get("icon") as string,
			tagType: data.get("tagType") as TagItem,
			creator: session?.user.id as string,
		};

		deleteFalsyKeys(newTagData);

		const newTagDocument = new Tag(newTagData);

		await newTagDocument.save();

		revalidatePaths(paths);

		return true;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const updateTag = async (
	data: FormData,
	tag_id: string,
	paths: string[]
): Promise<true | null> => {
	"use server";

	try {
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		await connectToMongoDb();

		const newTagData: NewTagData = {
			name: data.get("name") as string,
			description: data.get("description") as string,
			icon: data.get("icon") as string,
			tagType: data.get("tagType") as TagItem,
			creator: session?.user.id as string,
		};

		deleteFalsyKeys(newTagData);

		const updatedTagDocument = await Tag.findOneAndUpdate(mongo_id_obj(tag_id), newTagData, {
			new: true,
			strict: true,
		});

		await updatedTagDocument.save();

		revalidatePaths(paths);

		return true;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const deleteTag = async (tag_id: string, paths: string[]): Promise<boolean | null> => {
	"use server";

	try {
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		await connectToMongoDb();

		const deletedObject = await Tag.findOneAndDelete(mongo_id_obj(tag_id));

		if (!deletedObject) {
			return null;
		}

		revalidatePaths(paths);

		return !!deletedObject.ok;
	} catch (error) {
		console.error(error);

		return null;
	}
};
