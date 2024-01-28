"use server";

import { ObjectId } from "mongodb";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { AboutEntryData, AboutEntryDoc, NewAboutEntryData } from "@/interfaces/AboutEntry";
import { AboutEntryType, CityType, CountryType } from "@/interfaces/_dataTypes";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb, mongo_id_obj } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";
import AboutEntry from "@/models/about-entry";

import aboutDocumentToData from "@/lib/process-aboutDoc-to-aboutData";

import { fileAttachment_add, fileAttachment_remove } from "../files/_files.actions";

export const getEntries = async ({
	hyphen,
	typeList,
	public: visible,
}: {
	hyphen?: boolean;
	typeList?: AboutEntryType[];
	public?: boolean;
}): Promise<AboutEntryData[] | null> => {
	try {
		if (visible) {
			await connectToMongoDb();
			const entries: AboutEntryDoc[] = await AboutEntry.find({}).populate([
				"attachment",
				"tags",
				"gallery",
			]);

			return aboutDocumentToData({ entries, hyphen, typeList, visible });
		}

		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		await connectToMongoDb();
		const entries: AboutEntryDoc[] = await AboutEntry.find({}).populate([
			"attachment",
			"tags",
			"gallery",
		]);

		return aboutDocumentToData({ entries, hyphen, typeList, visible });
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
		const documentData_new: NewAboutEntryData = {
			title: data.get("title") as string,
			description: data.get("description") as string,
			country: data.get("country") as CountryType,
			city: data.get("city") as CityType,
			entryType: data.get("entryType") as AboutEntryType,
			dateFrom: data.get("dateFrom") as string,
			dateTo: data.get("dateTo") as string,
			visibility: data.get("visibility") as string,
			attachment: data.get("attachment") as string,

			tags: JSON.parse(data.get("tags") as string) as string[],
			gallery: JSON.parse(data.get("gallery") as string) as string[],

			creator: session?.user.id as string,
		};

		deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery"]);

		// Connect to the DB and create a new document
		await connectToMongoDb();
		const document_new = new AboutEntry(documentData_new);

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

		// Deal with the "gallery"
		if (documentData_new.gallery) {
			documentData_new.gallery.map(async (file_id) => {
				await fileAttachment_add({
					attachedDocument: {
						_id: document_new._id.toString(),
						title: document_new.title,
						type: "about",
					},
					target_file_id: file_id,
				});
			});
		}

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
		const documentData_new: NewAboutEntryData = {
			title: data.get("title") as string,
			description: data.get("description") as string,
			country: data.get("country") as CountryType,
			city: data.get("city") as CityType,
			entryType: data.get("entryType") as AboutEntryType,
			dateFrom: data.get("dateFrom") as string,
			dateTo: data.get("dateTo") as string,
			visibility: data.get("visibility") as string,
			attachment: data.get("attachment") as string,

			tags: JSON.parse(data.get("tags") as string) as string[],
			gallery: JSON.parse(data.get("gallery") as string) as string[],

			creator: session?.user.id as string,
		};

		deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery"]);

		// Connect to the DB
		await connectToMongoDb();
		const document_prev = await AboutEntry.findOne(mongo_id_obj(entry_id));
		const document_new = await AboutEntry.findOneAndUpdate(
			mongo_id_obj(entry_id),
			documentData_new,
			{
				new: true,
				strict: true,
			}
		);

		// Deal with the "attachment" > add the relation for the new file
		if (documentData_new.attachment) {
			await fileAttachment_add({
				attachedDocument: {
					_id: document_new._id.toString(),
					title: document_new.title,
					type: "about",
				},
				target_file_id: documentData_new.attachment,
			});
		} else {
			document_new.attachment = undefined;
		}

		// Deal with the "attachment" > remove the relation for the old file
		if (
			document_prev.attachment.toString() &&
			document_prev.attachment.toString() !== documentData_new.attachment
		) {
			await fileAttachment_remove({
				attachedDocument_id: document_prev._id.toString(),
				target_file_id: document_prev.attachment.toString(),
			});
		}

		// Deal with the "gallery" > add the relation for the new files
		if (documentData_new.gallery) {
			documentData_new.gallery.map(async (file_id) => {
				await fileAttachment_add({
					attachedDocument: {
						_id: document_new._id.toString(),
						title: document_new.title,
						type: "about",
					},
					target_file_id: file_id,
				});
			});
		} else {
			document_new.gallery = undefined;
		}

		// Deal with the "gallery" > remove the relation for the old files
		if (document_prev.gallery.length) {
			const gallery_removed = document_prev.gallery.filter(
				(file_id: ObjectId) => !documentData_new.gallery?.includes(file_id.toString())
			);

			if (gallery_removed.length) {
				gallery_removed.map(async (file_id: ObjectId) => {
					await fileAttachment_remove({
						attachedDocument_id: document_prev._id.toString(),
						target_file_id: file_id.toString(),
					});
				});
			}
		}

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
		const document_deleted = await AboutEntry.findOneAndDelete(mongo_id_obj(entry_id));

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
