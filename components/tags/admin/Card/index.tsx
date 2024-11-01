import React from "react";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { msgs } from "@/messages";

import DeleteTag from "../Actions/DeleteTag";
import UpdateTag from "../Actions/UpdateTag";
import styles from "./_tag-card.module.css";

export interface GenericActionProps {
  className?: string;
  tag: TagData;
  iconsMap: IconsMap;
}

const TagCard: React.FC<GenericActionProps> = ({ tag, className, iconsMap }) => {
  const {
    name,
    html: { description },
    icon,
    tagType,
    orderKey,
  } = tag;

  const t = msgs("Tags_Display");
  const tForm = msgs("Tags_Form");

  return (
    <div className={`${styles.cardWrapper} ${className}`} id={`tag_${tag._id}`}>
      <div className={styles.card}>
        <div className={styles.buttons}>
          <DeleteTag tag={tag} />
          <UpdateTag iconsMap={iconsMap} tag={tag} tagType={tag.tagType} />
        </div>

        <div className={styles.cardRow}>
          <div className={styles.leftCol}>{t("name")}:</div>
          <div className={`${styles.rightCol} font-semibold`}>{name}</div>
        </div>
        <div className={styles.cardRow}>
          <div className={styles.leftCol}>{t("description")}:</div>
          <div dangerouslySetInnerHTML={{ __html: description }} className={styles.rightCol} />
        </div>
        <div className={styles.cardRow}>
          <div className={styles.leftCol}>{t("type")}:</div>
          <div className={styles.rightCol}>
            {(tForm("tag_type_list") as unknown as Record<string, string>)[tagType]}
          </div>
        </div>
        <div className={styles.cardRow}>
          <div className={styles.leftCol}>{t("orderKey")}:</div>
          <div className={styles.rightCol}>{orderKey}</div>
        </div>
        <div className={styles.cardRow}>
          <div className={styles.leftCol}>{t("icon")}:</div>
          <div className={styles.rightCol}>
            <DisplayIcon icon={iconsMap[icon]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagCard;
