import { type ObjectId } from "mongodb";

import { type FileData } from "./File";
import { type TagData, type TagDoc } from "./Tag";
import { type UserObject } from "./User";
import {
  type LabEntryHostType,
  type LabEntryPropertyType,
  type LabEntryType,
  type LabEntryVisibilityType,
} from "./_common-data-types";

export interface LabEntryDoc {
  _id: ObjectId;
  creator: UserObject;

  title: string; //
  description: string; //
  slug: string; //
  entryType: LabEntryType; //

  visibilityType: LabEntryVisibilityType;
  propertyType: LabEntryPropertyType;
  hostType: LabEntryHostType;

  urlHome?: string;
  urlAdmin?: string;
  urlSource?: string;

  dateFrom: Date | string;
  dateTo: Date | string | undefined;

  visibility: boolean | string;
  attachment?: string | undefined;
  icon?: string | undefined;
  gallery: string[] | undefined;
  tags: ObjectId[] | undefined;
}

export interface LabEntryDocPopulated extends Omit<LabEntryDoc, "tags"> {
  tags: TagDoc[];
}

export interface NewLabEntryData
  extends Omit<LabEntryDoc, "_id" | "attachment" | "creator" | "tags" | "gallery" | "icon"> {
  creator: string;
  attachment?: string;
  icon?: string;
  tags: string[];
  gallery?: string[];
}

export interface LabEntryHtmlProps {
  title: string;
  // Wee need to remove the sensitive data for the Cards which will be public
  // See @/components/lab/public/Card.tsx
  description: string;
  // descriptionPublic: string;
  // descriptionPrivate: string;
  attachment?: FileData;
  icon?: FileData;
}

export interface LabEntryData
  extends Omit<
    LabEntryDoc,
    | "_id"
    | "attachment"
    | "creator"
    | "tags"
    | "dateTo"
    | "dateFrom"
    | "visibility"
    | "gallery"
    | "icon"
  > {
  _id: string;
  html: LabEntryHtmlProps;
  dateFrom: Date;
  dateTo: Date | undefined;
  visibility: boolean;
  attachment?: string;
  icon?: string;
  tags: TagData[];
  gallery?: FileData[];
  modelType: "LabEntry"; // See { ModelType } from "./_common-data-types";
}
