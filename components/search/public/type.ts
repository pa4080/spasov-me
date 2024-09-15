import { AboutEntryData } from "@/interfaces/AboutEntry";
import { LabEntryData } from "@/interfaces/LabEntry";
import { PostData } from "@/interfaces/Post";
import { ProjectData } from "@/interfaces/Project";

export interface LabEntryCustom extends Omit<LabEntryData, "entryType"> {
	entryType: "lab";
}

export type UnitedEntryType = ProjectData | AboutEntryData | PostData | LabEntryCustom;
