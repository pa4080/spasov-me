import {
  type AboutEntryData,
  type AboutEntryDocPopulated,
  type NewAboutEntryData,
} from "@/interfaces/AboutEntry";
import {
  type AboutEntryType,
  type CityType,
  type CountryType,
} from "@/interfaces/_common-data-types";
import { getFilesR2 } from "@/components/files-cloudflare/_files.actions";

import { processMarkdown } from "./md/process-markdown";
import { tagDocuments_toData } from "./process-data-tags";

export async function aboutEntryDocuments_toData({
  entries,
  hyphen,
  typeList,
  visible,
}: {
  entries: AboutEntryDocPopulated[];
  hyphen?: boolean;
  typeList?: AboutEntryType[];
  visible?: boolean;
}): Promise<AboutEntryData[]> {
  let entriesFiltered = entries;

  if (visible) {
    entriesFiltered = entries.filter((entry) => entry.visibility);
  }

  const files = await getFilesR2();

  return entriesFiltered
    .filter(({ entryType }) => typeList?.includes(entryType) ?? true)
    .map((entry) => ({
      _id: entry._id.toString(),
      html: {
        // This cannot be done in the client side
        title: processMarkdown({
          markdown: entry.title,
          hyphen,
        }),
        description: processMarkdown({
          markdown: entry.description,
          hyphen,
        }),
        attachment: files?.find((file) => file._id === entry?.attachment),
      },
      title: entry.title,
      description: entry.description,
      country: entry.country,
      city: entry.city,
      dateFrom: entry.dateFrom as Date,
      dateTo: entry.dateTo as Date | undefined,
      entryType: entry.entryType,
      visibility: entry.visibility as boolean,
      attachment: entry.attachment,
      tags: tagDocuments_toData({ tags: entry.tags || [], hyphen: true }),
      gallery: files?.filter((file) => entry?.gallery?.includes(file._id)),
      modelType: "AboutEntry",
    }));
}

export function aboutEntryFormData_toNewEntryData({
  data,
  user_id,
}: {
  data: FormData;
  user_id: string;
}): NewAboutEntryData {
  return {
    title: data.get("title") as string,
    description: data.get("description") as string,
    country: data.get("country") as CountryType,
    city: data.get("city") as CityType,
    entryType: data.get("entryType") as AboutEntryType,
    dateFrom: data.get("dateFrom") as string,
    dateTo: data.get("dateTo") as string,
    visibility: data.get("visibility") as string,
    attachment: data.get("attachment") as string,

    tags: JSON.parse(data.get("tags") as string) as string[],
    gallery: JSON.parse(data.get("gallery") as string) as string[],

    creator: user_id,
  };
}
