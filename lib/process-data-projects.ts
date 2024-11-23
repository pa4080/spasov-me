import { getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import { type ProjectType } from "@/interfaces/_common-data-types";
import {
  type NewProjectData,
  type ProjectData,
  type ProjectDocPopulated,
} from "@/interfaces/Project";

import { processMarkdown } from "./md/process-markdown";
import { tagDocuments_toData } from "./process-data-tags";

const files_prefix = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES ?? "files";
const icons_prefix = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS ?? "icons";

export async function projectDocuments_toData({
  projects,
  hyphen,
  typeList,
  visible,
}: {
  projects: ProjectDocPopulated[];
  hyphen?: boolean;
  typeList?: ProjectType[];
  visible?: boolean;
}): Promise<ProjectData[]> {
  let projectsFiltered = projects;

  if (visible) {
    projectsFiltered = projects.filter((entry) => entry.visibility);
  }

  const files = await getFilesR2({ prefix: files_prefix });
  const icons = await getFilesR2({ prefix: icons_prefix });

  return projectsFiltered
    .filter(({ entryType }) => typeList?.includes(entryType) ?? true)
    .map((project) => ({
      _id: project._id.toString(),
      html: {
        // This cannot be done in the client side
        title: processMarkdown({
          markdown: project.title,
          hyphen,
        }),
        description: processMarkdown({
          markdown: project.description,
          hyphen,
        }),
        attachment: files?.find((file) => file?._id === project?.attachment),
        icon:
          files?.find((file) => file?._id === project?.icon) ??
          icons?.find((icon) => icon?._id === project?.icon),
      },
      title: project.title,
      description: project.description,
      slug: project.slug,
      urlHome: project.urlHome,
      urlAdmin: project.urlAdmin,
      urlRepo: project.urlRepo,
      dateFrom: project.dateFrom as Date,
      dateTo: project.dateTo as Date | undefined,
      entryType: project.entryType,
      visibility: project.visibility as boolean,
      icon: project.icon,
      attachment: project.attachment,
      tags: tagDocuments_toData({ tags: project.tags || [], hyphen: true }),
      gallery: files?.filter((file) => project?.gallery?.includes(file._id)),
      modelType: "Project",
    }));
}

export function projectFormData_toNewProjectData({
  data,
  user_id,
}: {
  data: FormData;
  user_id: string;
}): NewProjectData {
  return {
    title: data.get("title") as string,
    description: data.get("description") as string,
    slug: data.get("slug") as string,
    urlHome: data.get("urlHome") as string,
    urlAdmin: data.get("urlAdmin") as string,
    urlRepo: data.get("urlRepo") as string,
    entryType: data.get("entryType") as ProjectType,
    dateFrom: data.get("dateFrom") as string,
    dateTo: data.get("dateTo") as string,
    visibility: data.get("visibility") as string,
    attachment: data.get("attachment") as string,
    icon: data.get("icon") as string,

    tags: JSON.parse(data.get("tags") as string) as string[],
    gallery: JSON.parse(data.get("gallery") as string) as string[],

    creator: user_id,
  };
}
