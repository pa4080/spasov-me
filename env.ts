/**
 * The ENV_VARS are managed via Vercel
 * > https://github.com/colinhacks/zod/issues/63
 */
import { z } from "zod";

const zStringReq = (msg?: string) =>
	z
		.string()
		.trim()
		.min(1, { message: msg ?? "Required!" });

const envSchema = z.object({
	GITHUB_ALLOWED_USER_SECRET: zStringReq(),
	GITHUB_CLIENT_ID: zStringReq(),
	GITHUB_CLIENT_SECRET: zStringReq(),

	GOOGLE_reCAPTCHA_SCORE_LIMIT: zStringReq(),
	GOOGLE_reCAPTCHA_URL: zStringReq(),
	GOOGLE_reCAPTCHA_V3e_SECRET_KEY: zStringReq(),

	MONGODB_DB_NAME: zStringReq(),
	MONGODB_FILES_BUCKET_NAME: zStringReq(),
	MONGODB_URI: zStringReq(),

	NEXTAUTH_SECRET: zStringReq(),
	NEXTAUTH_URL: zStringReq(),
	NEXTAUTH_URL_INTERNAL: zStringReq(),

	NEXT_PUBLIC_GOOGLE_reCAPTCHA_V3e_SITE_KEY: zStringReq(),
	NEXT_PUBLIC_ME_EMAIL: zStringReq(),
	NEXT_PUBLIC_ME_FIRST_NAME: zStringReq(),
	NEXT_PUBLIC_ME_FULL_NAME: zStringReq(),
	NEXT_PUBLIC_PROJECT_REPOSITORY: zStringReq(),
	NEXT_PUBLIC_SUPPORT_EMAIL: zStringReq(),

	BLOB_READ_WRITE_TOKEN: zStringReq(),
	EDGE_CONFIG: zStringReq(),
	REACT_EDITOR: zStringReq(),
	RESEND_API_KEY: zStringReq(),
	VERCEL_ENV: zStringReq(),
});

const {
	GITHUB_ALLOWED_USER_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,

	GOOGLE_reCAPTCHA_SCORE_LIMIT,
	GOOGLE_reCAPTCHA_URL,
	GOOGLE_reCAPTCHA_V3e_SECRET_KEY,

	MONGODB_DB_NAME,
	MONGODB_FILES_BUCKET_NAME,
	MONGODB_URI,

	NEXTAUTH_SECRET,
	NEXTAUTH_URL,
	NEXTAUTH_URL_INTERNAL,

	NEXT_PUBLIC_GOOGLE_reCAPTCHA_V3e_SITE_KEY,
	NEXT_PUBLIC_ME_EMAIL,
	NEXT_PUBLIC_ME_FIRST_NAME,
	NEXT_PUBLIC_ME_FULL_NAME,
	NEXT_PUBLIC_PROJECT_REPOSITORY,
	NEXT_PUBLIC_SUPPORT_EMAIL,

	BLOB_READ_WRITE_TOKEN,
	EDGE_CONFIG,
	REACT_EDITOR,
	RESEND_API_KEY,
	VERCEL_ENV,
} = process.env;

const parsedResults = envSchema.safeParse({
	GITHUB_ALLOWED_USER_SECRET,
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,

	GOOGLE_reCAPTCHA_SCORE_LIMIT,
	GOOGLE_reCAPTCHA_URL,
	GOOGLE_reCAPTCHA_V3e_SECRET_KEY,

	MONGODB_DB_NAME,
	MONGODB_FILES_BUCKET_NAME,
	MONGODB_URI,

	NEXTAUTH_SECRET,
	NEXTAUTH_URL,
	NEXTAUTH_URL_INTERNAL,

	NEXT_PUBLIC_GOOGLE_reCAPTCHA_V3e_SITE_KEY,
	NEXT_PUBLIC_ME_EMAIL,
	NEXT_PUBLIC_ME_FIRST_NAME,
	NEXT_PUBLIC_ME_FULL_NAME,
	NEXT_PUBLIC_PROJECT_REPOSITORY,
	NEXT_PUBLIC_SUPPORT_EMAIL,

	BLOB_READ_WRITE_TOKEN,
	EDGE_CONFIG,
	REACT_EDITOR,
	RESEND_API_KEY,
	VERCEL_ENV,
});

if (!parsedResults.success) {
	console.error(parsedResults.error);
	throw new Error("Invalid ENV_VARS");
}

export const env = parsedResults.data;

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}
