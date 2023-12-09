"use server";

import { getServerSession } from "next-auth";

import { revalidatePath } from "next/cache";

import { AboutEntryDoc, NewAboutEntryDoc } from "@/interfaces/AboutEntry";
import { UserObject } from "@/interfaces/User";
import { AboutEntryItem, CityItem, CountryItem } from "@/interfaces/_dataTypes";
import { authOptions } from "@/lib/auth-options";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import AboutEntry from "@/models/about-entry";

function _id(id?: string) {
	return id ? { _id: id } : {};
}

export const getSession = async () => {
	"use server";
	const session = await getServerSession(authOptions);

	return session;
};

export const getEntries = async (entyType?: string): Promise<AboutEntryDoc[] | null> => {
	"use server";

	try {
		await connectToMongoDb();
		const entries: AboutEntryDoc[] = await AboutEntry.find(_id()).populate(["creator", "image"]);

		return entries;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createEntry = async (data: FormData, path: string): Promise<AboutEntryDoc | null> => {
	"use server";

	const session = await getSession();

	if (!session?.user) {
		console.error(msgs("Errors")("invalidUser"));

		return null;
	}

	await connectToMongoDb();

	const newAboutEntryData: NewAboutEntryDoc = {
		title: data.get("title") as string,
		description: data.get("description") as string,
		country: data.get("country") as CountryItem,
		city: data.get("city") as CityItem,
		entryType: data.get("entryType") as AboutEntryItem,
		dateFrom: data.get("dateFrom") as string,
		dateTo: data.get("dateTo") as string,
		visibility: data.get("visibility") as string,

		image: data.get("image") as string,
		creator: session?.user.id as string,
	};

	const newAboutEntryDocument = new AboutEntry(newAboutEntryData);

	await newAboutEntryDocument.save();
	await newAboutEntryDocument.populate(["creator", "image"]);

	revalidatePath(path);

	return {
		title: newAboutEntryDocument.title,
		description: newAboutEntryDocument.description,
		country: newAboutEntryDocument.country,
		city: newAboutEntryDocument.city,
		entryType: newAboutEntryDocument.entryType,
		dateFrom: newAboutEntryDocument.dateFrom,
		dateTo: newAboutEntryDocument.dateTo,
		visibility: newAboutEntryDocument.visibility,

		_id: newAboutEntryDocument._id.toString(),
		image: newAboutEntryDocument.image?._id.toString(),
		creator: {
			name: newAboutEntryDocument.creator.name,
			email: newAboutEntryDocument.creator.email,
		} as UserObject,
	};
};

export const updateEntry = async (
	data: FormData,
	entry_id: string,
	path: string
): Promise<AboutEntryDoc | null> => {
	"use server";

	const session = await getSession();

	if (!session?.user) {
		console.error(msgs("Errors")("invalidUser"));

		return null;
	}

	await connectToMongoDb();

	const newAboutEntryData: NewAboutEntryDoc = {
		title: data.get("title") as string,
		description: data.get("description") as string,
		country: data.get("country") as CountryItem,
		city: data.get("city") as CityItem,
		entryType: data.get("entryType") as AboutEntryItem,
		dateFrom: data.get("dateFrom") as string,
		dateTo: data.get("dateTo") as string,
		visibility: data.get("visibility") as string,

		image: data.get("image") as string,
		creator: session?.user.id as string,
	};

	const updatedAboutEntryDocument = await AboutEntry.findOneAndUpdate(
		_id(entry_id),
		newAboutEntryData,
		{
			new: true,
			strict: true,
		}
	);

	// If the image previously existed but was removed
	if (!newAboutEntryData.image) {
		updatedAboutEntryDocument.image = undefined;
	}

	await updatedAboutEntryDocument.save();
	await updatedAboutEntryDocument.populate(["creator", "image"]);

	revalidatePath(path);

	return {
		title: updatedAboutEntryDocument.title,
		description: updatedAboutEntryDocument.description,
		country: updatedAboutEntryDocument.country,
		city: updatedAboutEntryDocument.city,
		entryType: updatedAboutEntryDocument.entryType,
		dateFrom: updatedAboutEntryDocument.dateFrom,
		dateTo: updatedAboutEntryDocument.dateTo,
		visibility: updatedAboutEntryDocument.visibility,

		_id: updatedAboutEntryDocument._id.toString(),
		image: updatedAboutEntryDocument.image?._id.toString(),
		creator: {
			name: updatedAboutEntryDocument.creator.name,
			email: updatedAboutEntryDocument.creator.email,
		} as UserObject,
	};
};
