import * as z from "zod";

import { aboutEntryTuple, cityTuple, countryTuple } from "@/interfaces/_dataTypes";

export const Entry_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		title: z.string().min(4, {
			message: messages?.[0],
		}),
		description: z.string().min(10, {
			message: messages?.[1],
		}),
		country: z.enum(countryTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[2]) };
				}
			},
		}),
		city: z.enum(cityTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[3]) };
				}
			},
		}),
		dateFrom: z.coerce.date({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[4]) };
				}
			},
		}),
		dateTo: z.coerce
			.date({
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
						default:
							return { message: String(messages?.[5]) };
					}
				},
			})
			.optional(),
		entryType: z.enum(aboutEntryTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[6]) };
				}
			},
		}),
		visibility: z.boolean({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.[7]) };
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
							return { message: String(messages?.[8]) };
					}
				},
			})
			.optional(),
		tags: z.array(z.string()).refine((tags) => tags.length > 0, {
			message: String(messages?.[9]),
		}),
	});

export const Entry_FormSchema = Entry_FormSchemaGenerator();
export type Entry_FormSchema = z.infer<typeof Entry_FormSchema>;
