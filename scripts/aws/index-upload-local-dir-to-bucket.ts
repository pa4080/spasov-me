/**
 * Uploads a local directory to object storage (CloudflareR2 or MinIo bucket).
 *
 * From the root directory of the project:
 * > doppler run -- pnpm exec ts-node --skip-project scripts/upload-from-fs-to-r2/index.ts
 */
import { r2BucketIconsPath, r2BucketName, r2cfConfig } from "./config";
import generateFileMapRecursive from "./local-files-map";
import { uploadObjectList } from "./obj-upload-from-fs";

// Generate file map (list of the files to be uploaded)
const iconMap = generateFileMapRecursive({
	dir: "./public/assets/icons",
	date: new Date(),
	creatorId: "spas-z-spasov",
	locale: "en",
	filename_trim_prefix: "icons",
});

// Upload the files
uploadObjectList({
	fileList: iconMap,
	prefix: r2BucketIconsPath,
	bucket: r2BucketName,
	config: r2cfConfig,
	batchSize: 10,
});
