import React from "react";

import { msgs } from "@/messages";

import DisplayTagIcon from "@/components/tags/common/DisplayTagIcon";
import { TagData } from "@/interfaces/Tag";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import SectionHeader from "@/components/fragments/section-header";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";

import styles from "../_tags.module.scss";
import TagCreate from "./TagCreate";

interface Props {
	className?: string;
	tags: TagData[] | null;
	type?: string;
}

const SectionIndex: React.FC<Props> = ({ className, tags, type = "tagIndex" }) => {
	const t = msgs("TagsAdmin");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = `section_${type}`;

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths />
				<TagCreate icons={iconsMap} tagType={"informationTechnologies"} />
			</SectionHeader>

			<div className="flex flex-wrap gap-2 items-center justify-start">
				{tags
					?.sort((a, b) =>
						a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
					)
					.map((tag) => (
						<a key={tag._id} href={`#tag_${tag._id}`}>
							<DisplayTagIcon
								classNameBtn="!mt-0"
								description={tag.description}
								icon={iconsMap[tag.icon as IconsMapItem]}
							/>
						</a>
					))}
			</div>
		</div>
	);
};

export default SectionIndex;
