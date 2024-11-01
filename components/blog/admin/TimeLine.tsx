import React from "react";

import CreateFile from "@/components/files-cloudflare/admin/Actions/CreateFile";
import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type PostData } from "@/interfaces/Post";
import { type TagData } from "@/interfaces/Tag";
import { type PostType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import CreatePost from "./Actions/Create";
import PostAdminCard from "./Card";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";

interface Props {
  className?: string;
  type?: PostType;
  visibleItems?: number;
  posts: PostData[] | null;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({
  className,
  type = "blog",
  visibleItems = 3,
  posts,
  fileList,
  iconList,
  iconsMap,
  tags,
}) => {
  const t = msgs("Posts");

  type tType = Parameters<typeof t>[0];

  const section_title = t(`title_${type}` as tType);
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

  // Filter the items by their type - i.e. ["informationTechnologies", "education", ...]
  const postsByType = posts
    ?.filter(({ entryType }) => entryType === type)
    .sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

  return (
    <div
      className={cn("portfolio-admin-section list-section scroll-mt-24 3xl:scroll-mt-8", className)}
    >
      <SectionHeader title={section_title}>
        <CreateFile files_prefix={files_prefix} />
        <RevalidatePaths paths={[Route.public.PORTFOLIO.uri]} />
        <CreatePost
          fileList={fileList}
          iconList={iconList}
          iconsMap={iconsMap}
          tags={tags}
          type={type}
        />
        <ToggleCollapsible
          tooltip
          target_id={toggle_target_id}
          text={[t("btnAll"), t("btnLess")]}
          type="section"
        />
      </SectionHeader>
      <div className="space-y-10">
        {postsByType?.map((project, index) => (
          <PostAdminCard
            key={index}
            className={visibleItems > index ? "" : "section-card-collapsible"}
            fileList={fileList}
            iconList={iconList}
            iconsMap={iconsMap}
            post={project}
            tags={tags}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
