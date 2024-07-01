import { S3ClientConfig } from "@aws-sdk/client-s3";

export const r2BucketFilesPath = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES!;
export const r2BucketIconsPath = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS!;
export const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

export const r2cfConfig: S3ClientConfig = {
	credentials: {
		accessKeyId: process.env.CLOUDFLARE_API_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_API_ACCESS_KEY_SECRET!,
	},
	endpoint: process.env.CLOUDFLARE_API_ENDPOINT!,
	region: process.env.CLOUDFLARE_R2_BUCKET_REGION!,
};

export const minIoConfig: S3ClientConfig = {
	credentials: {
		accessKeyId: process.env.MINIO_API_ACCESS_KEY_ID!,
		secretAccessKey: process.env.MINIO_API_ACCESS_KEY_SECRET!,
	},
	endpoint: process.env.MINIO_API_ENDPOINT!,
	region: process.env.MINIO_BUCKET_REGION!,
	forcePathStyle: true,
	// https://github.com/astaxie/cookbook/blob/master/docs/aws-sdk-for-javascript-with-minio.md
};

export const config: S3ClientConfig = true ? r2cfConfig : minIoConfig;
