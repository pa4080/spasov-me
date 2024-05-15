import * as z from "zod";

export const Pages_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		title: z.string().min(2, {
			message: messages?.[0],
		}),
		description: z.string().min(2, {
			message: messages?.[1],
		}),
		uri: z
			.string()
			.min(2, {
				message: messages?.[2],
			})
			.toLowerCase()
			.regex(/^[a-z][a-z0-9-]+$/)
			.trim(),
		attachment: z.string().optional(),
		icon: z.string().optional(),
		visibility: z.boolean(),
	});

export const Pages_FormSchema = Pages_FormSchemaGenerator();
export type Pages_FormSchema = z.infer<typeof Pages_FormSchema>;
