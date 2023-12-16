import { UserObject } from "@/interfaces/User";

import { TagItem } from "./_dataTypes";

export type TagDoc = {
	_id: string;
	creator: UserObject;

	title: string;
	description: string;
	icon: string;
	tagType: TagItem;
};

// These interfaces became pretty similar to
// "Tag_FormSchema" and "Tag_FormSchema & { _id: string }"
export type NewTagData = Omit<TagDoc, "_id" | "creator"> & {
	creator: string;
};
