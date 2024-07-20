import React from "react";

import { msgs } from "@/messages";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import { TagData } from "@/interfaces/Tag";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";

import { IconsMap } from "@/interfaces/IconsMap";

import styles from "../_tags.module.scss";
import CreateTag from "./Actions/CreateTag";

interface Props {
	className?: string;
	tags: TagData[] | null;
	type?: string;
	iconsMap: IconsMap;
}

const SectionIndex: React.FC<Props> = ({ className, tags, type = "tagIndex", iconsMap }) => {
	const t = msgs("Tags");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths />
				<CreateTag iconsMap={iconsMap} tagType={"informationTechnologies"} />
			</SectionHeader>

			<div className="flex flex-wrap gap-2 items-center justify-start">
				{tags?.map((tag) => (
					<a key={tag._id} href={`#tag_${tag._id}`}>
						<DisplayIcon
							className_TooltipTrigger="!mt-0"
							description={tag.html.description}
							icon={iconsMap[tag.icon]}
						/>
					</a>
				))}
			</div>
		</div>
	);
};

export default SectionIndex;
