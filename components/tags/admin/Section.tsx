import React from "react";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { TagData } from "@/interfaces/Tag";
import { TagType } from "@/interfaces/_common-data-types";
import { hyphenateString } from "@/lib/process-text";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import { IconsMap } from "@/interfaces/IconsMap";

import styles from "../_tags.module.scss";
import CreateTag from "./Actions/CreateTag";
import TagCard from "./Card";

interface Props {
	className?: string;
	tags: TagData[] | null;
	type: TagType;
	visibleItems?: number;
	iconsMap: IconsMap;
}

const Section: React.FC<Props> = ({ className, tags, type, visibleItems = 2, iconsMap }) => {
	const t = msgs("Tags");

	type tType = Parameters<typeof t>[0];

	const section_title = hyphenateString(t(`title_${type}` as tType));
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths />
				<CreateTag iconsMap={iconsMap} tagType={type} />
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
							iconsMap={iconsMap}
							tag={tag}
						/>
					))}
			</div>
		</div>
	);
};

export default Section;
