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
	slug: string;
	urlHome: string;
	urlRepo: string;
	projectType: ProjectType;
	dateFrom: Date | string;
	dateTo: Date | string | undefined;
	visibility: boolean | string;
	tags: ObjectId[] | undefined;
	attachment?: ObjectId | undefined;
	icon?: ObjectId | undefined;
	gallery: ObjectId[] | undefined;
}

export interface ProjectDocPopulated
	extends Omit<ProjectDoc, "attachment" | "tags" | "gallery" | "icon"> {
	tags: TagDoc[];
	attachment?: FileDoc | undefined;
	icon?: FileDoc | undefined;
	gallery: FileDoc[] | undefined;
}

export interface NewProjectData
	extends Omit<ProjectDoc, "_id" | "attachment" | "creator" | "tags" | "gallery" | "icon"> {
	creator: string;
	attachment?: string;
	icon?: string;
	tags: string[];
	gallery?: string[];
}

export interface ProjectHtmlProps {
	title: string;
	description: string;
	attachment?: FileData;
	icon?: FileData;
}

export interface ProjectData
	extends Omit<
		ProjectDoc,
		| "_id"
		| "attachment"
		| "creator"
		| "tags"
		| "dateTo"
		| "dateFrom"
		| "visibility"
		| "gallery"
		| "icon"
	> {
	_id: string;
	html: ProjectHtmlProps;
	dateFrom: Date;
	dateTo: Date | undefined;
	visibility: boolean;
	attachment?: string;
	icon?: string;
	tags: TagData[];
	gallery?: FileData[];
}
