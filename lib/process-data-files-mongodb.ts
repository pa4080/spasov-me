import { FileData, FileDoc } from "@/interfaces/File";
import { Route } from "@/routes";

import { processMarkdown } from "./process-markdown";

export function fileDocuments_toData({
	files,
	hyphen = true,
	visible,
}: {
	files: FileDoc[];
	hyphen?: boolean;
	visible?: boolean;
}): FileData[] {
	let filesFiltered = files;

	if (visible) {
		filesFiltered = files.filter((file) => file.metadata?.visibility === true);
	}

	return filesFiltered.map((file) => ({
		_id: file._id.toString(),
		filename: file.filename,
		length: file.length,
		chunkSize: file.chunkSize,
		uploadDate: file.uploadDate,
		metadata: {
			description: file.metadata?.description,
			size: file.metadata?.size,
			contentType: file.metadata?.contentType,
			lastModified: file.metadata?.lastModified,
			originalName: file.metadata?.originalName,
			attachedTo: file.metadata?.attachedTo,
			visibility: file.metadata?.visibility,
			html: {
				filename: file.filename,
				title: processMarkdown({ markdown: file.filename, hyphen: true }),
				description: processMarkdown({ markdown: file.metadata?.description, hyphen }),
				fileUri: `${Route.api.FILES_MONGODB}/${file._id.toString()}/${file.filename}?v=${new Date(
					file.uploadDate
				).getTime()}`,
			},
		},
	}));
}
