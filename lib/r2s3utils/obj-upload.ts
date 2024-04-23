import { PutObjectCommand, PutObjectCommandInput, S3, S3Client } from "@aws-sdk/client-s3";

import { r2BucketName } from "@/env";
import { FileMetadata } from "@/interfaces/File";

import { config } from "./index";

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
	const s3client = new S3(config) || new S3Client(config);

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