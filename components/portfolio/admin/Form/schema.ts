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
    urlAdmin: z.string().optional(),
    urlRepo: z.string().optional(),
    entryType: z.enum(projectTuple, {
      error: (issue) => String(messages?.[2]),
    }),
    dateFrom: z.coerce.date({
      error: (issue) => String(messages?.[3]),
    }),
    dateTo: z.coerce
      .date({
        error: (issue) => String(messages?.[4]),
      })
      .optional(),
    visibility: z.boolean({
      error: (issue) => String(messages?.[5]),
    }),
    highlighted: z.boolean({
      error: (issue) => String(messages?.[6]),
    }),
    // This will be an Image (GridFS document) Id as a string
    attachment: z.string().optional(),
    icon: z.string().optional(),
    tags: z.array(z.string()).refine((tags) => tags.length > 0, {
      message: String(messages?.[7]),
    }),
    gallery: z.array(z.string(), {
      error: (issue) => String(messages?.[8]),
    }),
    slug: z
      .string()
      .min(4, {
        message: messages?.[9],
      })
      .regex(/^[a-z][a-z0-9-]+$/, {
        message: messages?.[10],
      }),
  });

export const Project_FormSchema = Project_FormSchemaGenerator();
export type Project_FormSchema = z.infer<typeof Project_FormSchema>;
