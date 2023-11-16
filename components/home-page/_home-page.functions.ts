import { getServerSession } from "next-auth";

import { revalidatePath } from "next/cache";

import { PageObject, preparePageObjectToFetch } from "@/interfaces/Page";
import { authOptions } from "@/lib/auth-options";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import Page from "@/models/page";
import { Route } from "@/routes";

import { msgs } from "@/messages";

import { Pages_FormSchema } from "./csr/Pages_Form";

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

export const addPage = async (data: Pages_FormSchema): Promise<AddPageReturnType> => {
	"use server";

	// eslint-disable-next-line no-console
	console.log(data);

	const session = await getSession();

	if (!session) {
		console.error(msgs("Errors")("invalidUser"));

		return {
			created: false,
			error: msgs("Errors")("invalidUser"),
		};
	}

	// eslint-disable-next-line no-console
	console.log(session);

	await connectToMongoDb();

	const pageDataToFetch = preparePageObjectToFetch({
		data,
		user_id: (await getSession())?.user.id,
	});

	// // eslint-disable-next-line no-console
	// console.log(pageDataToFetch);

	const dbObject = new Page(pageDataToFetch);

	// await dbObject.save();
	// await dbObject.populate(["creator", "image"]);

	// revalidatePath(Route.private.PAGES);

	// return {
	// 	created: true,
	// 	data: dbObject,
	// };
};
