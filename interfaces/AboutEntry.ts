import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

import { AboutEntryItem, CityItem, CountryItem } from "./_dataTypes";
import { TagDoc } from "./Tag";

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
	dateTo: Date | string | undefined;
	visibility: boolean | string;
	tags: TagDoc[];
};

// These interfaces became pretty similar to
// "Entry_FormSchema" and "Entry_FormSchema & { _id: string }"
// The main difference is "date...: Date | string;" vs "date...: z.ZodDate;"
export type NewAboutEntryData = Omit<AboutEntryDoc, "_id" | "attachment" | "creator" | "tags"> & {
	creator: string;
	attachment?: string;
	tags: string[];
};
