import React from "react";

import { IconMap } from "@/interfaces/IconMap";
import { TagListItem } from "@/interfaces/Tag";
import { TagType } from "@/interfaces/_dataTypes";

import { getTags } from "../_tags.actions";
import styles from "../_tags.module.scss";
import Section from "./Section";
import SectionIndex from "./SectionIndex";

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
	const tags = await getTags();

	return (
		<div className={`${styles.about} ${className}`}>
			<SectionIndex tags={tags} />
			<Section tags={tags} type="informationTechnologies" />
			<Section tags={tags} type="mechanicalEngineering" />
			<Section tags={tags} type="officeApplications" />
			<Section tags={tags} type="system" />
		</div>
	);
};

export default TagsAdmin;
