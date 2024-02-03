"use server";

import { PageData, PageDoc } from "@/interfaces/Page";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { fileAttachment_add, fileAttachment_remove } from "@/components/files/_files.actions";
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
					type: "Page",
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

export const updatePage = async (
	data: FormData,
	page_id: string,
	paths: string[]
): Promise<boolean | null> => {
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
		const document_prev = await Page.findOne({ _id: page_id });
		const document_new = await Page.findOneAndUpdate({ _id: page_id }, documentData_new, {
			new: true,
			strict: true,
		});

		// Deal with the "attachment" > remove the relation for the old file
		if (document_prev?.attachment) {
			await fileAttachment_remove({
				attachedDocument_id: document_prev._id.toString(),
				target_file_id: document_prev.attachment.toString(),
			});
		}

		// Deal with the "attachment" > add the relation for the new file
		if (documentData_new.attachment) {
			await fileAttachment_add({
				attachedDocument: {
					_id: document_new._id.toString(),
					title: document_new.title,
					type: "Page",
				},
				target_file_id: documentData_new.attachment,
			});
		} else {
			document_new.attachment = undefined;
		}

		// Save the new document
		await document_new.save();

		return true;
	} catch (error) {
		console.error("Unable to update page card", error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const deletePage = async (page_id: string, paths: string[]): Promise<boolean> => {
	try {
		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Connect to the DB and delete the entry
		await connectToMongoDb();
		const document_deleted = await Page.findOneAndDelete({ _id: page_id });

		// Deal with the "attachment"
		if (document_deleted.attachment) {
			await fileAttachment_remove({
				attachedDocument_id: document_deleted._id.toString(),
				target_file_id: document_deleted.attachment.toString(),
			});
		}

		return !!document_deleted;
	} catch (error) {
		console.error("Unable to delete entry", error);

		return false;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};
