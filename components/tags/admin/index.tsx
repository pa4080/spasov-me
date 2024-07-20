import React from "react";

import { getIconsMap } from "@/components/files-cloudflare/_files.actions";

import { getTags } from "../_tags.actions";
import styles from "../_tags.module.scss";
import Section from "./Section";
import SectionIndex from "./SectionIndex";

interface Props {
	className?: string;
}

const TagsAdmin: React.FC<Props> = async ({ className }) => {
	const data = await Promise.all([getIconsMap(), getTags({ public: false, hyphen: true })]).then(
		([iconsMap, tags]) => ({
			iconsMap,
			tags,
		})
	);

	return (
		<div className={`${styles.about} ${className}`}>
			<SectionIndex {...data} />
			<Section {...data} type="informationTechnologies" />
			<Section {...data} type="mechanicalEngineering" />
			<Section {...data} type="officeApplications" />
			<Section {...data} type="system" />
		</div>
	);
};

export default TagsAdmin;
