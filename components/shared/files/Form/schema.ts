import * as z from "zod";

import { regexFilesAll } from "@/interfaces/_common-data-types";

// https://github.com/colinhacks/zod#nullable
// Here is applied a tricky solution to translate the messages,
// outside React component on the client side...?
export const File_FormSchemaGenerator = (messages?: string[], isFileOptional = false) =>
  z.object({
    file: isFileOptional
      ? z.any().optional()
      : z.union([
          // z.instanceof(FileList, { message: messages?.shift() }), // This throws an error in the server's log
          // @see https://conform.guide/file-upload
          // @see https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673 // This is the solution
          z.any().refine((files) => Array.isArray(files) && files.length === 1, messages?.[0]),
          z.instanceof(File, {
            message: messages?.[1],
          }),
        ]),
    filename: z
      .string()
      .regex(/^[a-zA-Z0-9][\/.a-zA-Z0-9-_]+$/, {
        message: messages?.[2],
      })
      .regex(regexFilesAll, {
        message: messages?.[3],
      }),
    description: z.string().optional(),
    /**
     * Optional file with check
     * @see https://stackoverflow.com/a/74028632/6543935
     *
     * image: z.union([
     * 			z.string().regex(regexFilesAll, {
     * 				message: messages?.shift(),
     * 			}),
     * 			z.string().length(0),
     * 		])
     * 		.optional()
     * 		.transform((e) => (e === "" ? undefined : e)),
     */
    attachedTo: z
      .array(
        z.object({
          modelType: z.string(),
          title: z.string(),
          _id: z.string(),
        })
      )
      .optional(),
    visibility: z.boolean().optional(),
  });

export const File_FormSchema = File_FormSchemaGenerator();
export type File_FormSchema = z.infer<typeof File_FormSchema>;
