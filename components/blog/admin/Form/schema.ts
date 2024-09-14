import * as z from "zod";

import { postTuple } from "@/interfaces/_common-data-types";

export const Post_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		title: z.string().min(4, {
			message: messages?.[0],
		}),
		description: z.string().min(10, {
			message: messages?.[1],
		}),
		slug: z
			.string()
			.min(4, {
				message: messages?.[8],
			})
			.regex(/^[a-z][a-z0-9-]+$/, {
				message: messages?.[9],
			}),
		entryType: z.enum(postTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[2]) };
				}
			},
		}),
		url1: z.string().optional(),
		url2: z.string().optional(),
		dateFrom: z.coerce.date({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[3]) };
				}
			},
		}),
		dateTo: z.coerce
			.date({
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
						default:
							return { message: String(messages?.[4]) };
					}
				},
			})
			.optional(),
		galleryNav: z.boolean({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[10]) };
				}
			},
		}),
		galleryCaptions: z.boolean({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[11]) };
				}
			},
		}),
		visibility: z.boolean({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[5]) };
				}
			},
		}),
		// This will be an Image (GridFS document) Id as a string
		attachment: z.string().optional(),
		icon: z.string().optional(),
		gallery: z.array(z.string(), {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[7]) };
				}
			},
		}),
		tags: z.array(z.string()).refine((tags) => tags.length > 0, {
			message: String(messages?.[6]),
		}),
	});

export const Post_FormSchema = Post_FormSchemaGenerator();
export type Post_FormSchema = z.infer<typeof Post_FormSchema>;
