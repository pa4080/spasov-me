import * as z from "zod";

import { projectTuple } from "@/interfaces/_common-data-types";

export const Project_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		title: z.string().min(4, {
			message: messages?.[0],
		}),
		description: z.string().min(10, {
			message: messages?.[1],
		}),
		urlHome: z.string().optional(),
		urlRepo: z.string().optional(),
		projectType: z.enum(projectTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[2]) };
				}
			},
		}),
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
		attachment: z
			.string({
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
						default:
							return { message: String(messages?.[6]) };
					}
				},
			})
			.optional(),
		tags: z.array(z.string()).refine((tags) => tags.length > 0, {
			message: String(messages?.[7]),
		}),
		gallery: z.array(z.string(), {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[8]) };
				}
			},
		}),
	});

export const Project_FormSchema = Project_FormSchemaGenerator();
export type Project_FormSchema = z.infer<typeof Project_FormSchema>;
