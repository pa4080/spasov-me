"use server";

import { ObjectId } from "mongodb";

import { getSession, revalidatePaths } from "@/components/_common.actions";
import { fileAttachment_add, fileAttachment_remove } from "@/components/files/_files.actions";
import { ModelType, ProjectType } from "@/interfaces/_common-data-types";
import deleteFalsyKeys from "@/lib/delete-falsy-object-keys";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";
import { msgs } from "@/messages";

import { NewProjectData, ProjectData, ProjectDoc, ProjectDocPopulated } from "@/interfaces/Project";
import {
	projectDocuments_toData,
	projectFormData_toNewProjectData,
} from "@/lib/process-data-projects";
import Project from "@/models/project";

import { tagAttachment_add, tagAttachment_remove } from "../tags/_tags.actions";

export const getProjects = async ({
	hyphen,
	typeList,
	public: visible = false,
}: {
	hyphen?: boolean;
	typeList?: ProjectType[];
	public?: boolean;
}): Promise<ProjectData[] | null> => {
	try {
		await connectToMongoDb();
		const projects: ProjectDocPopulated[] = await Project.find({}).populate([
			"attachment",
			"tags",
			"gallery",
		]);

		return projectDocuments_toData({ projects, hyphen, typeList, visible });
	} catch (error) {
		console.error(error);

		return null;
	}
};

export const createProject = async (data: FormData, paths: string[]): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Get the input data from the form
		const documentData_new = projectFormData_toNewProjectData({
			data,
			user_id: session?.user.id,
		});

		deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery"]);

		// Connect to the DB and create a new document
		await connectToMongoDb();
		const document_new = new Project(documentData_new);

		// Save the new document
		await document_new.save();

		await process_relations({
			documentData_new,
			document_new,
			modelType: "Project",
		});

		return true;
	} catch (error) {
		console.error("Unable to create new project", error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const updateProject = async (
	data: FormData,
	project_id: string,
	paths: string[]
): Promise<boolean | null> => {
	try {
		const session = await getSession();

		if (!session?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Get the input data from the form
		const documentData_new = projectFormData_toNewProjectData({
			data,
			user_id: session?.user.id,
		});

		deleteFalsyKeys(documentData_new, ["attachment", "dateTo", "gallery"]);

		// Connect to the DB
		await connectToMongoDb();
		const document_prev = await Project.findOne({ _id: project_id });
		const document_new = await Project.findOneAndUpdate({ _id: project_id }, documentData_new, {
			new: true,
			strict: true,
		});

		await process_relations({
			documentData_new,
			document_new,
			document_prev,
			modelType: "Project",
		});

		// Deal with the "dateTo"
		if (!documentData_new.dateTo) {
			document_new.dateTo = undefined;
		}

		// Save the document with the changes above
		await document_new.save();

		return true;
	} catch (error) {
		console.error("Unable to update project", error);

		return null;
	} finally {
		revalidatePaths({ paths, redirectTo: paths[0] });
	}
};

export const deleteProject = async (project_id: string, paths: string[]): Promise<boolean> => {
	try {
		if (!(await getSession())?.user) {
			throw new Error(msgs("Errors")("invalidUser"));
		}

		// Connect to the DB and delete the project
		await connectToMongoDb();
		const document_deleted = await Project.findOneAndDelete({ _id: project_id });

		await process_relations({
			document_prev: document_deleted,
			modelType: "Project",
		});

		return !!document_deleted;
	} catch (error) {
		console.error("Unable to delete project", error);

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
	documentData_new?: NewProjectData;
	document_new?: ProjectDoc;
	document_prev?: ProjectDoc;
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
