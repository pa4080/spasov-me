import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

import { CityItem, CountryItem, AboutEntryItem } from "./_dataTypes";

export type AboutEntryDoc = {
	_id: string;
	creator: UserObject;
	image?: GridFSFile;

	title: string;
	description: string;
	country: CountryItem;
	city: CityItem;
	entryType: AboutEntryItem;
	dateFrom: Date | string;
	dateTo: Date | string;
	visibility: boolean | string;
};

export type NewAboutEntryDoc = Omit<AboutEntryDoc, "_id" | "image" | "creator"> & {
	creator: string;
	image?: string;
};

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
