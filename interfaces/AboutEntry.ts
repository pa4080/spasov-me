import { FileData, FileDocument } from "./File";
import { TagData, TagDoc } from "./Tag";
import { UserObject } from "./User";
import { AboutEntryType, CityType, CountryType } from "./_dataTypes";

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
	tags: TagDoc[];
	attachment?: FileDocument;
	gallery: FileDocument[];
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
	attachmentUri?: string;
}

export interface AboutEntryData
	extends Omit<
		AboutEntryDoc,
		"_id" | "attachment" | "creator" | "tags" | "dateTo" | "dateFrom" | "visibility" | "gallery"
	> {
	gallery?: FileData[];
	_id: string;
	html: AboutEntryHtmlProps;
	tags: TagData[];
	attachment: string | undefined;
	dateFrom: Date;
	dateTo: Date | undefined;
	visibility: boolean;
}
