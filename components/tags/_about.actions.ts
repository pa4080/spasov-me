"use server";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { AboutEntryDoc, NewAboutEntryData } from "@/interfaces/AboutEntry";
import { NewTagData, TagDoc } from "@/interfaces/Tag";
import { UserObject } from "@/interfaces/User";
import { AboutEntryItem, CityItem, CountryItem, TagItem } from "@/interfaces/_dataTypes";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb, mongo_id_obj } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import AboutEntry from "@/models/about-entry";
import Tag from "@/models/tag";

export const getTags = async (): Promise<TagDoc[] | null> => {
	"use server";

	try {
		await connectToMongoDb();
		// const tags: TagDoc[] = await Tag.find(mongo_id_obj()).populate(["creator"]);
		const tags: TagDoc[] = await Tag.find(mongo_id_obj());

		return tags;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createTag = async (data: FormData, paths: string[]): Promise<TagDoc | null> => {
	"use server";

	const session = await getSession();

	if (!session?.user) {
		console.error(msgs("Errors")("invalidUser"));

		return null;
	}

	await connectToMongoDb();

	const newTagData: NewTagData = {
		title: data.get("title") as string,
		description: data.get("description") as string,
		icon: data.get("icon") as string,
		tagType: data.get("tagType") as TagItem,

		creator: session?.user.id as string,
	};

	deleteFalsyKeys(newTagData);

	const newTagDocument = new Tag(newTagData);

	await newTagDocument.save();
	await newTagDocument.populate(["creator"]);

	revalidatePaths(paths);

	return {
		title: newTagDocument.title,
		description: newTagDocument.description,
		icon: newTagDocument.icon,
		tagType: newTagDocument.tagType,

		_id: newTagDocument._id.toString(),

		creator: newTagDocument.creator,
	} as TagDoc;
};

export const updateEntry = async (
	data: FormData,
	entry_id: string,
	paths: string[]
): Promise<AboutEntryDoc | null> => {
	"use server";

	const session = await getSession();

	if (!session?.user) {
		console.error(msgs("Errors")("invalidUser"));

		return null;
	}

	await connectToMongoDb();

	const newAboutEntryData: NewAboutEntryData = {
		title: data.get("title") as string,
		description: data.get("description") as string,
		country: data.get("country") as CountryItem,
		city: data.get("city") as CityItem,
		entryType: data.get("entryType") as AboutEntryItem,
		dateFrom: data.get("dateFrom") as string,
		dateTo: data.get("dateTo") as string,
		visibility: data.get("visibility") as string,

		attachment: data.get("attachment") as string,
		creator: session?.user.id as string,
	};

	deleteFalsyKeys(newAboutEntryData, ["attachment", "dateTo"]);

	const updatedAboutEntryDocument = await AboutEntry.findOneAndUpdate(
		mongo_id_obj(entry_id),
		newAboutEntryData,
		{
			new: true,
			strict: true,
		}
	);

	// If the image previously existed but was removed
	if (!newAboutEntryData.attachment) {
		updatedAboutEntryDocument.attachment = undefined;
	}

	if (!newAboutEntryData.dateTo) {
		updatedAboutEntryDocument.dateTo = undefined;
	}

	await updatedAboutEntryDocument.save();
	await updatedAboutEntryDocument.populate(["creator", "attachment"]);

	revalidatePaths(paths);

	return {
		title: updatedAboutEntryDocument.title,
		description: updatedAboutEntryDocument.description,
		country: updatedAboutEntryDocument.country,
		city: updatedAboutEntryDocument.city,
		entryType: updatedAboutEntryDocument.entryType,
		dateFrom: updatedAboutEntryDocument.dateFrom,
		dateTo: updatedAboutEntryDocument.dateTo || undefined,
		visibility: updatedAboutEntryDocument.visibility,

		_id: updatedAboutEntryDocument._id.toString(),
		attachment: updatedAboutEntryDocument.attachment?._id.toString(),
		creator: {
			name: updatedAboutEntryDocument.creator.name,
			email: updatedAboutEntryDocument.creator.email,
		} as UserObject,
	} as AboutEntryDoc;
};

export const deleteEntry = async (entry_id: string, paths: string[]): Promise<boolean | null> => {
	"use server";

	const session = await getSession();

	if (!session?.user) {
		console.error(msgs("Errors")("invalidUser"));

		return null;
	}

	await connectToMongoDb();

	const deletedObject = await AboutEntry.findOneAndDelete(mongo_id_obj(entry_id));

	if (!deletedObject) {
		return null;
	}

	revalidatePaths(paths);

	return !!deletedObject.ok;
};
