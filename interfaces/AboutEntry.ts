import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

import { CityItem, CountryItem, EntryItem } from "./_dataTypes";

export type AboutEntryDoc = {
	_id: string;
	creator: UserObject;
	image?: GridFSFile;

	title: string;
	description: string;
	country: CountryItem;
	city: CityItem;
	entryType: EntryItem;
	dateFrom: Date;
	dateTo: Date;
	visibility: boolean | string;
};

// export type NewPageDoc = Omit<PageDoc, "_id" | "image" | "creator"> & {
// 	creator: string;
// 	image?: string;
// };

// export type ErrorPageDoc = {
// 	[key in keyof PageDoc]: {
// 		kind?: string; // "regexp", "required", etc.
// 		message?: string; // the actual error message
// 		name?: string; // ValidatorError
// 		path?: string; // image, link, etc.
// 		properties?: {}; // contains the same information as the other fields
// 		value?: string; // the actual value that caused the error
// 	};
// };

// type PageDocToFetch = {
// 	data: PageDoc | NewPageDoc | Record<string, unknown>;
// 	// image_id?: string | null;
// 	user_id?: string | undefined;
// };

// export const preparePageDocToFetch = ({ data, user_id }: PageDocToFetch) => {
// 	return JSON.stringify({
// 		...data,
// 		creator: user_id,
// 	});
// };
