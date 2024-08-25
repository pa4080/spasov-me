import { ObjectId } from "mongodb";

import { FileData } from "./File";
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
	urlAdmin: string;
	urlRepo: string;
	entryType: ProjectType;
	dateFrom: Date | string;
	dateTo: Date | string | undefined;
	visibility: boolean | string;
	tags: ObjectId[] | undefined;
	attachment?: string | undefined;
	icon?: string | undefined;
	gallery: string[] | undefined;
}

export interface ProjectDocPopulated extends Omit<ProjectDoc, "tags"> {
	tags: TagDoc[];
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
