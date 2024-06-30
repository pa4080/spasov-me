import { PutObjectCommand, S3, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import fs from "fs";

import { FileMetadata } from "../../interfaces/File";
import { FileMapFs } from "./local-files-map";

export const config: S3ClientConfig = {
	credentials: {
		accessKeyId: process.env.CLOUDFLARE_API_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_API_ACCESS_KEY_SECRET!,
	},
	region: process.env.CLOUDFLARE_R2_BUCKET_REGION!,
	endpoint: process.env.CLOUDFLARE_API_ENDPOINT!,
};

const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

/**
 * @param fileName The name of the file incl. the relative path: tmp/prjId/subPath/file.name
 * @param localFsFilePath The absolute path to the file: /home/user/workDir/tmp/prjId/subPath/file.name
 */
export const uploadObject = async ({
	objectKey,
	fsSourceFile,
	metadata,
	bucket,
	prefix,
}: {
	objectKey: string;
	fsSourceFile: string;
	metadata: FileMetadata;
	bucket?: string;
	prefix?: string;
}) => {
	const s3client = new S3(config) || new S3Client(config);
	try {
		const fileContent = fs.readFileSync(fsSourceFile);
		const metadataRecord: Record<string, string> = {};
		Object.entries(metadata).forEach(([key, value]) => {
			metadataRecord[key] = JSON.stringify(value);
		});

		const command = new PutObjectCommand({
			Body: fileContent,
			Bucket: bucket || r2BucketName,
			Key: prefix ? `${prefix}/${objectKey}` : objectKey,
			ContentType: metadata.contentType || "application/octet-stream",
			Metadata: metadataRecord,
		});

		const responseObject = await s3client.send(command);
	} catch (error) {
		console.error(error);
	}
};

export const uploadObjectList = async ({
	fileList,
	prefix,
	batchSize = 20,
}: {
	fileList: FileMapFs[];
	prefix?: string;
	batchSize?: number;
}) => {
	try {
		console.log(
			`\nThere are ${fileList.length} files to upload to ${r2BucketName}${prefix ? `/${prefix}/` : "/"}\n`
		);

		const fileListBatches = chunkArray(fileList, batchSize);
		let counter = 1;

		for (const fileListBatch of fileListBatches) {
			console.log(
				`\nUploading batch ${counter++}/${fileListBatches.length} with length of ${fileListBatch.length}\n`
			);

			await Promise.all(
				fileListBatch.map(async (file) => {
					console.log(`Uploading ${file.fsSourceFile} to ${r2BucketName}`);

					await uploadObject({
						objectKey: file.filename_objectKey,
						bucket: r2BucketName,
						metadata: file.metadata,
						fsSourceFile: file.fsSourceFile,
						prefix,
					});
				})
			);
		}

		function chunkArray(array: FileMapFs[], size: number): FileMapFs[][] {
			const result = [];
			for (let i = 0; i < array.length; i += size) {
				result.push(array.slice(i, i + size));
			}
			return result;
		}
	} catch (err) {
		console.error("Upload objects error: ", err);
	}
};
