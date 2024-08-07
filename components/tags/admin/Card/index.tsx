import React from "react";

// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates

import { msgs } from "@/messages";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";

import styles from "./_tag-card.module.scss";

import DeleteTag from "../Actions/DeleteTag";
import UpdateTag from "../Actions/UpdateTag";

export interface GenericActionProps {
	className?: string;
	tag: TagData;
	iconsMap: IconsMap;
}

interface Props extends Omit<GenericActionProps, "tagType" | "tag_id"> {}

const TagCard: React.FC<Props> = ({ tag, className, iconsMap }) => {
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
