/**
 * From the root directory of the project:
 * > doppler run -- pnpm exec ts-node --skip-project scripts/upload-from-fs-to-r2/index.ts
 */
import generateFileMapRecursive from "./local-files-map";
import { uploadObjectList } from "./obj-upload";

const r2BucketIconsPath = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS!;

const iconMap = generateFileMapRecursive({
	dir: "./public/assets/icons",
	date: new Date(),
	creatorId: "spas-z-spasov",
	locale: "en",
	filename_trim_prefix: "icons",
});

uploadObjectList({ fileList: iconMap, prefix: r2BucketIconsPath });
