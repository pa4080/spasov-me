import { NewPageData, PageData, PageDoc } from "@/interfaces/Page";
import { Route } from "@/routes";

import { processMarkdown } from "./process-markdown";

export function pageDocumentsToData({
	pages,
	hyphen,
	visible,
}: {
	pages: PageDoc[];
	hyphen?: boolean;
	visible?: boolean;
}): PageData[] {
	let pagesFiltered = pages;

	if (visible) {
		pagesFiltered = pages.filter((entry) => entry.visibility);
	}

	return pagesFiltered.map((page) => {
		return {
			_id: page._id.toString(),
			html: {
				// This cannot be done in the client side
				title: processMarkdown({
					markdown: page.title,
					hyphen,
				}),
				description: processMarkdown({
					markdown: page.description,
					hyphen,
				}),
				attachmentUri:
					page.attachment &&
					`${Route.api.FILES}/${page.attachment?._id.toString()}/${
						page.attachment?.filename
					}?v=${new Date(page.attachment?.uploadDate).getTime()}`,
			},
			uri: page.uri,
			title: page.title,
			description: page.description,
			visibility: page.visibility as boolean,
			attachment: page.attachment?._id.toString(),
		};
	});
}

export function pageFormDataToNewEntryData({
	data,
	user_id,
}: {
	data: FormData;
	user_id: string;
}): NewPageData {
	return {
		title: data.get("title") as string,
		description: data.get("description") as string,
		visibility: data.get("visibility") as string,
		attachment: data.get("attachment") as string,
		uri: data.get("uri") as string,

		creator: user_id,
	};
}
