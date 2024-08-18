"use server";

import { getSession, process_relations, revalidatePaths } from "@/components/_common.actions";
import { AboutEntryData, AboutEntryDocPopulated } from "@/interfaces/AboutEntry";
import { AboutEntryType } from "@/interfaces/_common-data-types";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import {
	aboutEntryDocuments_toData,
	aboutEntryFormData_toNewEntryData,
} from "@/lib/process-data-about-entries";
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
		const entries: AboutEntryDocPopulated[] = await AboutEntry.find({}).populate(["tags"]);

		return await aboutEntryDocuments_toData({ entries, hyphen, typeList, visible });
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
		const documentData_new = aboutEntryFormData_toNewEntryData({
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
		const documentData_new = aboutEntryFormData_toNewEntryData({
			data,
			user_id: session?.user.id,
		});

		deleteFalsyKeys(documentData_new, ["dateTo"]);

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

		await process_relations({
			document_prev: document_deleted,
			modelType: "AboutEntry",
		});

		return !!document_deleted;
	} catch (error) {
		console.error("Unable to delete entry", error);

		return false;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};
