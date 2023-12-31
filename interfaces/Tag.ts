import { UserObject } from "@/interfaces/User";

import { TagType } from "./_dataTypes";

export interface TagDoc {
	_id: string;
	creator: UserObject;

	name: string;
	description: string;
	icon: string;
	tagType: TagType;
	orderKey: string;
}

export interface NewTagData extends Omit<TagDoc, "_id" | "creator"> {
	creator: string;
}

export interface TagListItem extends Omit<TagDoc, "_id" | "creator"> {
	_id: string;
}
