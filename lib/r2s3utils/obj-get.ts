/**
 * Download an objects in the bucket from CLI:
 * > doppler run -- pnpm exec ts-node -e 'require("./src/utils/aws/obj-download.ts").getObjectListAndDownload({log: true, prefix: "uploads/a2b2d72a81fed831527e/README.md", repoId: "a2b2d72a81fed831527e"})'
 *
 * References:
 * > https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/s3#code-examples
 * > https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/actions/delete-objects.js
 */

import { GetObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";

import { config } from "./index";

const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

export const getObject = async ({
	objectKey,
	bucket,
	log = false,
	partNumber,
}: {
	objectKey: string;
	bucket?: string;
	log?: boolean;
	partNumber?: number;
}) => {
	const s3client = new S3(config) || new S3Client(config);

	try {
		const command = new GetObjectCommand({
			Bucket: bucket || r2BucketName,
			Key: objectKey,
			PartNumber: partNumber,
		});

		const responseObject = await s3client.send(command);

		if (log) {
			process.stdout.write(`🗂️  Object: ${objectKey}, ${responseObject.ContentType}\n`);
		}

		return responseObject;
	} catch (err) {
		console.error(objectKey, "::", (err as Error).message);

		return null;
	}
};
