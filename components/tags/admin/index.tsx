import React from "react";

import { IconMap } from "@/interfaces/IconMap";
import { TagListItem } from "@/interfaces/Tag";
import { TagType } from "@/interfaces/_dataTypes";
import { msgs } from "@/messages";
import icons from "@/public/assets/icons";

import RevalidatePaths from "../../fragments/RevalidatePaths";
import { getTags } from "../_tags.actions";
import styles from "../_tags.module.scss";
import TagCreate from "./TagCreate";
import TagDisplay from "./TagDisplay";

export interface GenericActionProps {
	className?: string;
	tag: TagListItem;
	tagType: TagType;
	tag_id: string;
	icons: IconMap;
}

interface Props {
	className?: string;
}

const TagsAdmin: React.FC<Props> = async ({ className }) => {
	const t = msgs("TagsAdmin");

	const tags = await getTags();

	const Section = ({ type, title }: { type: TagType; title: string }) => (
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
			<Section title={t("title_it_tags")} type="informationTechnologies" />
			<Section title={t("title_me_tags")} type="mechanicalEngineering" />
			<Section title={t("title_of_tags")} type="officeApplications" />
			<Section title={t("title_system_tags")} type="system" />
		</div>
	);
};

export default TagsAdmin;
