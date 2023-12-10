import * as z from "zod";

export const Pages_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		title: z.string().min(2, {
			message: messages?.shift(),
		}),
		description: z.string().min(2, {
			message: messages?.shift(),
		}),
		uri: z
			.string()
			.min(2, {
				message: messages?.shift(),
			})
			.toLowerCase()
			.regex(/^[a-z][a-z0-9-]+$/)
			.trim(),
		image: z.string().optional(),
		visibility: z.boolean(),
	});

export const Pages_FormSchema = Pages_FormSchemaGenerator();
export type Pages_FormSchema = z.infer<typeof Pages_FormSchema>;
