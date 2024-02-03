import { AboutEntryData, AboutEntryDoc, NewAboutEntryData } from "@/interfaces/AboutEntry";
import { AboutEntryType, CityType, CountryType } from "@/interfaces/_dataTypes";
import { Route } from "@/routes";

import { fileDocumentsToData } from "./process-data-files";
import { processMarkdown } from "./process-markdown";

export function aboutDocumentsToData({
	entries,
	hyphen,
	typeList,
	visible,
}: {
	entries: AboutEntryDoc[];
	hyphen?: boolean;
	typeList?: AboutEntryType[];
	visible?: boolean;
}): AboutEntryData[] {
	let entriesFiltered = entries;

	if (visible) {
		entriesFiltered = entries.filter((entry) => entry.visibility);
	}

	return entriesFiltered
		.filter(({ entryType }) => (typeList && typeList.includes(entryType)) ?? true)
		.map((entry) => {
			return {
				_id: entry._id.toString(),
				html: {
					// This cannot be done in the client side
					title: processMarkdown({
						markdown: entry.title,
						hyphen,
					}),
					description: processMarkdown({
						markdown: entry.description,
						hyphen,
					}),
					attachmentUri:
						entry.attachment &&
						`${Route.api.FILES}/${entry.attachment?._id.toString()}/${
							entry.attachment?.filename
						}?v=${new Date(entry.attachment?.uploadDate).getTime()}`,
				},
				title: entry.title,
				description: entry.description,
				country: entry.country,
				city: entry.city,
				dateFrom: entry.dateFrom as Date,
				dateTo: entry.dateTo as Date | undefined,
				entryType: entry.entryType,
				visibility: entry.visibility as boolean,
				attachment: entry.attachment?._id.toString(),
				tags:
					entry.tags?.map((tag) => ({
						name: tag.name,
						description: tag.description,
						_id: tag._id.toString(),
						icon: tag.icon,
						tagType: tag.tagType,
						orderKey: tag.orderKey,
					})) || [],
				gallery: fileDocumentsToData({ files: entry.gallery || [] }),
			};
		});
}

export function aboutFormDataToNewEntryData({
	data,
	user_id,
}: {
	data: FormData;
	user_id: string;
}): NewAboutEntryData {
	return {
		title: data.get("title") as string,
		description: data.get("description") as string,
		country: data.get("country") as CountryType,
		city: data.get("city") as CityType,
		entryType: data.get("entryType") as AboutEntryType,
		dateFrom: data.get("dateFrom") as string,
		dateTo: data.get("dateTo") as string,
		visibility: data.get("visibility") as string,
		attachment: data.get("attachment") as string,

		tags: JSON.parse(data.get("tags") as string) as string[],
		gallery: JSON.parse(data.get("gallery") as string) as string[],

		creator: user_id,
	};
}
