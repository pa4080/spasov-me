/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import { notFound } from "next/navigation";
import React from "react";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getProjects } from "@/components/portfolio/_portfolio.actions";
import PortfolioPublicProject from "@/components/portfolio/public/Project";
import { getTags } from "@/components/tags/_tags.actions";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const projects = await getProjects({
    hyphen: false,
    public: true,
  });

  return projects?.map((p) => ({ slug: [p.slug] })) ?? [];
}

const Project: React.FC<Props> = async ({ params }) => {
  const slug = (await params).slug;

  // Handle the rest of the cases /[...slug]/b/c...
  if (!(slug.length === 1)) {
    notFound();
  }

  const projectId_Slug = slug[0];

  const data: {
    projectsHyphenated?: ProjectData[] | null;
    fileList: FileListItem[] | null;
    iconList: FileListItem[] | null;
    tags: TagData[] | null;
    iconsMap: IconsMap;
  } = await Promise.all([
    getProjects({ hyphen: true, public: true }),
    getFileList({ prefix: files_prefix }),
    getFileList({ prefix: icons_prefix }),
    getTags(),
    getIconsMap(),
  ]).then(([projectsHyphenated, fileList, iconList, tags, iconsMap]) => ({
    projectsHyphenated,
    fileList,
    iconList,
    tags,
    iconsMap,
  }));

  const project = data.projectsHyphenated?.find(
    (project) => project._id === projectId_Slug || project.slug === projectId_Slug
  );

  if (!project) {
    notFound();
  }

  delete data.projectsHyphenated;

  return (
    <div className="mt-2 sa:mt-6 mb-24 scroll-mt-40">
      <PortfolioPublicProject project={project} {...data} />
    </div>
  );
};

export default Project;
