"use client";

import DisplayConditionally from "@/components/fragments/DisplayConditionally";
import DisplayResourceUrlAsIcon from "@/components/fragments/DisplayResourceUrlAsIcon";
import Gallery from "@/components/fragments/Gallery";
import TooltipWrapper from "@/components/fragments/TooltipWrapper";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import UpdateProject from "../admin/Actions/Update";

interface Props {
  project: ProjectData;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;

  className?: string;
}

const ProjectLinks: React.FC<Props> = ({
  project,
  fileList,
  iconList,
  iconsMap,
  tags,
  className,
}) => {
  const t = msgs("Projects_CardPublic");

  let gallery = project?.gallery
    ?.map((file) => file.metadata.html)
    ?.sort((a, b) => a.filename.localeCompare(b.filename));

  gallery =
    project?.html?.attachment && gallery
      ? [project?.html?.attachment.metadata.html].concat(gallery)
      : gallery;

  const iconWrapper =
    "fill-foreground-tertiary hover:fill-accent flex items-center justify-center h-full if-empty-display-none";

  return (
    <div
      className={cn(
        "pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7",
        className
      )}
    >
      <div className={iconWrapper}>
        <DisplayResourceUrlAsIcon
          iconType="globe-pointer"
          isClickable={!!project.urlHome}
          label={t("tooltip_link", { linkType: "Homepage" })}
          url={project.urlHome}
        />
      </div>

      <DisplayConditionally>
        <div className={iconWrapper}>
          <DisplayResourceUrlAsIcon
            className="-ml-1 -mr-0.5"
            iconType="user-shield"
            isClickable={!!project.urlAdmin}
            label={t("tooltip_link", { linkType: "Admin panel" })}
            url={project.urlAdmin}
            width={34}
          />
        </div>
      </DisplayConditionally>

      <div className={iconWrapper}>
        <DisplayResourceUrlAsIcon
          iconType="box-circle-check"
          isClickable={!!project.urlRepo}
          label={t("tooltip_link", { linkType: "Repository" })}
          url={project.urlRepo}
          width={30}
        />
      </div>

      <div className={iconWrapper}>
        <TooltipWrapper
          className="w-full h-full flex items-center fill-inherit"
          tooltipText={t("tooltip_gallery")}
        >
          <Gallery entry={project} gallery={gallery} />
        </TooltipWrapper>
      </div>

      <div className={iconWrapper}>
        <TooltipWrapper
          className="w-full h-full flex items-center fill-inherit -ml-0.5"
          tooltipText={t("tooltip_update")}
        >
          <UpdateProject
            fileList={fileList}
            iconList={iconList}
            iconsMap={iconsMap}
            project={project}
            tags={tags}
          />
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default ProjectLinks;
