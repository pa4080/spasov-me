import { ObjectId } from "mongodb";

import { FileData } from "./File";
import { TagData, TagDoc } from "./Tag";
import { UserObject } from "./User";
import { PostType } from "./_common-data-types";

export interface PostDoc {
	_id: ObjectId;
	creator: UserObject;

	title: string;
	description: string;
	slug: string;
	entryType: PostType;
	url1: string;
	url2: string;
	dateFrom: Date | string;
	dateTo: Date | string | undefined;
	galleryNav: boolean | string;
	galleryCaptions: boolean | string;
	visibility: boolean | string;
	attachment?: string | undefined;
	icon?: string | undefined;
	gallery: string[] | undefined;
	tags: ObjectId[] | undefined;
}

export interface PostDocPopulated extends Omit<PostDoc, "tags"> {
	tags: TagDoc[];
}

export interface NewPostData
	extends Omit<PostDoc, "_id" | "attachment" | "creator" | "tags" | "gallery" | "icon"> {
	creator: string;
	attachment?: string;
	icon?: string;
	tags: string[];
	gallery?: string[];
}

export interface PostHtmlProps {
	title: string;
	description: string;
	attachment?: FileData;
	icon?: FileData;
}

export interface PostData
	extends Omit<
		PostDoc,
		| "_id"
		| "attachment"
		| "creator"
		| "tags"
		| "dateTo"
		| "dateFrom"
		| "galleryNav"
		| "galleryCaptions"
		| "visibility"
		| "gallery"
		| "icon"
	> {
	_id: string;
	html: PostHtmlProps;
	dateFrom: Date;
	dateTo: Date | undefined;
	galleryNav: boolean;
	galleryCaptions: boolean;
	visibility: boolean;
	attachment?: string;
	icon?: string;
	tags: TagData[];
	gallery?: FileData[];
}
