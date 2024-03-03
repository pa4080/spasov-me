import React from "react";

import { msgs } from "@/messages";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import SectionHeader from "@/components/fragments/SectionHeader";
import { TagData } from "@/interfaces/Tag";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import styles from "../_about.module.scss";

interface Props {
	className?: string;
	tags: TagData[] | null;
}

const TechTags: React.FC<Props> = ({ className, tags }) => {
	const t = msgs("AboutEntries");

	const section_title = t(`title_techTags`);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_techTags`);

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader className="pop-header" title={section_title} />

			<div className="flex flex-wrap gap-2 items-center justify-start pop-item">
				{tags?.map((tag) => (
					<DisplayIcon
						key={tag._id}
						className_TooltipTrigger="!mt-0"
						description={tag.html.description}
						icon={iconsMap[tag.icon as IconsMapItem]}
					/>
				))}
			</div>
		</div>
	);
};

export default TechTags;
