import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

import { AboutEntryItem, CityItem, CountryItem } from "./_dataTypes";

export type AboutEntryDoc = {
	_id: string;
	creator: UserObject;
	attachment?: GridFSFile;

	title: string;
	description: string;
	country: CountryItem;
	city: CityItem;
	entryType: AboutEntryItem;
	dateFrom: Date | string;
	dateTo: Date | string;
	visibility: boolean | string;
};

// These interfaces became pretty similar to
// "Entry_FormSchema" and "Entry_FormSchema & { _id: string }"
// The main difference is "date...: Date | string;" vs "date...: z.ZodDate;"
export type NewAboutEntryData = Omit<AboutEntryDoc, "_id" | "attachment" | "creator"> & {
	creator: string;
	attachment?: string;
};

/**
 *
type AboutEntryDocToFetch = {
	data: PageDoc | NewPageDoc | Record<string, unknown>;
	// image_id?: string | null;
	user_id?: string | undefined;
};

export const prepareAboutEntryDocToFetch = ({ data, user_id }: PageDocToFetch) => {
	return JSON.stringify({
		...data,
		creator: user_id,
	});
};
*/
