"use server";

import { ObjectId } from "mongoose";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { AboutEntryData, AboutEntryDoc, NewAboutEntryData } from "@/interfaces/AboutEntry";
import { AboutEntryType, CityType, CountryType } from "@/interfaces/_dataTypes";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import fileDocumentToData from "@/lib/file-doc-to-file-data";
import { connectToMongoDb, mongo_id_obj } from "@/lib/mongodb-mongoose";
import { processMarkdown } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import AboutEntry from "@/models/about-entry";
import { Route } from "@/routes";

import { fileAttachment_add, fileAttachment_remove } from "../files/_files.actions";

export const getEntries = async ({
	hyphen,
	typeList,
}: {
	hyphen?: boolean;
	typeList?: AboutEntryType[];
}): Promise<AboutEntryData[] | null> => {
	try {
		await connectToMongoDb();
		const entries: AboutEntryDoc[] = await AboutEntry.find(mongo_id_obj()).populate([
			"attachment",
			"tags",
			"gallery",
		]);

		return entries
			.filter(({ entryType }) => (typeList && typeList.includes(entryType)) ?? true)
			.map((entry) => {
				return {
					_id: entry._id.toString(),
					html: {
						// This cannot be done in the client side
						title: processMarkdown({
							markdown: entry.title,
							hyphen,
						}),
						description: processMarkdown({
							markdown: entry.description,
							hyphen,
						}),
						attachmentUri:
							entry.attachment &&
							`${Route.api.FILES}/${entry.attachment?._id.toString()}/${
								entry.attachment?.filename
							}?v=${new Date(entry.attachment?.uploadDate).getTime()}`,
					},

					title: entry.title,
					description: entry.description,
					country: entry.country,
					city: entry.city,
					dateFrom: entry.dateFrom as Date,
					dateTo: entry.dateTo as Date | undefined,
					entryType: entry.entryType,
					visibility: entry.visibility as boolean,
					attachment: entry.attachment?._id.toString(),
					tags:
						entry.tags?.map((tag) => ({
							name: tag.name,
							description: tag.description,
							_id: tag._id.toString(),
							icon: tag.icon,
							tagType: tag.tagType,
							orderKey: tag.orderKey,
						})) || [],
					gallery: fileDocumentToData(entry.gallery || []),
				};
			});
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createEntry = async (data: FormData, paths: string[]): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		// Get the input data from the form
		const aboutEntryData_new: NewAboutEntryData = {
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

		deleteFalsyKeys(aboutEntryData_new, ["attachment", "dateTo", "gallery"]);

		// Connect to the DB and create a new document
		await connectToMongoDb();
		const aboutEntryDocument_new = new AboutEntry(aboutEntryData_new);

		// Save the new document
		await aboutEntryDocument_new.save();

		// Deal with the "attachment"
		if (aboutEntryData_new.attachment) {
			await fileAttachment_add({
				attachedDocument: {
					_id: aboutEntryDocument_new._id.toString(),
					title: aboutEntryDocument_new.title,
					type: Route.public.ABOUT.name,
				},
				target_file_id: aboutEntryData_new.attachment,
			});
		}

		// Deal with the "gallery"
		if (aboutEntryData_new.gallery) {
			aboutEntryData_new.gallery.map(async (file_id) => {
				await fileAttachment_add({
					attachedDocument: {
						_id: aboutEntryDocument_new._id.toString(),
						title: aboutEntryDocument_new.title,
						type: Route.public.ABOUT.name,
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
			console.error(msgs("Errors")("invalidUser"));

			return null;
		}

		// Get the input data from the form
		const aboutEntryData_new: NewAboutEntryData = {
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

		deleteFalsyKeys(aboutEntryData_new, ["attachment", "dateTo", "gallery"]);

		// Connect to the DB
		await connectToMongoDb();
		const aboutEntryDocument_prev = await AboutEntry.findOne(mongo_id_obj(entry_id));
		const aboutEntryDocument_new = await AboutEntry.findOneAndUpdate(
			mongo_id_obj(entry_id),
			aboutEntryData_new,
			{
				new: true,
				strict: true,
			}
		);

		// Deal with the "attachment" > add the relation for the new file
		if (aboutEntryData_new.attachment) {
			await fileAttachment_add({
				attachedDocument: {
					_id: aboutEntryDocument_new._id.toString(),
					title: aboutEntryDocument_new.title,
					type: Route.public.ABOUT.name,
				},
				target_file_id: aboutEntryData_new.attachment,
			});
		} else {
			aboutEntryDocument_new.attachment = undefined;
		}

		// Deal with the "attachment" > remove the relation for the old file
		if (
			aboutEntryDocument_prev.attachment.toString() &&
			aboutEntryDocument_prev.attachment.toString() !== aboutEntryData_new.attachment
		) {
			await fileAttachment_remove({
				attachedDocument_id: aboutEntryDocument_prev._id.toString(),
				target_file_id: aboutEntryDocument_prev.attachment.toString(),
			});
		}

		// Deal with the "gallery" > add the relation for the new files
		if (aboutEntryData_new.gallery) {
			aboutEntryData_new.gallery.map(async (file_id) => {
				await fileAttachment_add({
					attachedDocument: {
						_id: aboutEntryDocument_new._id.toString(),
						title: aboutEntryDocument_new.title,
						type: Route.public.ABOUT.name,
					},
					target_file_id: file_id,
				});
			});
		} else {
			aboutEntryDocument_new.gallery = undefined;
		}

		// Deal with the "gallery" > remove the relation for the old files
		if (aboutEntryDocument_prev.gallery.length) {
			const galleryDiffIds = aboutEntryDocument_prev.gallery.filter(
				(file_id: ObjectId) => !aboutEntryData_new.gallery?.includes(file_id.toString())
			);

			if (galleryDiffIds.length) {
				galleryDiffIds.map(async (file_id: ObjectId) => {
					await fileAttachment_remove({
						attachedDocument_id: aboutEntryDocument_prev._id.toString(),
						target_file_id: file_id.toString(),
					});
				});
			}
		}

		// Deal with the "dateTo"
		if (!aboutEntryData_new.dateTo) {
			aboutEntryDocument_new.dateTo = undefined;
		}

		// Save the document with the changes above
		await aboutEntryDocument_new.save();
		// await aboutEntryDocument_new.populate(["attachment", "tags", "gallery"]); // TODO: remove this unnecessary line

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
		const session = await getSession();

		if (!session?.user) {
			console.error(msgs("Errors")("invalidUser"));

			return false;
		}

		// Connect to the DB and delete the entry
		await connectToMongoDb();
		const deletedObject = await AboutEntry.findOneAndDelete(mongo_id_obj(entry_id));

		// Deal with the "attachment"
		if (deletedObject.attachment) {
			await fileAttachment_remove({
				attachedDocument_id: deletedObject._id.toString(),
				target_file_id: deletedObject.attachment,
			});
		}

		// Deal with the "gallery"
		if (deletedObject.gallery && deletedObject.gallery.length > 0) {
			deletedObject.gallery.map(async (file_id: ObjectId) => {
				await fileAttachment_remove({
					attachedDocument_id: deletedObject._id.toString(),
					target_file_id: file_id.toString(),
				});
			});
		}

		return !!deletedObject;
	} catch (error) {
		console.error("Unable to delete entry", error);

		return false;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};
