"use server";

// import { revalidatePath } from "next/cache";

import { NewPageDoc, PageDoc } from "@/interfaces/Page";
import { UserObject } from "@/interfaces/User";

import { getSession } from "@/components/_common.actions";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb, mongo_id_obj } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import Page from "@/models/page";

export const getPages = async (): Promise<PageDoc[]> => {
	"use server";

	try {
		await connectToMongoDb();
		const pages: PageDoc[] = await Page.find(mongo_id_obj()).populate(["creator", "image"]);

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
		const pages: PageDoc[] = await Page.find(mongo_id_obj()).populate(["creator", "image"]);

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
		const pages: PageDoc[] = await Page.find(mongo_id_obj()).populate(["creator", "image"]);

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

export const createPage = async (data: FormData): Promise<PageDoc> => {
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

	deleteFalsyKeys(newPageData, ["image"]);

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
