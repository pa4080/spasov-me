import { GridFSFile } from "mongodb";

import { UserObject } from "@/interfaces/User";

import { AttachedToDocument } from "./_common-data-types";

export interface FileMetadata {
	description: string;
	creator: UserObject;
	size: string;
	contentType: string;
	lastModified: Date;
	originalName: string;
	attachedTo?: AttachedToDocument[];
}

export interface FileDocument extends Omit<GridFSFile, "metadata"> {
	metadata: FileMetadata;
}

export interface FileListItem {
	value: string;
	label: string;
	sourceImage?: string; // Actually this is the URI of the image used in the (entry, post, project) form gallery
	sourceDescription?: string; // Actually this is the name of the image used in the (entry, post, project) form gallery
}

export interface FileHtmlProps {
	title: string;
	description: string;
	fileUri: string;
}

/**
 * example for FileDocument:
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

export interface FileData extends Omit<FileDocument, "_id" | "creator" | "metadata"> {
	_id: string;
	metadata: Omit<FileMetadata, "creator"> & { html: FileHtmlProps };
}
