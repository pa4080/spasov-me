import { FileDocument } from "./File";
import { UserObject } from "./User";

export type PageDoc = {
	_id: string;
	creator: UserObject;

	title: string;
	description: string;
	uri: string;
	attachment?: FileDocument;
	visibility: boolean | string;
};

export type NewPageData = Omit<PageDoc, "_id" | "attachment" | "creator"> & {
	creator: string;
	attachment?: string;
};

export interface PageHtmlProps {
	title: string;
	description: string;
	attachmentUri?: string;
}

export interface PageData extends Omit<PageDoc, "_id" | "attachment" | "creator" | "visibility"> {
	_id: string;
	html: PageHtmlProps;
	attachment: string | undefined;
	visibility: boolean;
}

// These are helpers for the API version
type PageDocToFetch = {
	data: PageDoc | NewPageData | Record<string, unknown>;
	user_id?: string | undefined;
};

export const preparePageDocToFetch = ({ data, user_id }: PageDocToFetch) => {
	return JSON.stringify({
		...data,
		creator: user_id,
	});
};
