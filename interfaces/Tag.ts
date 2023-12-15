import { UserObject } from "@/interfaces/User";

import { TagItem } from "./_dataTypes";

export type AboutEntryDoc = {
	_id: string;
	creator: UserObject;

	title: string;
	description: string;
	tagType: TagItem;
	icon: string;
};

// These interfaces became pretty similar to
// "Tag_FormSchema" and "Tag_FormSchema & { _id: string }"
export type NewAboutEntryData = Omit<AboutEntryDoc, "_id" | "creator"> & {
	creator: string;
};
