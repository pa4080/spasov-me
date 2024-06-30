import fs from "fs";
import mime from "mime-types";
import path from "path";
import { FileMetadata } from "../../interfaces/File";
import { roundTo } from "../../lib/round";

interface GenerateFileMapInput {
	dir: string;
	date: Date;
	creatorId: string;
	locale?: string;
	filename_trim_prefix?: string;
}

export interface FileMapFs {
	fsSourceFile: string;
	filename_objectKey: string;
	metadata: FileMetadata;
}

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

			const modifiedDate = date.toLocaleString(locale);
			const fileSizeKb = roundTo(fileSizeInBytes / 1000, 1);
			const description = `${modifiedDate} ~${fileSizeKb}Kb`;

			const filename_objectKey = path.join(directoryPath, file).replace(filename_trim_regexp, "$1");
			const fsSourceFile = path.join(directoryPath, file);
			const contentType = mime.lookup(fsSourceFile) || "application/octet-stream";

			return {
				fsSourceFile,
				filename_objectKey,
				metadata: {
					description,
					contentType,
					creator: creatorId,
					size: fileSizeInBytes.toString(),
					lastModified: date,
					originalName: file,
					visibility: true,
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
