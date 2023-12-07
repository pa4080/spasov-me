"use server";

import { getServerSession } from "next-auth";

// import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth-options";
import { PageDoc } from "@/interfaces/Page";
import { UserObject } from "@/interfaces/User";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import Page from "@/models/page";
// import { Route } from "@/routes";
import { msgs } from "@/messages";
import { AboutEntryDoc, NewAboutEntryDoc } from "@/interfaces/AboutEntry";
import { AboutEntryItem, CityItem, CountryItem } from "@/interfaces/_dataTypes";
import AboutEntry from "@/models/about-entry";

function _id(id?: string) {
	return id ? { _id: id } : {};
}

export const getSession = async () => {
	"use server";
	const session = await getServerSession(authOptions);

	return session;
};

export const getPages = async (): Promise<PageDoc[]> => {
	"use server";

	try {
		await connectToMongoDb();
		const pages: PageDoc[] = await Page.find(_id()).populate(["creator", "image"]);

		return pages;
	} catch (error) {
		console.error(error);

		return [];
	}
};

export const getPublicPages = async (): Promise<PageDoc[]> => {
	"use server";

	try {
		await connectToMongoDb();
		const pages: PageDoc[] = await Page.find(_id()).populate(["creator", "image"]);

		return pages.filter((page) => page.visibility);
	} catch (error) {
		console.error(error);

		return [];
	}
};

export const getPagesConditionally = async (): Promise<PageDoc[]> => {
	"use server";

	try {
		await connectToMongoDb();
		const pages: PageDoc[] = await Page.find(_id()).populate(["creator", "image"]);

		const session = await getSession();

		if (session?.user) {
			return pages;
		} else {
			return pages.filter((page) => page.visibility);
		}
	} catch (error) {
		console.error(error);

		return [];
	}
};

export const addEntry = async (data: FormData): Promise<AboutEntryDoc | null> => {
	"use server";

	const session = await getSession();

	if (!session?.user) {
		console.error(msgs("Errors")("invalidUser"));

		return null;
	}

	await connectToMongoDb();

	const newAboutEntryDoc: NewAboutEntryDoc = {
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

	const newAboutEntryDocument = new AboutEntry(newAboutEntryDoc);

	await newAboutEntryDocument.save();
	await newAboutEntryDocument.populate(["creator", "image"]);

	// revalidatePath(Route.admin.PAGES);

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
