import { type ObjectId } from "mongodb";

import { type UserObject } from "@/interfaces/User";

import { type AttachedToDocument, type TagType } from "./_common-data-types";

export interface TagDoc {
  _id: ObjectId;
  creator: UserObject;

  name: string;
  description: string;
  icon: string;
  tagType: TagType;
  orderKey: string;
  attachedTo?: AttachedToDocument[];
}

export interface NewTagData extends Omit<TagDoc, "_id" | "creator"> {
  creator: string;
}

export interface TagHtmlProps {
  description: string;
}

export interface TagData extends Omit<TagDoc, "_id" | "creator"> {
  _id: string;
  html: TagHtmlProps;
}
