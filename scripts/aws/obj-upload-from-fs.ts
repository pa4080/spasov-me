/* eslint-disable no-console */
import { PutObjectCommand, S3, S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";

import { type FileMetadata } from "../../interfaces/File";
import { type FileMapUpload } from "./types";
import { chunkArray } from "./utils";

import fs from "fs";

/**
 * @param objectKey The name of the fil
 * @param fsSourceFile The absolute path to the file: /home/user/workDir/tmp/prjId/subPath/file.name
 */
export const uploadObject = async ({
  objectKey,
  fsSourceFile,
  metadata,
  bucket,
  prefix,
  config,
}: {
  objectKey: string;
  fsSourceFile: string;
  metadata: FileMetadata;
  bucket: string;
  prefix?: string;
  config: S3ClientConfig;
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
      Bucket: bucket,
      Key: prefix ? `${prefix}/${objectKey}` : objectKey,
      ContentType: metadata.contentType || "application/octet-stream",
      Metadata: metadataRecord,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const responseObject = await s3client.send(command);
  } catch (error) {
    console.error(error);
  }
};

export const uploadObjectList = async ({
  fileList,
  batchSize = 10,
  prefix,
  bucket,
  config,
}: {
  fileList: FileMapUpload[]; //(FileMapFs | _Object)[];
  prefix?: string;
  batchSize?: number;
  bucket: string;
  config: S3ClientConfig;
}) => {
  try {
    console.log(
      `\nThere are ${fileList.length} files to be upload to ${bucket}${prefix ? `/${prefix}/` : "/"}\n`
    );

    const fileListBatches = chunkArray(fileList, batchSize);
    let counter = 1;

    for (const fileListBatch of fileListBatches) {
      console.log(
        `\nUploading batch ${counter++}/${fileListBatches.length} with length of ${fileListBatch.length}\n`
      );

      await Promise.all(
        fileListBatch.map(async (file) => {
          if (!file.Key) {
            return null;
          }

          console.log(`Uploading ${file.fsSourceFile} to ${bucket}`);

          await uploadObject({
            objectKey: file.Key,
            metadata: file?.metadata
              ? file.metadata
              : ((file.fileData?.Metadata ?? {}) as unknown as FileMetadata),
            fsSourceFile: file.fsSourceFile,
            bucket,
            prefix,
            config,
          });
        })
      );
    }
  } catch (err) {
    console.error("Upload objects error: ", err);
  }
};
