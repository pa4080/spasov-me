"use server";

import { PageData, PageDoc } from "@/interfaces/Page";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { fileAttachment_add } from "@/components/files/_files.actions";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { pageDocumentsToData, pageFormDataToNewEntryData } from "@/lib/process-data-pages";
import { msgs } from "@/messages";
import Page from "@/models/page";

export const getPages = async ({
	public: visible,
}: {
	public?: boolean;
} = {}): Promise<null | PageData[]> => {
	try {
		await connectToMongoDb();
		const pages: PageDoc[] = await Page.find({}).populate(["attachment"]);

		return pageDocumentsToData({ pages, visible });
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createPage = async (data: FormData, paths: string[]): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		const documentData_new = pageFormDataToNewEntryData({
			data,
			user_id: session?.user.id,
		});

		deleteFalsyKeys(documentData_new, ["attachment"]);

		// Connect to the DB and create a new document
		await connectToMongoDb();
		const document_new = new Page(documentData_new);

		// Save the new document
		await document_new.save();

		// Deal with the "attachment"
		if (documentData_new.attachment) {
			await fileAttachment_add({
				attachedDocument: {
					_id: document_new._id.toString(),
					title: document_new.title,
					type: "about",
				},
				target_file_id: documentData_new.attachment,
			});
		}

		return true;
	} catch (error) {
		console.error("Unable to create new page card", error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};
