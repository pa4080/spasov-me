import { getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import {
	LabEntryAccessType,
	LabEntryHostType,
	LabEntryLocationType,
	LabEntryPropertyType,
	LabEntryType,
	LabEntryVisibilityType,
} from "@/interfaces/_common-data-types";

import { LabEntryData, LabEntryDocPopulated, NewLabEntryData } from "@/interfaces/LabEntry";

import { tagDocuments_toData } from "./process-data-tags";
import { processMarkdown } from "./process-markdown";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

export async function labEntryDocuments_toData({
	labEntries,
	hyphen,
	typeList,
	visible,
}: {
	labEntries: LabEntryDocPopulated[];
	hyphen?: boolean;
	typeList?: LabEntryType[];
	visible?: boolean;
}): Promise<LabEntryData[]> {
	let labEntriesFiltered = labEntries;

	if (visible) {
		labEntriesFiltered = labEntries.filter((entry) => entry.visibility);
	}

	const files = await getFilesR2({ prefix: files_prefix });
	const icons = await getFilesR2({ prefix: icons_prefix });

	return labEntriesFiltered
		.filter(({ entryType }) => (typeList && typeList.includes(entryType)) ?? true)
		.map((labEntry) => ({
			_id: labEntry._id.toString(),
			html: {
				// This cannot be done in the client side
				title: processMarkdown({
					markdown: labEntry.title,
					hyphen,
				}),
				description: processMarkdown({
					markdown: labEntry.description,
					hyphen,
				}),
				attachment: files?.find((file) => file?._id === labEntry?.attachment),
				icon:
					files?.find((file) => file?._id === labEntry?.icon) ||
					icons?.find((icon) => icon?._id === labEntry?.icon),
			},
			title: labEntry.title,
			description: labEntry.description,
			slug: labEntry.slug,
			entryType: labEntry.entryType,

			visibilityType: labEntry.visibilityType,
			propertyType: labEntry.propertyType,
			hostType: labEntry.hostType,
			locationType: labEntry.locationType,
			accessType: labEntry.accessType,

			urlHome: labEntry.urlHome,
			urlAdmin: labEntry.urlAdmin,
			urlSource: labEntry.urlSource,

			dateFrom: labEntry.dateFrom as Date,
			dateTo: labEntry.dateTo as Date | undefined,
			active: labEntry.active as boolean,

			visibility: labEntry.visibility as boolean,
			attachment: labEntry.attachment,
			icon: labEntry.icon,
			gallery: files?.filter((file) => labEntry?.gallery?.includes(file._id)),
			tags: tagDocuments_toData({ tags: labEntry.tags || [], hyphen: true }),
		}));
}

export function labEntryFormData_toNewLabEntryData({
	data,
	user_id,
}: {
	data: FormData;
	user_id: string;
}): NewLabEntryData {
	return {
		title: data.get("title") as string,
		description: data.get("description") as string,
		slug: data.get("slug") as string,
		entryType: data.get("entryType") as LabEntryType,

		visibilityType: data.get("visibilityType") as LabEntryVisibilityType,
		propertyType: data.get("propertyType") as LabEntryPropertyType,
		hostType: data.get("hostType") as LabEntryHostType,
		locationType: data.get("locationType") as LabEntryLocationType,
		accessType: data.get("accessType") as LabEntryAccessType,

		urlHome: data.get("urlHome") as string,
		urlAdmin: data.get("urlAdmin") as string,
		urlSource: data.get("urlSource") as string,

		dateFrom: data.get("dateFrom") as string,
		dateTo: data.get("dateTo") as string,
		active: data.get("active") as string,

		visibility: data.get("visibility") as string,
		attachment: data.get("attachment") as string,
		icon: data.get("icon") as string,
		gallery: JSON.parse(data.get("gallery") as string) as string[],
		tags: JSON.parse(data.get("tags") as string) as string[],

		creator: user_id,
	};
}
