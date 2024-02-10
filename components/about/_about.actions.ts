"use server";

import { ObjectId } from "mongodb";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { fileAttachment_add, fileAttachment_remove } from "@/components/files/_files.actions";
import {
	AboutEntryData,
	AboutEntryDoc,
	AboutEntryDocPopulated,
	NewAboutEntryData,
} from "@/interfaces/AboutEntry";
import { AboutEntryType, ModelType } from "@/interfaces/_common-data-types";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { aboutDocuments_toData, aboutFormData_toNewEntryData } from "@/lib/process-data-about";
import { msgs } from "@/messages";
import AboutEntry from "@/models/about-entry";

export const getEntries = async ({
	hyphen,
	typeList,
	public: visible = false,
}: {
	hyphen?: boolean;
	typeList?: AboutEntryType[];
	public?: boolean;
}): Promise<AboutEntryData[] | null> => {
	try {
		await connectToMongoDb();
		const entries: AboutEntryDocPopulated[] = await AboutEntry.find({}).populate([
			"attachment",
			"tags",
			"gallery",
		]);

		return aboutDocuments_toData({ entries, hyphen, typeList, visible });
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createEntry = async (data: FormData, paths: string[]): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Get the input data from the form
		const documentData_new = aboutFormData_toNewEntryData({
			data,
			user_id: session?.user.id,
		});

		deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery"]);

		// Connect to the DB and create a new document
		await connectToMongoDb();
		const document_new = new AboutEntry(documentData_new);

		// Save the new document
		await document_new.save();

		await process_relations({
			documentData_new,
			document_new,
			modelType: "AboutEntry",
		});

		return true;
	} catch (error) {
		console.error("Unable to create new entry", error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const updateEntry = async (
	data: FormData,
	entry_id: string,
	paths: string[]
): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Get the input data from the form
		const documentData_new = aboutFormData_toNewEntryData({
			data,
			user_id: session?.user.id,
		});

		deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery"]);

		// Connect to the DB
		await connectToMongoDb();
		const document_prev = await AboutEntry.findOne({ _id: entry_id });
		const document_new = await AboutEntry.findOneAndUpdate({ _id: entry_id }, documentData_new, {
			new: true,
			strict: true,
		});

		await process_relations({
			documentData_new,
			document_new,
			document_prev,
			modelType: "AboutEntry",
		});

		// Deal with the "dateTo"
		if (!documentData_new.dateTo) {
			document_new.dateTo = undefined;
		}

		// Save the document with the changes above
		await document_new.save();

		return true;
	} catch (error) {
		console.error("Unable to update entry", error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const deleteEntry = async (entry_id: string, paths: string[]): Promise<boolean> => {
	try {
		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Connect to the DB and delete the entry
		await connectToMongoDb();
		const document_deleted = await AboutEntry.findOneAndDelete({ _id: entry_id });

		// Deal with the "attachment"
		if (document_deleted.attachment) {
			await fileAttachment_remove({
				attachedDocument_id: document_deleted._id.toString(),
				target_file_id: document_deleted.attachment.toString(),
			});
		}

		// Deal with the "gallery"
		if (document_deleted.gallery && document_deleted.gallery.length > 0) {
			document_deleted.gallery.map(async (file_id: ObjectId) => {
				await fileAttachment_remove({
					attachedDocument_id: document_deleted._id.toString(),
					target_file_id: file_id.toString(),
				});
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

const process_relations = async ({
	documentData_new,
	document_new,
	document_prev,
	modelType,
}: {
	documentData_new: NewAboutEntryData;
	document_new: AboutEntryDoc;
	document_prev?: AboutEntryDoc;
	modelType: ModelType;
}) => {
	// Deal with the "attachment" > remove the relation for the old file
	if (document_prev) {
		if (document_prev?.attachment) {
			await fileAttachment_remove({
				attachedDocument_id: document_prev._id.toString(),
				target_file_id: document_prev.attachment.toString(),
			});
		}
	}

	// Deal with the "attachment" > add the relation for the new file
	if (documentData_new.attachment) {
		await fileAttachment_add({
			attachedDocument: {
				_id: document_new._id.toString(),
				title: document_new.title,
				modelType: modelType,
			},
			target_file_id: documentData_new.attachment,
		});
	} else {
		document_new.attachment = undefined;
	}

	// Deal with the "gallery" > remove the relation for the old files
	if (document_prev) {
		if (document_prev?.gallery && document_prev?.gallery.length > 0) {
			document_prev.gallery.map(async (file_id: ObjectId) => {
				await fileAttachment_remove({
					attachedDocument_id: document_prev._id.toString(),
					target_file_id: file_id.toString(),
				});
			});
		}
	}

	// Deal with the "gallery" > add the relation for the new files
	if (documentData_new?.gallery && documentData_new?.gallery.length > 0) {
		documentData_new.gallery.map(async (file_id) => {
			await fileAttachment_add({
				attachedDocument: {
					_id: document_new._id.toString(),
					title: document_new.title,
					modelType: modelType,
				},
				target_file_id: file_id,
			});
		});
	} else {
		document_new.gallery = undefined;
	}
};
