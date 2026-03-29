"use client";

import React from "react";

import RevalidatePaths from "@/components/shared/RevalidatePaths";
import SectionHeader from "@/components/shared/SectionHeader";
import ToggleCollapsible from "@/components/shared/ToggleCollapsible";
import { useAppContext } from "@/contexts/AppContext";
import { type TagType } from "@/interfaces/_common-data-types";
import { hyphenateString } from "@/lib/process-text";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import styles from "../_tags.module.css";
import CreateTag from "./Actions/CreateTag";
import TagCard from "./Card";

interface Props {
  className?: string;
  type: TagType;
  visibleItems?: number;
}

const Section: React.FC<Props> = ({ className, type, visibleItems = 2 }) => {
  const { tags } = useAppContext();
  const t = msgs("Tags");

  type tType = Parameters<typeof t>[0];

  const section_title = hyphenateString(t(`title_${type}` as tType));
  const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

  const tagsByType = tags?.filter(({ tagType }) => tagType === type) || [];
  const count = tagsByType.length;
  const displayCountLess = ` | ${count}/${count}`;
  const displayCountAll = ` | ${visibleItems}/${count}`;

  return (
    <div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
      <SectionHeader title={section_title}>
        <RevalidatePaths />
        <CreateTag tagType={type} />
        <ToggleCollapsible
          tooltip
          target_id={toggle_target_id}
          text={[t("btnAll") + displayCountAll, t("btnLess") + displayCountLess]}
          type="section"
        />
      </SectionHeader>

      <div className={styles.feed}>
        {tagsByType
          .sort((a, b) => a.orderKey.localeCompare(b.orderKey))
          .map((tag, index) => (
            <TagCard
              key={index}
              className={visibleItems > index ? "" : "section-card-collapsible"}
              tag={tag}
            />
          ))}
      </div>
    </div>
  );
};

export default Section;
