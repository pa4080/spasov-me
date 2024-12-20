import { type _Object } from "@aws-sdk/client-s3";

import { type FileData } from "@/interfaces/File";
import { type AttachedToDocument } from "@/interfaces/_common-data-types";

import { getObject } from "./aws";
import { processMarkdown } from "./md/process-markdown";

const r2BucketDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DOMAIN;

/**
 * Notes:
 *
 * 1) We cannot use GetObjectAttributesCommand,
 *    because CloudFlare R2 returns not implemented...
 *    So this is the reason we are using the most expensive
 *    GetObjectCommand @getObject(), which returns also the
 *    object itself.
 *
 * 2) _id is the filename without extension, and
 *    it will be used when the file is modified, or deleted,
 *    so please do not add or replace characters inside.
 */
export async function fileObject_toData({
  files,
  hyphen = true,
  visible,
  prefix = "",
}: {
  files: _Object[];
  hyphen?: boolean;
  visible?: boolean;
  prefix?: string;
}): Promise<FileData[]> {
  const filesAcc: FileData[] = [];

  await Promise.all(
    files.map(async (file_raw) => {
      const objectKey = file_raw.Key!;
      const file = await getObject({ objectKey, partNumber: 1 });

      if (!file) {
        return;
      }

      const uploadDate = file.LastModified ?? new Date();
      const length = file.ContentLength ?? 0;
      const description = getMetadataValue(file.Metadata, "description", "");

      // Replace: 1) remove the path (i.e: files/); 2) remove the extension (i.e: .webp)
      const filename = objectKey.replace(/^.*?\//g, "");
      const _id = "Id:" + filename.replace(/\.[^.]*$/, "");

      const f: FileData = {
        _id,
        filename,
        uploadDate,
        length,
        objectKey,
        metadata: {
          description: description,
          size: getMetadataValue(file?.Metadata, "size", ""),
          info: getMetadataValue(file?.Metadata, "info", "") || {
            height: 0,
            width: 0,
            type: "not-provided",
            ratio: 0,
          },
          contentType: getMetadataValue(file?.Metadata, "contenttype", ""),
          lastModified: getMetadataValue(file?.Metadata, "lastmodified", new Date()),
          originalName: getMetadataValue(file?.Metadata, "originalname", ""),
          attachedTo: file.Metadata?.attachedto
            ? (JSON.parse(file?.Metadata?.attachedto) as AttachedToDocument[])
            : [],
          visibility: Boolean(getMetadataValue(file.Metadata, "visibility", "")) === true,
          html: {
            filename: filename,
            title: processMarkdown({ markdown: filename, hyphen: true }),
            description: processMarkdown({ markdown: description, hyphen }),
            fileUrl: `https://${r2BucketDomain}${prefix ? "/" + prefix : ""}/${filename}?v=${new Date(uploadDate).getTime()}`,
          },
        },
      };

      filesAcc.push(f);
    })
  );

  return visible ? filesAcc.filter((file) => file.metadata?.visibility === true) : filesAcc;
}

/**
 * Helper function to get the metadata value
 */
export const getMetadataValue = <T>(
  metadata: Record<string, string> | undefined,
  key: string,
  defaultValue: T
) => {
  return metadata?.[key] ? (JSON.parse(metadata?.[key]) as T) : defaultValue;
};
