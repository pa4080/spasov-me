import React from "react";

import RevalidatePaths from "@/components/shared/RevalidatePaths";
import SectionHeader from "@/components/shared/SectionHeader";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type PageCardData } from "@/interfaces/PageCard";
import { hyphenateString } from "@/lib/process-text";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import styles from "../_pages.module.css";
import CreatePage from "./Actions/CreatePage";
import PageCard from "./Card";

interface Props {
  className?: string;
  pages: PageCardData[] | null;
  type?: "common";
  fileList: FileListItem[] | null;
  iconsMap: IconsMap;
}

const Section: React.FC<Props> = ({ className, pages, type = "common", fileList, iconsMap }) => {
  const t = msgs("PageCards");

  type tType = Parameters<typeof t>[0];

  const section_title = type === "common" ? hyphenateString(t(`title_${type}` as tType)) : type;
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

  return (
    <div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
      <SectionHeader title={section_title}>
        <RevalidatePaths paths={[Route.public.HOME.uri]} />
        <CreatePage fileList={fileList} icons={iconsMap} />
        {/* <ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/> */}
      </SectionHeader>

      <div className={styles.feed}>
        {pages?.map((page, index) => (
          <PageCard key={index} fileList={fileList} iconsMap={iconsMap} page={page} />
        ))}
      </div>
    </div>
  );
};

export default Section;
