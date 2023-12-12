import * as z from "zod";

import { aboutEntryTuple, cityTuple, countryTuple } from "@/interfaces/_dataTypes";
import { msgs } from "@/messages";

const t = msgs("AboutCV_Form");

export const Entry_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		title: z.string().min(6, {
			message: messages?.shift(),
		}),
		description: z.string().min(20, {
			message: messages?.shift(),
		}),
		country: z.enum(countryTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.shift()) };
				}
			},
		}),
		city: z.enum(cityTuple, {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					default:
						return { message: String(messages?.shift()) };
				}
			},
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
		dateTo: z.coerce
			.date({
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				errorMap: (issue, _ctx) => {
					switch (issue.code) {
						default:
							return { message: String(messages?.shift()) };
					}
				},
			})
			.optional(),
		entryType: z.enum(aboutEntryTuple, {
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
		// This will be an Image (GridFS document) Id as a string
		attachment: z.string().optional(),
	});

export const Entry_FormSchema = Entry_FormSchemaGenerator();
export type Entry_FormSchema = z.infer<typeof Entry_FormSchema>;

export const FormSchema = Entry_FormSchemaGenerator([
	t("schema_title"),
	t("schema_description"),
	t("schema_country"),
	t("schema_city"),
	t("schema_date"),
	t("schema_date"),
	t("schema_type"),
	t("schema_visibility"),
]);
