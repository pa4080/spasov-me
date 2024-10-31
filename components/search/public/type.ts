import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type LabEntryData } from "@/interfaces/LabEntry";
import { type PostData } from "@/interfaces/Post";
import { type ProjectData } from "@/interfaces/Project";

export interface LabEntryCustom extends Omit<LabEntryData, "entryType"> {
  entryType: "lab";
}

export type UnitedEntryType = ProjectData | AboutEntryData | PostData | LabEntryCustom;
