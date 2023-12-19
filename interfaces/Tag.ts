import { UserObject } from "@/interfaces/User";

import { TagItem } from "./_dataTypes";

export type TagDoc = {
	_id: string;
	creator: UserObject;

	name: string;
	description: string;
	icon: string;
	tagType: TagItem;
};

export type NewTagData = Omit<TagDoc, "_id" | "creator"> & {
	creator: string;
};

export type TagListItem = Omit<TagDoc, "_id" | "creator"> & {
	_id: string;
};

export type TagList = TagListItem[];
