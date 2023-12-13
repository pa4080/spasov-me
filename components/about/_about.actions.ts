"use server";

import { getServerSession } from "next-auth";

import { revalidatePath } from "next/cache";

import { AboutEntryDoc, NewAboutEntryData } from "@/interfaces/AboutEntry";
import { FileDocument } from "@/interfaces/File";
import { UserObject } from "@/interfaces/User";
import { AboutEntryItem, CityItem, CountryItem } from "@/interfaces/_dataTypes";
import { authOptions } from "@/lib/auth-options";
import { connectToMongoDb, gridFSBucket } from "@/lib/mongodb-mongoose";
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

export const getEntries = async (): Promise<AboutEntryDoc[] | null> => {
	"use server";

	try {
		await connectToMongoDb();
		const entries: AboutEntryDoc[] = await AboutEntry.find(_id()).populate([
			"creator",
			"attachment",
		]);

		return entries;
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createEntry = async (
	data: FormData,
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

	// TODO: create a function to handle this by passing an array of props to be deleted and an object
	if (
		newAboutEntryData.attachment === "undefined" ||
		newAboutEntryData.attachment === "null" ||
		newAboutEntryData.attachment === ""
	) {
		delete newAboutEntryData.attachment;
	}

	if (
		newAboutEntryData.dateTo === "undefined" ||
		newAboutEntryData.dateTo === "null" ||
		newAboutEntryData.dateTo === ""
	) {
		delete newAboutEntryData.dateTo;
	}

	const newAboutEntryDocument = new AboutEntry(newAboutEntryData);

	await newAboutEntryDocument.save();
	await newAboutEntryDocument.populate(["creator", "attachment"]);

	paths.forEach((path) => {
		revalidatePath(path);
	});

	return {
		title: newAboutEntryDocument.title,
		description: newAboutEntryDocument.description,
		country: newAboutEntryDocument.country,
		city: newAboutEntryDocument.city,
		entryType: newAboutEntryDocument.entryType,
		dateFrom: newAboutEntryDocument.dateFrom,
		dateTo: newAboutEntryDocument.dateTo && newAboutEntryDocument.dateTo,
		visibility: newAboutEntryDocument.visibility,

		_id: newAboutEntryDocument._id.toString(),
		attachment:
			newAboutEntryDocument.attachment && newAboutEntryDocument.attachment?._id.toString(),
		creator: {
			name: newAboutEntryDocument.creator.name,
			email: newAboutEntryDocument.creator.email,
		} as UserObject,
	} as AboutEntryDoc;
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

	if (
		newAboutEntryData.attachment === "undefined" ||
		newAboutEntryData.attachment === "null" ||
		newAboutEntryData.attachment === ""
	) {
		delete newAboutEntryData.attachment;
	}

	if (
		newAboutEntryData.dateTo === "undefined" ||
		newAboutEntryData.dateTo === "null" ||
		newAboutEntryData.dateTo === ""
	) {
		delete newAboutEntryData.dateTo;
	}

	const updatedAboutEntryDocument = await AboutEntry.findOneAndUpdate(
		_id(entry_id),
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

	paths.forEach((path) => {
		revalidatePath(path);
	});

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

	const deletedObject = await AboutEntry.findOneAndDelete(_id(entry_id));

	if (!deletedObject) {
		return null;
	}

	paths.forEach((path) => {
		revalidatePath(path);
	});

	return !!deletedObject.ok;
};

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
