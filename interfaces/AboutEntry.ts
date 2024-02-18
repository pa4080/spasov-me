import { ObjectId } from "mongodb";

import { FileData, FileDoc } from "./File";
import { TagData, TagDoc } from "./Tag";
import { UserObject } from "./User";
import { AboutEntryType, CityType, CountryType } from "./_common-data-types";

export interface AboutEntryDoc {
	_id: string;
	creator: UserObject;

	title: string;
	description: string;
	country: CountryType;
	city: CityType;
	entryType: AboutEntryType;
	dateFrom: Date | string;
	dateTo: Date | string | undefined;
	visibility: boolean | string;
	tags: ObjectId[] | undefined;
	attachment?: ObjectId | undefined; // attachment?: FileDocument;
	gallery: ObjectId[] | undefined; // gallery: FileDocument[];
}

export interface AboutEntryDocPopulated
	extends Omit<AboutEntryDoc, "attachment" | "tags" | "gallery"> {
	tags: TagDoc[];
	attachment?: FileDoc | undefined;
	gallery: FileDoc[] | undefined;
}

export interface NewAboutEntryData
	extends Omit<AboutEntryDoc, "_id" | "attachment" | "creator" | "tags" | "gallery"> {
	creator: string;
	attachment?: string;
	tags: string[];
	gallery?: string[];
}

export interface AboutEntryHtmlProps {
	title: string;
	description: string;
	attachment?: FileData;
}

export interface AboutEntryData
	extends Omit<
		AboutEntryDoc,
		"_id" | "attachment" | "creator" | "tags" | "dateTo" | "dateFrom" | "visibility" | "gallery"
	> {
	_id: string;
	html: AboutEntryHtmlProps;
	tags: TagData[];
	dateFrom: Date;
	dateTo: Date | undefined;
	visibility: boolean;
	attachment?: string;
	gallery?: FileData[];
}
