import * as z from "zod";

import { entryTuple } from "@/interfaces/_dataTypes";

export const Entry_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		title: z.string().min(6, {
			message: messages?.shift(),
		}),
		description: z.string().min(20, {
			message: messages?.shift(),
		}),
		country: z.string().min(2, {
			message: messages?.shift(),
		}),
		city: z.string().min(2, {
			message: messages?.shift(),
		}),
		dateFrom: z.coerce.date({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.shift()) };
				}
			},
		}),
		dateTo: z.coerce.date({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.shift()) };
				}
			},
		}),
		type: z.enum(entryTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.shift()) };
				}
			},
		}),
		visibility: z.boolean({
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.shift()) };
				}
			},
		}),
	});

export const Entry_FormSchema = Entry_FormSchemaGenerator();
export type Entry_FormSchema = z.infer<typeof Entry_FormSchema>;
