import React from "react";

// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates

import { msgs } from "@/messages";

import styles from "@/components/tags/_tags.module.scss";
import DisplayTagIcon from "@/components/tags/common/DisplayTagIcon";

import TagDelete from "../tag-actions/TagDelete";
import TagUpdate from "../tag-actions/TagUpdate";

import { GenericActionProps } from "..";

interface Props extends Omit<GenericActionProps, "tagType" | "tag_id"> {}

const TagCard: React.FC<Props> = ({ tag, className, icons }) => {
	const { name, description, icon, tagType, orderKey } = tag;

	const t = msgs("TagsAdmin_Display");
	const tForm = msgs("TagsAdmin_Form");

	return (
		<div className={`${styles.cardWrapper} ${className}`} id={`tag_${tag._id}`}>
			<div className={`${styles.card}`}>
				<div className={styles.buttons}>
					<TagDelete tagType={tag.tagType} tag_id={tag._id} />
					<TagUpdate icons={icons} tag={tag} tagType={tag.tagType} />
				</div>

				<div className={styles.cardRow}>
					<div className={styles.leftCol}>{t("name")}:</div>
					<div className={`${styles.rightCol} font-semibold`}>{name}</div>
				</div>
				<div className={styles.cardRow}>
					<div className={styles.leftCol}>{t("description")}:</div>
					<div className={styles.rightCol}>{description}</div>
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
						<DisplayTagIcon icon={icons[icon]} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default TagCard;
