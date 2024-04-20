import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

import { r2BucketName } from "@/env";

import { FileMetadata } from "@/interfaces/File";

import { s3client } from "./index";

/**
 * @param fileName The name of the file incl. the relative path: tmp/prjId/subPath/file.name
 * @param localFsFilePath The absolute path to the file: /home/user/workDir/tmp/prjId/subPath/file.name
 */
export const uploadObject = async ({
	filename,
	fileBody,
	metadata,
	bucket,
}: {
	filename: string;
	fileBody: PutObjectCommandInput["Body"];
	metadata: FileMetadata;
	bucket?: string;
}) => {
	try {
		const metadataRecord: Record<string, string> = {};

		Object.entries(metadata).forEach(([key, value]) => {
			metadataRecord[key] = JSON.stringify(value);
		});

		const command = new PutObjectCommand({
			Body: fileBody,
			Bucket: bucket || r2BucketName,
			Key: filename,
			ContentType: metadata.contentType,
			Metadata: metadataRecord,
		});

		const responseObject = await s3client.send(command);

		return responseObject["$metadata"].httpStatusCode === 200;
	} catch (error) {
		console.error(error);

		return null;
	}
};
