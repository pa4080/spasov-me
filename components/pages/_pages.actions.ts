"use server";

import { getServerSession } from "next-auth";

// import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth-options";
import { NewPageDoc, PageDoc } from "@/interfaces/Page";
import { UserObject } from "@/interfaces/User";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import Page from "@/models/page";
// import { Route } from "@/routes";
import { msgs } from "@/messages";

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

export interface AddPageReturnType {
	created: boolean;
	data?: PageDoc;
	error?: string;
}

export const addPage = async (data: FormData): Promise<PageDoc> => {
	"use server";

	const session = await getSession();

	if (!session?.user) {
		console.error(msgs("Errors")("invalidUser"));

		return {} as PageDoc;
	}

	await connectToMongoDb();

	const newPageData: NewPageDoc = {
		title: data.get("title") as string,
		description: data.get("description") as string,
		uri: data.get("uri") as string,
		image: data.get("image") as string,
		visibility: data.get("visibility") as string,
		creator: session?.user.id,
	};

	const newPageDocument = new Page(newPageData);

	await newPageDocument.save();
	await newPageDocument.populate(["creator", "image"]);

	// revalidatePath(Route.admin.PAGES);

	return {
		title: newPageDocument.title,
		description: newPageDocument.description,
		uri: newPageDocument.uri,
		_id: newPageDocument._id.toString(),
		image: newPageDocument.image?._id.toString(),
		visibility: newPageDocument.visibility,
		creator: {
			name: newPageDocument.creator.name,
			email: newPageDocument.creator.email,
		} as UserObject,
	};
};
