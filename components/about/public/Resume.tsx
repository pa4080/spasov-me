import SectionHeader from "@/components/shared/SectionHeader";
import ToggleCollapsible from "@/components/shared/ToggleCollapsible";
import { type AboutEntryData } from "@/interfaces/AboutEntry";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { type AboutEntryType } from "@/interfaces/_common-data-types";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import cardStyles from "app/_styles/card-info.module.css";

import UpdateAboutEntry from "../admin/Actions/Update";

interface Props {
  entries: AboutEntryData[] | null;
  className?: string;
  type: AboutEntryType;
  fileList: FileListItem[] | null;
  tags: TagData[] | null;
  iconsMap: IconsMap;
}

const Resume: React.FC<Props> = ({ entries, className, type, fileList, tags, iconsMap }) => {
  const t = msgs("AboutEntries");

  type tType = Parameters<typeof t>[0];

  const section_title = t(`title_${type}` as tType);
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

  const entry =
    entries
      ?.filter(({ entryType }) => entryType === type)
      ?.find(({ dateTo, visibility }) => dateTo === undefined && visibility) ?? null;

  const descriptionArr = entry?.html.description.split(splitDescriptionKeyword).map((str) => {
    return str.replace(commentsMatcher, "");
  });

  return (
    entry &&
    descriptionArr && (
      <div className={className} id={toggle_target_id}>
        <SectionHeader className="pop-header" title={section_title}>
          <UpdateAboutEntry entry={entry} fileList={fileList} iconsMap={iconsMap} tags={tags} />
          <ToggleCollapsible
            target_id={toggle_target_id}
            text={[t("btnMore"), t("btnLess")]}
            type="section"
          />
        </SectionHeader>

        <div className={`section_resume-public-text ${cardStyles.card}`}>
          <div className={`${cardStyles.description} md-processed-to-html`}>
            <div className="prose max-w-none">
              {descriptionArr.map((description, index) => (
                <div
                  dangerouslySetInnerHTML={{ __html: description }}
                  key={index}
                  className={index === 0 ? "section-card-static" : "mt-4 section-card-collapsible"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Resume;
