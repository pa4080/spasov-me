import React from "react";

import { msgs } from "@/messages";

import { TagData } from "@/interfaces/Tag";
import iconsMap from "@/public/assets/icons";

import SectionHeader from "@/components/fragments/section-header";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import ToggleCollapsible from "@/components/fragments/toggle-collapsible";

import { TagType } from "@/interfaces/_dataTypes";

import { hyphenateString } from "@/lib/process-text";

import styles from "../_tags.module.scss";
import CreateTag from "./tag-actions/CreateTag";
import TagCard from "./tag-card";

interface Props {
	className?: string;
	tags: TagData[] | null;
	type: TagType;
	visibleItems?: number;
}

const Section: React.FC<Props> = ({ className, tags, type, visibleItems = 2 }) => {
	const t = msgs("TagsAdmin");

	type tType = Parameters<typeof t>[0];

	const section_title = hyphenateString(t(`title_${type}` as tType));
	const toggle_target_id = `section_${type}`;

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths />
				<CreateTag icons={iconsMap} tagType={type} />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>

			<div className={styles.feed}>
				{tags
					?.filter(({ tagType }) => tagType === type)
					.sort((a, b) => a.orderKey.localeCompare(b.orderKey))
					.map((tag, index) => (
						<TagCard
							key={index}
							className={visibleItems > index ? "" : "section-card-collapsible"}
							icons={iconsMap}
							tag={tag}
						/>
					))}
			</div>
		</div>
	);
};

export default Section;
