import { getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import { NewPageCardData, PageCardData, PageCardDocPopulated } from "@/interfaces/PageCard";

import { processMarkdown } from "./process-markdown";

export async function PageCardDocuments_toData({
	pages,
	hyphen = false,
	visible,
}: {
	pages: PageCardDocPopulated[];
	hyphen?: boolean;
	visible?: boolean;
}): Promise<PageCardData[]> {
	let pagesFiltered = pages;

	if (visible) {
		pagesFiltered = pages.filter((entry) => entry.visibility);
	}

	const files = await getFilesR2();

	return pagesFiltered.map((page) => ({
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
			// attachment: fileDocuments_toData({
			// 	files: page?.attachment ? [page?.attachment] : [],
			// })?.[0], // TODO: files-cloudflare tidy up
			attachment: files?.find((file) => file?._id === page?.attachment),
		},
		uri: page.uri,
		title: page.title,
		description: page.description,
		visibility: page.visibility as boolean,
		// attachment: page.attachment?._id.toString(), // TODO: files-cloudflare tidy up
		attachment: page.attachment, // TODO: files-cloudflare tidy up
	}));
}

export function pageFormData_toNewEntryData({
	data,
	user_id,
}: {
	data: FormData;
	user_id: string;
}): NewPageCardData {
	return {
		title: data.get("title") as string,
		description: data.get("description") as string,
		visibility: data.get("visibility") as string,
		attachment: data.get("attachment") as string,
		uri: data.get("uri") as string,

		creator: user_id,
	};
}
