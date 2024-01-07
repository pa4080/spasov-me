import React from "react";

import { msgs } from "@/messages";

import DisplayTagIcon from "@/components/tags/common/DisplayTagIcon";
import { TagListItem } from "@/interfaces/Tag";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import styles from "../_about.module.scss";

interface Props {
	className?: string;
	tags: TagListItem[] | null;
}

const TechTags: React.FC<Props> = ({ className, tags }) => {
	const t = msgs("AboutCV");

	const section_title = t(`title_techTags`);
	const toggle_target_id = `section_techTags}`;

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<div className={styles.sectionHeader}>
				<div className={styles.sectionButtons}>{/* <!-- empty --> */}</div>
				<h1 dangerouslySetInnerHTML={{ __html: section_title }} className={styles.sectionTitle} />
			</div>

			<div className="flex flex-wrap gap-2 items-center justify-start">
				{tags
					?.filter(({ tagType }) => tagType !== "system")
					?.sort((a, b) =>
						a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
					)
					.map((tag) => (
						<DisplayTagIcon
							key={tag._id}
							classNameBtn="!mt-0"
							description={tag.description}
							icon={iconsMap[tag.icon as IconsMapItem]}
						/>
					))}
			</div>
		</div>
	);
};

export default TechTags;
