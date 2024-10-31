import sizeOf from "image-size";
import mime from "mime-types";

import { getRatio } from "@/lib/get-ratio";

import { type FileMetadata } from "../../interfaces/File";
import { roundTo } from "../../lib/round";
import { type FileMapFs, type GenerateFileMapInput } from "./types";

import fs from "fs";
import path from "path";

const generateFileMap = ({
  dir,
  date,
  creatorId,
  locale = "en",
  filename_trim_prefix,
}: GenerateFileMapInput): FileMapFs[] => {
  const filename_trim_regexp = filename_trim_prefix
    ? new RegExp(`\\/.*\\/${filename_trim_prefix}\\/(.*$)`)
    : /\/.*\/(.*$)/;
  const directoryPath = path.join(process.cwd(), dir);

  const files = fs
    .readdirSync(directoryPath)
    .filter((file) => file.endsWith(".svg") || file.endsWith(".png") || file.endsWith(".webp"))
    .map((file) => {
      const stats = fs.statSync(path.join(directoryPath, file));
      const fileSizeInBytes = stats.size;

      const info = sizeOf(path.join(directoryPath, file)) as FileMetadata["info"];

      info.ratio = getRatio(info);

      const modifiedDate = date.toLocaleString(locale);
      const fileSizeKb = roundTo(fileSizeInBytes / 1000, 1);
      const description = `${modifiedDate} ~${fileSizeKb}Kb`;

      const filename_objectKey = path.join(directoryPath, file).replace(filename_trim_regexp, "$1");
      const fsSourceFile = path.join(directoryPath, file);
      const contentType = mime.lookup(fsSourceFile) || "application/octet-stream";

      return {
        fsSourceFile,
        Key: filename_objectKey,
        metadata: {
          description,
          contentType,
          creator: creatorId,
          size: fileSizeInBytes.toString(),
          info,
          lastModified: date,
          originalName: file,
          visibility: "true",
        },
      };
    });

  return files;
};

const generateFileMapRecursive = ({
  dir,
  date,
  creatorId,
  locale = "en",
  filename_trim_prefix,
}: GenerateFileMapInput): FileMapFs[] => {
  // eslint-disable-next-line no-console
  console.log(`\nGenerating file map for: ${dir}\n`);

  const iconsDirPath = path.join(process.cwd(), dir);

  const iconsDirContent = fs.readdirSync(iconsDirPath);
  const iconsSubDirs = iconsDirContent
    .filter((item) => fs.statSync(path.join(iconsDirPath, item)).isDirectory())
    .map((item) => path.join(dir, item));

  return [...iconsSubDirs, dir]
    .map((dir) => generateFileMap({ dir, date, creatorId, locale, filename_trim_prefix }))
    .flat();
};

export default generateFileMapRecursive;
