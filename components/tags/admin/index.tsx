import React from "react";

import { TagItem } from "@/interfaces/_dataTypes";
import { msgs } from "@/messages";

import { IconMap } from "@/interfaces/IconMap";
import icons from "@/public/assets/icons";

import RevalidatePaths from "../../fragments/RevalidatePaths";
import { getTags } from "../_tags.actions";
import styles from "../_tags.module.scss";
import TagCreate from "./TagCreate";
import TagDisplay from "./TagDisplay";

export interface GenericActionProps {
	className?: string;
	tagType: TagItem;
	icons: IconMap;
}

interface Props {
	className?: string;
}

const TagsAdmin: React.FC<Props> = async ({ className }) => {
	const t = msgs("TagsAdmin");

	const tagList = await getTags();
	const tags = tagList?.map((tag) => ({
		_id: tag._id.toString(),
		name: tag.name,
		description: tag.description,
		icon: tag.icon,
		tagType: tag.tagType,
		orderKey: tag.orderKey,
	}));

	const Section = ({ type, title }: { type: TagItem; title: string }) => (
		<div className={styles.section}>
			<div className={styles.sectionHeader}>
				<h1 className={styles.sectionTitle}>{title}</h1>
				<div className="flex gap-2">
					<RevalidatePaths />
					<TagCreate icons={icons} tagType={type} />
				</div>
			</div>

			<div className={styles.feed}>
				{tags
					?.filter(({ tagType }) => tagType === type)
					.sort((a, b) => a.orderKey.localeCompare(b.orderKey))
					.map((tag, index) => <TagDisplay key={index} icons={icons} tag={tag} />)}
			</div>
		</div>
	);

	return (
		<div className={`${styles.about} ${className}`}>
			<Section title={t("title_system_tags")} type="system" />
			<Section title={t("title_it_tags")} type="informationTechnologies" />
			<Section title={t("title_me_tags")} type="mechanicalEngineering" />
			<Section title={t("title_of_tags")} type="officeApplications" />
		</div>
	);
};

export default TagsAdmin;
