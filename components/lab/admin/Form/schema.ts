import * as z from "zod";

import {
	labEntryHostTuple,
	labEntryPropertyTuple,
	labEntryTuple,
	labEntryVisibilityTuple,
} from "@/interfaces/_common-data-types";

export const LabEntry_FormSchemaGenerator = (messages?: string[]) =>
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
		entryType: z.enum(labEntryTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[2]) };
				}
			},
		}),

		visibilityType: z.enum(labEntryVisibilityTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[10]) };
				}
			},
		}),
		propertyType: z.enum(labEntryPropertyTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[11]) };
				}
			},
		}),
		hostType: z.enum(labEntryHostTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[12]) };
				}
			},
		}),

		urlHome: z.string().optional(),
		urlAdmin: z.string().optional(),
		urlSource: z.string().optional(),

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

export const LabEntry_FormSchema = LabEntry_FormSchemaGenerator();
export type LabEntry_FormSchema = z.infer<typeof LabEntry_FormSchema>;
