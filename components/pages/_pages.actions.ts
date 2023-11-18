"use server";

import { getServerSession } from "next-auth";

import { revalidatePath } from "next/cache";

import { authOptions } from "@/lib/auth-options";
import { NewPageObject, PageObject } from "@/interfaces/Page";
import { UserObject } from "@/interfaces/User";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import Page from "@/models/page";
import { Route } from "@/routes";
import { msgs } from "@/messages";

function _id(id?: string) {
	return id ? { _id: id } : {};
}

export const getSession = async () => {
	"use server";
	const session = await getServerSession(authOptions);

	return session;
};

export const getPages = async (): Promise<PageObject[]> => {
	"use server";

	try {
		await connectToMongoDb();
		const pages: PageObject[] = await Page.find(_id()).populate(["creator", "image"]);

		return pages;
	} catch (error) {
		console.error(error);

		return [];
	}
};

export interface AddPageReturnType {
	created: boolean;
	data?: PageObject;
	error?: string;
}

export const addPage = async (data: FormData): Promise<PageObject> => {
	"use server";

	const session = await getSession();

	if (!session?.user) {
		console.error(msgs("Errors")("invalidUser"));

		return {} as PageObject;
	}

	await connectToMongoDb();

	const newPageData: NewPageObject = {
		title: data.get("title") as string,
		description: data.get("description") as string,
		uri: data.get("uri") as string,
		creator: session?.user.id,
	};

	const newPage_document = new Page(newPageData);

	await newPage_document.save();
	await newPage_document.populate(["creator", "image"]);

	revalidatePath(Route.admin.PAGES);

	return {
		title: newPage_document.title,
		description: newPage_document.description,
		uri: newPage_document.uri,
		_id: newPage_document._id.toString(),
		creator: {
			name: newPage_document.creator.name,
			email: newPage_document.creator.email,
		} as UserObject,
	};
};
