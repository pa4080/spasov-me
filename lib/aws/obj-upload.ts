import { PutObjectCommand, PutObjectCommandInput, S3, S3Client } from "@aws-sdk/client-s3";

import { FileMetadata } from "../../interfaces/File";

import { config } from "./index";

const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

export const uploadObject = async ({
	objectKey,
	objectBody,
	metadata,
	bucket,
	prefix,
}: {
	objectKey: string;
	objectBody: PutObjectCommandInput["Body"];
	metadata: FileMetadata;
	bucket?: string;
	prefix?: string;
}) => {
	const s3client = new S3(config) || new S3Client(config);

	try {
		const metadataRecord: Record<string, string> = {};

		Object.entries(metadata).forEach(([key, value]) => {
			metadataRecord[key] = JSON.stringify(value);
		});

		const command = new PutObjectCommand({
			Body: objectBody,
			Bucket: bucket || r2BucketName,
			Key: prefix ? `${prefix}/${objectKey}` : objectKey,
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
