import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

import { AboutEntryType, CityType, CountryType } from "./_dataTypes";
import { TagDoc, TagListItem } from "./Tag";

export interface AboutEntryDoc {
	_id: string;
	creator: UserObject;
	attachment?: GridFSFile;

	title: string;
	description: string;
	country: CountryType;
	city: CityType;
	entryType: AboutEntryType;
	dateFrom: Date | string;
	dateTo: Date | string | undefined;
	visibility: boolean | string;
	tags: TagDoc[];
}

export interface NewAboutEntryData
	extends Omit<AboutEntryDoc, "_id" | "attachment" | "creator" | "tags"> {
	creator: string;
	attachment?: string;
	tags: string[];
}

export interface AboutEntryHtmlProps {
	title: string;
	description: string;
	attachmentUri?: string;
}

export interface AboutEntryData
	extends Omit<
		AboutEntryDoc,
		"_id" | "attachment" | "creator" | "tags" | "dateTo" | "dateFrom" | "visibility"
	> {
	_id: string;
	html: AboutEntryHtmlProps;
	tags: TagListItem[];
	dateFrom: Date;
	dateTo: Date | undefined;
	visibility: boolean;
}
