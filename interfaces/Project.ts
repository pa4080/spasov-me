import { ObjectId } from "mongodb";

import { FileData, FileDoc } from "./File";
import { TagData, TagDoc } from "./Tag";
import { UserObject } from "./User";
import { ProjectType } from "./_common-data-types";

export interface ProjectDoc {
	_id: ObjectId;
	creator: UserObject;

	title: string;
	description: string;
	urlHome: string;
	urlRepo: string;
	projectType: ProjectType;
	dateFrom: Date | string;
	dateTo: Date | string | undefined;
	visibility: boolean | string;
	tags: ObjectId[] | undefined;
	attachment?: ObjectId | undefined; // attachment?: FileDocument;
	gallery: ObjectId[] | undefined; // gallery: FileDocument[];
}

export interface ProjectDocPopulated extends Omit<ProjectDoc, "attachment" | "tags" | "gallery"> {
	tags: TagDoc[];
	attachment?: FileDoc | undefined;
	gallery: FileDoc[] | undefined;
}

export interface NewProjectData
	extends Omit<ProjectDoc, "_id" | "attachment" | "creator" | "tags" | "gallery"> {
	creator: string;
	attachment?: string;
	tags: string[];
	gallery?: string[];
}

export interface ProjectHtmlProps {
	title: string;
	description: string;
	attachment?: FileData;
}

export interface ProjectData
	extends Omit<
		ProjectDoc,
		"_id" | "attachment" | "creator" | "tags" | "dateTo" | "dateFrom" | "visibility" | "gallery"
	> {
	_id: string;
	html: ProjectHtmlProps;
	dateFrom: Date;
	dateTo: Date | undefined;
	visibility: boolean;
	tags: TagData[];
	attachment?: string;
	gallery?: FileData[];
}
