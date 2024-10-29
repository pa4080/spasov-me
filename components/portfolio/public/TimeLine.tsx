import React from "react";

import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import LabEntriesPublic_EmbedList from "@/components/laboratory/public/TimeLine_EmbedIn_LabEntriesPublic";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type ProjectData } from "@/interfaces/Project";
import { type TagData } from "@/interfaces/Tag";
import { type ProjectType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import ProjectPublic_Card from "./Card";

interface Props {
  className?: string;
  projectType?: ProjectType;
  projects: ProjectData[] | null;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
  visibleItems?: number;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"...
 *
 * We won't filter the projects by type because we want to show all projects,
 * ordered by date... probably we need may indicate the type by a icon?(!?)
 */
const TimeLine: React.FC<Props> = ({
  className,
  projects,
  fileList,
  iconList,
  iconsMap,
  tags,
  visibleItems = 2,
}) => {
  const projectsByType = projects?.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

  const t = msgs("Projects");
  const section_title = t("title_common");
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_projects_portfolio_page`);

  return (
    <>
      <div
        className={cn("scroll-mt-24 list-section expand-collapsed", className)}
        id={toggle_target_id}
      >
        <SectionHeader className="pop-header" title={section_title}>
          <ToggleCollapsible
            invertButton
            target_id={toggle_target_id}
            text={[t("btnAll"), t("btnLess")]}
            type="section"
          />
        </SectionHeader>

        <div className="about-cards-section-items grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
          {projectsByType?.map((project, index) => (
            <ProjectPublic_Card
              key={index}
              className={`${visibleItems > index ? "pop-item" : "section-card-collapsible pop-item"} ${/spasov-me-cms/.exec(project.slug) ? "special-card" : ""}`.trim()}
              fileList={fileList}
              iconList={iconList}
              iconsMap={iconsMap}
              project={project}
              tags={tags}
            />
          ))}
        </div>
      </div>
      <LabEntriesPublic_EmbedList visibleItems={visibleItems} />
    </>
  );
};

export default TimeLine;
