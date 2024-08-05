import { GetObjectCommandOutput } from "@aws-sdk/client-s3";

import { FileMetadata } from "@/interfaces/File";

export interface GenerateFileMapInput {
	dir: string;
	date: Date;
	creatorId: string;
	locale?: string;
	filename_trim_prefix?: string;
}

export interface FileMapFs {
	fsSourceFile: string; // the path to the file on the FS and the filename
	metadata: FileMetadata;
	Key: string; // filename_objectKey -- for consistency with _Object
}

export interface FileMapUpload {
	Key: string;
	prefix?: string;
	fileData?: GetObjectCommandOutput;
	fsSourceFile: string;
	metadata?: FileMetadata;
}
