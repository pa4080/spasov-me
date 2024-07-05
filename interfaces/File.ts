import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

import { AttachedToDocument } from "./_common-data-types";

export interface FileMetadata {
	description: string;
	creator: UserObject | string;
	contentType: string;
	lastModified: Date | string | number;
	originalName: string;
	attachedTo?: AttachedToDocument[];
	visibility: boolean | string;
	size: string;
	info: { height: number; width: number; ratio: number; type: string };
}

export interface FileDoc extends Omit<GridFSFile, "metadata"> {
	metadata: FileMetadata;
}

export interface FileListItem {
	value: string;
	label: string;
	sourceImage?: string; // Actually this is the URI of the image used in the (entry, post, project) form gallery
	sourceDescription?: string; // Actually this is the name of the image used in the (entry, post, project) form gallery
}

export interface FileHtmlProps {
	filename: string;
	title: string;
	description: string;
	fileUri?: string;
	fileUrl?: string;
}

/**
 * example for FileDoc:
 *
{
	metadata: [Object],
	_id: new ObjectId('658feb2d27e60e8243b03c78'),
	length: 17926,
	chunkSize: 17942,
	uploadDate: 2023-12-30T10:04:29.793Z,
	filename: 'spas-z-spasov-7-photo.square.small.jpg'
},
*/

export interface FileData extends Omit<FileDoc, "_id" | "creator" | "metadata" | "chunkSize"> {
	_id: string;
	objectKey: string;
	metadata: Omit<FileMetadata, "creator"> & { html: FileHtmlProps };
}
