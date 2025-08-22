import React from "react";

import SectionHeader from "@/components/shared/SectionHeader";
import ToggleCollapsible from "@/components/shared/ToggleCollapsible";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { type AboutEntryType } from "@/interfaces/_common-data-types";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import AboutEntryCard from "../common/Card";

interface Props {
  className?: string;
  type: AboutEntryType;
  visibleItems?: number;
  entries: AboutEntryData[] | null;
  displayTags: boolean;
  fileList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({
  className,
  type,
  visibleItems = 3,
  entries,
  displayTags,
  fileList,
  iconsMap,
  tags,
}) => {
  const t = msgs("AboutEntries");

  type tType = Parameters<typeof t>[0];

  const section_title = t(`title_${type}` as tType);
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

  const entriesByType = entries
    ?.filter(({ entryType }) => entryType === type)
    .sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

  return (
    <div className={className} id={toggle_target_id}>
      <SectionHeader className="pop-header" title={section_title}>
        <ToggleCollapsible
          target_id={toggle_target_id}
          text={[t("btnAll"), t("btnLess")]}
          type="section"
        />
      </SectionHeader>
      <div className="about-cards-section-items space-y-14">
        {entriesByType?.map((entry, index) => (
          <AboutEntryCard
            key={index}
            className={visibleItems > index ? "pop-item" : "section-card-collapsible pop-item"}
            displayTagsInline={displayTags}
            entry={entry}
            fileList={fileList}
            iconsMap={iconsMap}
            tags={tags}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
