import { ObjectId } from "mongodb";

import { FileData } from "./File";
import { UserObject } from "./User";

export type PageCardDoc = {
	_id: ObjectId;
	creator: UserObject;

	title: string;
	description: string;
	uri: string;
	visibility: boolean | string;
	attachment?: string;
	icon: string; // The icon here is like the ione in the Tags
};

export interface PageCardDocPopulated extends PageCardDoc {}

export type NewPageCardData = Omit<PageCardDoc, "_id" | "attachment" | "creator"> & {
	creator: string;
	attachment?: string;
	icon?: string;
};

export interface PageCardHtmlProps {
	title: string;
	description: string;
	attachment?: FileData;
	icon?: string;
}

export interface PageCardData
	extends Omit<PageCardDoc, "_id" | "attachment" | "creator" | "visibility"> {
	_id: string;
	html: PageCardHtmlProps;
	attachment: string | undefined;
	visibility: boolean;
	modelType: "PageCard"; // See { ModelType } from "./_common-data-types";
}
