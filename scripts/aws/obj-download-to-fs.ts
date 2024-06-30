import { GetObjectCommand, S3, S3Client, S3ClientConfig, _Object } from "@aws-sdk/client-s3";
import fs from "fs";

import path from "path";
import { Readable } from "stream"; // https://stackoverflow.com/a/67373050/6543935
import { getObject } from "../../lib/aws";
import { FileMapFs, FileMapUpload } from "./types";
import { chunkArray } from "./utils";

/**
 * @param fileName The name of the file incl. the relative path: tmp/prjId/subPath/file.name
 * @param localFsFilePath The absolute path to the file: /home/user/workDir/tmp/prjId/subPath/file.name
 */
export const downloadObject = async ({
	objectKey,
	bucket,
	prefix,
	config,
	fsFilePath,
}: {
	objectKey: string;
	bucket: string;
	prefix?: string;
	config: S3ClientConfig;
	fsFilePath: string;
}) => {
	const s3client = new S3(config) || new S3Client(config);

	try {
		const command = new GetObjectCommand({
			Bucket: bucket,
			Key: prefix ? `${prefix}/${objectKey}` : objectKey,
		});
		const responseObject = await s3client.send(command);

		const fsFilePathAndName = path.join(fsFilePath, objectKey);

		const writeStream = fs
			.createWriteStream(fsFilePathAndName)
			.on("error", (err) => console.error(err));
		const readStream = responseObject.Body as Readable;

		readStream.pipe(writeStream);
	} catch (error) {
		console.error(error);
	}
};

export const downloadObjectList = async ({
	fileList,
	batchSize = 5,
	prefix,
	bucket,
	config,
	downloadDirFs,
}: {
	fileList: (FileMapFs | _Object)[];
	prefix?: string;
	batchSize?: number;
	bucket: string;
	config: S3ClientConfig;
	downloadDirFs: string;
}) => {
	try {
		console.log(
			`\nThere are ${fileList.length} files to be downloaded from ${bucket}${prefix ? `/${prefix}/` : "/"}\n`
		);

		const returnArray: FileMapUpload[] = [];

		const isS3ObjectList = !Object.prototype.hasOwnProperty.call(fileList[0], "fsSourceFile");
		console.log("isS3ObjectList", isS3ObjectList);

		const fileListBatches = chunkArray(fileList, batchSize);
		let counter = 1;

		for (const fileListBatch of fileListBatches) {
			console.log(
				`\nDownloading batch ${counter++}/${fileListBatches.length} with length of ${fileListBatch.length}\n`
			);

			await Promise.all(
				fileListBatch.map(async (file) => {
					if (!file.Key) return null;

					const baseDir = process.cwd();
					const fsFilePathAndName = path.join(baseDir, downloadDirFs, prefix ?? "", file.Key);
					const fsFilePath = path.dirname(fsFilePathAndName);

					if (!fs.existsSync(fsFilePath)) {
						fs.mkdirSync(fsFilePath, { recursive: true });
					}

					// It is possible to have sub prefixes
					const [subPrefix, Key] = file.Key.includes("/")
						? file.Key.replace(/^(.*)\/(.*)$/, "$1%%$2").split("%%")
						: [null, file.Key];

					console.log(`Downloading ${Key} to ${fsFilePath}`);

					if (isS3ObjectList) {
						const fileData = await getObject({ objectKey: file.Key, partNumber: 1 });

						if (fileData) {
							returnArray.push({
								Key: file.Key,
								prefix: subPrefix ? `${prefix}/${subPrefix}` : prefix,
								fileData,
								fsSourceFile: fsFilePathAndName,
							});
						}
					}

					await downloadObject({
						objectKey: Key,
						bucket,
						prefix: subPrefix ? `${prefix}/${subPrefix}` : prefix,
						config,
						fsFilePath,
					});
				})
			);
		}

		return returnArray;
	} catch (err) {
		console.error("Upload objects error: ", err);

		return null;
	}
};
