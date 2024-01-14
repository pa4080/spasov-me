import * as z from "zod";

// https://github.com/colinhacks/zod#nullable
// Here is applied a tricky solution to translate the messages,
// outside React  component on the client side...?
export const FormSchemaGenerator = (messages?: string[], isFileOptional = false) =>
	z.object({
		file: isFileOptional
			? z.any().optional()
			: z.union([
					// z.instanceof(FileList, { message: messages?.shift() }), // This throws an error in the server's log
					// @see https://conform.guide/file-upload
					// @see https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673 // This is the solution
					z.any().refine((files) => files?.length === 1, messages?.shift()),
					z.instanceof(File, {
						message: messages?.shift(),
					}),
				]),
		filename: z
			.string()
			.regex(/^[a-zA-Z0-9][.a-zA-Z0-9-_]+$/, {
				message: messages?.shift(),
			})
			.regex(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx|gif)$/, {
				message: messages?.shift(),
			}),
		description: z.string().optional(),
		/**
		 * Optional file with check
		 * @see https://stackoverflow.com/a/74028632/6543935
		 *
		 * image: z.union([
		 * 			z.string().regex(/\.(png|jpg|jpeg|svg|webp)$/, {
		 * 				message: messages?.shift(),
		 * 			}),
		 * 			z.string().length(0),
		 * 		])
		 * 		.optional()
		 * 		.transform((e) => (e === "" ? undefined : e)),
		 */
	});

export const Files_FormSchema = FormSchemaGenerator();
export type Files_FormSchema = z.infer<typeof Files_FormSchema>;
