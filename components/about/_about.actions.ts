"use server";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { AboutEntryData, AboutEntryDoc, NewAboutEntryData } from "@/interfaces/AboutEntry";
import { UserObject } from "@/interfaces/User";
import { AboutEntryType, CityType, CountryType } from "@/interfaces/_dataTypes";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb, mongo_id_obj } from "@/lib/mongodb-mongoose";
import { processMarkdown } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import AboutEntry from "@/models/about-entry";

export const getEntries = async (): Promise<AboutEntryData[] | null> => {
	"use server";

	try {
		await connectToMongoDb();
		const entries: AboutEntryDoc[] = await AboutEntry.find(mongo_id_obj()).populate([
			"attachment",
			"tags",
		]);

		return entries.map((entry) => {
			return {
				_id: entry._id.toString(),
				html: {
					// This cannot be done in the client side
					title: processMarkdown(entry.title),
					description: processMarkdown(entry.description),
					attachmentUri:
						entry.attachment && `${entry.attachment?._id.toString()}/${entry.attachment?.filename}`,
				},

				title: entry.title,
				description: entry.description,
				country: entry.country,
				city: entry.city,
				dateFrom: entry.dateFrom as Date,
				dateTo: entry.dateTo as Date | undefined,
				entryType: entry.entryType,
				visibility: entry.visibility as boolean,
				attachment: entry.attachment?._id.toString(),
				tags:
					entry.tags?.map((tag) => ({
						name: tag.name,
						description: tag.description,
						_id: tag._id.toString(),
						icon: tag.icon,
						tagType: tag.tagType,
						orderKey: tag.orderKey,
					})) || [],
			};
		});
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createEntry = async (data: FormData, paths: string[]): Promise<true | null> => {
	"use server";

	try {
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		await connectToMongoDb();

		const newAboutEntryData: NewAboutEntryData = {
			title: data.get("title") as string,
			description: data.get("description") as string,
			country: data.get("country") as CountryType,
			city: data.get("city") as CityType,
			entryType: data.get("entryType") as AboutEntryType,
			dateFrom: data.get("dateFrom") as string,
			dateTo: data.get("dateTo") as string,
			visibility: data.get("visibility") as string,
			tags: (data.get("tags") as string).split(",") as string[],

			attachment: data.get("attachment") as string,
			creator: session?.user.id as string,
		};

		deleteFalsyKeys(newAboutEntryData, ["attachment", "dateTo"]);

		const newAboutEntryDocument = new AboutEntry(newAboutEntryData);

		await newAboutEntryDocument.save();
		await newAboutEntryDocument.populate(["attachment", "tags"]);

		revalidatePaths(paths);

		return true;
	} catch (error) {
		console.error(error);

		return null;
	}
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
		country: data.get("country") as CountryType,
		city: data.get("city") as CityType,
		entryType: data.get("entryType") as AboutEntryType,
		dateFrom: data.get("dateFrom") as string,
		dateTo: data.get("dateTo") as string,
		visibility: data.get("visibility") as string,
		tags: (data.get("tags") as string).split(",") as string[],

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
