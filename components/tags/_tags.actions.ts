"use server";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { NewTagData, TagData, TagDoc } from "@/interfaces/Tag";
import { TagType } from "@/interfaces/_common-data-types";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import Tag from "@/models/tag";

export const getTags = async (): Promise<TagData[] | null> => {
	try {
		await connectToMongoDb();
		const tags: TagDoc[] = await Tag.find({});

		return tags.map((tag) => ({
			_id: tag._id.toString(),
			name: tag.name,
			description: tag.description,
			icon: tag.icon,
			tagType: tag.tagType,
			orderKey: tag.orderKey,
		}));
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

		const newTagData: NewTagData = {
			name: data.get("name") as string,
			description: data.get("description") as string,
			icon: data.get("icon") as string,
			tagType: data.get("tagType") as TagType,
			creator: session?.user.id as string,
			orderKey: data.get("orderKey") as string,
		};

		deleteFalsyKeys(newTagData);

		const newTagDocument = new Tag(newTagData);

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

		const newTagData: NewTagData = {
			name: data.get("name") as string,
			description: data.get("description") as string,
			icon: data.get("icon") as string,
			tagType: data.get("tagType") as TagType,
			orderKey: data.get("orderKey") as string,
			creator: session?.user.id as string,
		};

		deleteFalsyKeys(newTagData);

		const updatedTagDocument = await Tag.findOneAndUpdate({ _id: tag_id }, newTagData, {
			new: true,
			strict: true,
		});

		await updatedTagDocument.save();

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

		const deletedObject = await Tag.findOneAndDelete({ _id: tag_id });

		return !!deletedObject ? true : null;
	} catch (error) {
		console.error(error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};
