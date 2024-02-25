"use server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { fileAttachment_add, fileAttachment_remove } from "@/components/files/_files.actions";
import { tagAttachment_add, tagAttachment_remove } from "@/components/tags/_tags.actions";
import { AboutEntryDoc, NewAboutEntryData } from "@/interfaces/AboutEntry";
import { AttachedToDocument, ModelType } from "@/interfaces/_common-data-types";
import { authOptions } from "@/lib/auth-options";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import AboutEntry from "@/models/about-entry";
import PageCard from "@/models/page-card";

export const revalidatePaths = async <T extends string>({
	paths,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	redirectTo,
}: {
	paths: T[];
	redirectTo?: T;
}): Promise<T[] | null | void> => {
	try {
		paths.forEach((path) => {
			revalidatePath(path);
		});

		return paths;
	} catch (error) {
		console.error(error);

		return null;
	}
	/**
	 * redirect() cause a specific Next.js error, so it must be outside the try block!
	 * Actually the errors generates by redirect() causes internal server error in production.
	 * We are refreshing the page via a client side component @see ServerActionResponseNotify.tsx
	 *
	 finally {
	 	if (redirectTo) {
	 		setTimeout(() => redirect(redirectTo), 1000);
	 	}
	 }
	 */
};

export const getSession = async () => {
	const session = await getServerSession(authOptions);

	return session;
};

/**
 * This function is used within the File and Tag forms,
 * to DETACH (REMOVE) an "attachedTo" items.
 * So far the function is used only within
 * "fileUpdate()" and "tagUpdate()".
 */
export const attachedTo_detachFromTarget = async ({
	attachedToArr_new,
	attachedToArr_old,
	target_id,
}: {
	attachedToArr_new: AttachedToDocument[] | undefined;
	attachedToArr_old: AttachedToDocument[] | undefined;
	target_id: string;
}): Promise<boolean> => {
	try {
		// Init an empty array for the differences
		let attachedTo_diff: AttachedToDocument[] = [];

		// If all attachedTo items are removed
		if (attachedToArr_old && attachedToArr_old?.length > 0 && !attachedToArr_new) {
			attachedTo_diff = attachedToArr_old;
		}

		// If partially "attachedTo" items are removed
		if (
			attachedToArr_old &&
			attachedToArr_old?.length > 0 &&
			attachedToArr_new &&
			attachedToArr_new?.length > 0
		) {
			const attachedToArr_new_ids = attachedToArr_new.map(({ _id }) => _id);

			attachedTo_diff = attachedToArr_old.filter(({ _id }) => !attachedToArr_new_ids.includes(_id));
		}

		// If "attachedTo" array is not changed
		if (attachedTo_diff.length === 0) {
			return true;
		}

		// If there are differences, process them.
		await connectToMongoDb();

		if (attachedTo_diff.length > 0) {
			attachedTo_diff.forEach(async ({ _id, modelType }: { _id: string; modelType: ModelType }) => {
				let document;

				switch (modelType) {
					case "AboutEntry": {
						document = await AboutEntry.findOne({ _id });
						break;
					}

					case "PageCard": {
						document = await PageCard.findOne({ _id });
						break;
					}

					default: {
						document = null;
						break;
					}
				}

				if (document) {
					if (document.attachment && document.attachment.toString() === target_id) {
						document.attachment = undefined;
					}

					if (document.gallery && document.gallery.length > 0) {
						document.gallery = document.gallery.filter(
							(gallery_file_id: ObjectId) => gallery_file_id.toString() !== target_id
						);
					}

					if (document.tags && document.tags.length > 0) {
						document.tags = document.tags.filter(
							(tag_id: ObjectId) => tag_id.toString() !== target_id
						);
					}

					await document.save();
				} else {
					console.warn(
						`The DB document with Id '${_id}' does not exist.\n > ` +
							`It is safe to remove the relevant record from the ` +
							`'attachedTo' array of '${target_id}'.`
					);
				}
			});
		}

		return true;
	} catch (error) {
		console.error("Unable to remove attached document", error);

		return false;
	}
};

/**
 * Process the relations between the models - attachedTo, gallery, tags
 */
export const process_relations = async ({
	documentData_new,
	document_new,
	document_prev,
	modelType,
}: {
	documentData_new?: NewAboutEntryData;
	document_new?: AboutEntryDoc;
	document_prev?: AboutEntryDoc;
	modelType: ModelType;
}) => {
	// Deal with the previous state of the document
	if (document_prev) {
		// Deal with the "attachment"
		if (document_prev.attachment) {
			await fileAttachment_remove({
				attachedDocument_id: document_prev._id.toString(),
				target_file_id: document_prev.attachment.toString(),
			});
		}

		// Deal with the "gallery"
		if (document_prev.gallery && document_prev.gallery.length > 0) {
			await Promise.all(
				document_prev.gallery.map(async (file_id: ObjectId) => {
					await fileAttachment_remove({
						attachedDocument_id: document_prev._id.toString(),
						target_file_id: file_id.toString(),
					});
				})
			);
		}

		// Deal with the "tags"
		if (document_prev.tags && document_prev.tags.length > 0) {
			await Promise.all(
				document_prev.tags.map(async (tag_id: ObjectId) => {
					await tagAttachment_remove({
						attachedDocument_id: document_prev._id.toString(),
						target_tag_id: tag_id.toString(),
					});
				})
			);
		}
	}

	// Deal with the current state of the document
	if (documentData_new && document_new) {
		// Deal with the "attachment"
		if (documentData_new.attachment) {
			await fileAttachment_add({
				documentToAttach: {
					_id: document_new._id.toString(),
					title: document_new.title,
					modelType: modelType,
				},
				target_file_id: documentData_new.attachment,
			});
		} else {
			document_new.attachment = undefined;
		}

		// Deal with the "gallery"
		if (documentData_new.gallery && documentData_new.gallery.length > 0) {
			await Promise.all(
				documentData_new.gallery.map(async (file_id) => {
					await fileAttachment_add({
						documentToAttach: {
							_id: document_new._id.toString(),
							title: document_new.title,
							modelType: modelType,
						},
						target_file_id: file_id,
					});
				})
			);
		} else {
			document_new.gallery = undefined;
		}

		// Deal with the "tags"
		if (documentData_new.tags && documentData_new.tags.length > 0) {
			await Promise.all(
				documentData_new.tags.map(async (tag_id) => {
					await tagAttachment_add({
						documentToAttach: {
							_id: document_new._id.toString(),
							title: document_new.title,
							modelType: modelType,
						},
						target_tag_id: tag_id,
					});
				})
			);
		} else {
			document_new.tags = undefined;
		}
	}
};
