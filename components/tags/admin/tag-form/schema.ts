import * as z from "zod";

import { tagTuple } from "@/interfaces/_common-data-types";

export const Tag_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		name: z
			.string()
			.min(2, {
				message: messages?.[0],
			})
			.regex(/^[a-z0-9-]+$/, {
				message: messages?.[1],
			}),
		description: z.string().min(6, {
			message: messages?.[2],
		}),
		icon: z.string({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[3]) };
				}
			},
		}),
		orderKey: z.string({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[3]) };
				}
			},
		}),
		tagType: z.enum(tagTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[4]) };
				}
			},
		}),
		attachedTo: z
			.array(
				z.object({
					type: z.string(),
					title: z.string(),
					_id: z.string(),
				})
			)
			.optional(),
	});

export const Tag_FormSchema = Tag_FormSchemaGenerator();
export type Tag_FormSchema = z.infer<typeof Tag_FormSchema>;
