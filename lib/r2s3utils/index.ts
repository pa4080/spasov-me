import { S3ClientConfig } from "@aws-sdk/client-s3";

import { env } from "@/env";

export const config: S3ClientConfig = {
	credentials: {
		accessKeyId: env.CLOUDFLARE_API_ACCESS_KEY_ID,
		secretAccessKey: process.env.CLOUDFLARE_API_ACCESS_KEY_SECRET!,
	},
	region: process.env.CLOUDFLARE_R2_BUCKET_REGION!,
	endpoint: process.env.CLOUDFLARE_API_ENDPOINT!,
};

// https://community.cloudflare.com/t/aws-sdk-v3-hangs-after-50-getobject-requests/476149
// export const s3client = new S3(config) || new S3Client(config);

export * from "./obj-delete";
export * from "./obj-get";
export * from "./obj-list";
export * from "./obj-update";
export * from "./obj-upload";
