"use server";

import { PageDoc } from "@/interfaces/Page";

import { getSession } from "@/components/_common.actions";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import Page from "@/models/page";

export const getPages = async ({
	public: visible,
}: {
	public?: boolean;
} = {}): Promise<null | PageDoc[]> => {
	try {
		if (visible) {
			await connectToMongoDb();
			const pages: PageDoc[] = await Page.find({}).populate(["attachment"]);

			return pages.filter((page) => page.visibility);
		}

		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		await connectToMongoDb();
		const pages: PageDoc[] = await Page.find({}).populate(["attachment"]);

		return pages;
	} catch (error) {
		console.error(error);

		return [];
	}
};
