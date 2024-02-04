import { FileData, FileDocument } from "@/interfaces/File";
import { Route } from "@/routes";

import { processMarkdown } from "./process-markdown";

export function fileDocuments_toData({
	files,
	hyphen = true,
	visible,
}: {
	files: FileDocument[];
	hyphen?: boolean;
	visible?: boolean;
}): FileData[] {
	let filesFiltered = files;

	if (visible) {
		// Need to update the file model to add a visibility field
		filesFiltered = files.filter((file) => file);
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
			html: {
				title: processMarkdown({ markdown: file.filename, hyphen: true }),
				description: processMarkdown({ markdown: file.metadata?.description, hyphen }),
				fileUri: `${Route.api.FILES}/${file._id.toString()}/${file.filename}?v=${new Date(
					file.uploadDate
				).getTime()}`,
			},
		},
	}));
}
