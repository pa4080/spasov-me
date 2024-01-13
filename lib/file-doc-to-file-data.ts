import { FileData, FileDocument } from "@/interfaces/File";

import { Route } from "@/routes";

import { processMarkdown } from "./process-markdown";

export default function fileDocumentToData(files: FileDocument[]): FileData[] {
	return files.map((file) => ({
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
			html: {
				description: processMarkdown({ markdown: file.metadata?.description, hyphen: true }),
				fileUri: `${Route.api.FILES}/${file._id.toString()}/${file.filename}?v=${new Date(
					file.uploadDate
				).getTime()}`,
			},
		},
	}));
}
