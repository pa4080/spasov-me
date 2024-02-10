import { ObjectId } from "mongodb";

import { FileDoc } from "./File";
import { UserObject } from "./User";

export type PageCardDoc = {
	_id: string;
	creator: UserObject;

	title: string;
	description: string;
	uri: string;
	attachment?: ObjectId;
	visibility: boolean | string;
};

export interface PageCardDocPopulated extends Omit<PageCardDoc, "attachment"> {
	attachment?: FileDoc;
}

export type NewPageCardData = Omit<PageCardDoc, "_id" | "attachment" | "creator"> & {
	creator: string;
	attachment?: string;
};

export interface PageCardHtmlProps {
	title: string;
	description: string;
	attachmentUri?: string;
}

export interface PageCardData
	extends Omit<PageCardDoc, "_id" | "attachment" | "creator" | "visibility"> {
	_id: string;
	html: PageCardHtmlProps;
	attachment: string | undefined;
	visibility: boolean;
}

// These are helpers for the API version
type PageCardDocToFetch = {
	data: PageCardDoc | NewPageCardData | Record<string, unknown>;
	user_id?: string | undefined;
};

export const preparePageCardDocToFetch = ({ data, user_id }: PageCardDocToFetch) => {
	return JSON.stringify({
		...data,
		creator: user_id,
	});
};
