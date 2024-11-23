import { type ObjectId } from "mongodb";

import { type FileData } from "./File";
import { type TagData, type TagDoc } from "./Tag";
import { type UserObject } from "./User";
import { type AboutEntryType, type CityType, type CountryType } from "./_common-data-types";

export interface AboutEntryDoc {
  _id: ObjectId;
  creator: ObjectId;

  title: string;
  description: string;
  country: CountryType;
  city: CityType;
  entryType: AboutEntryType;
  dateFrom: Date | string;
  dateTo: Date | string | undefined;
  visibility: boolean | string;
  tags: ObjectId[] | undefined;
  attachment?: string | undefined; // attachment?: FileDocument;
  gallery: string[] | undefined; // gallery: FileDocument[];
}

export interface AboutEntryDocPopulated
  extends Omit<AboutEntryDoc, "creator" | "attachment" | "tags" | "gallery"> {
  creator: UserObject;
  tags: TagDoc[];
  attachment?: string | undefined;
  gallery: string[] | undefined;
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
  modelType: "AboutEntry"; // See { ModelType } from "./_common-data-types";
}
