import React from "react";

// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates

import { cn } from "@/lib/cn-utils";

import { msgs } from "@/messages";

import { IconMap } from "@/interfaces/IconMap";

import styles from "../_tags.module.scss";
import DisplayTag from "../common/DisplayTag";
import { Tag_FormSchema } from "./tag-form/schema";
import TagDelete from "./TagDelete";
import TagUpdate from "./TagUpdate";

interface Props {
	tag: Tag_FormSchema & {
		_id: string;
	};
	className?: string;
	icons: IconMap;
}

const TagDisplay: React.FC<Props> = ({ tag: tag, className, icons }) => {
	const { name, description, icon, tagType } = tag;

	const t = msgs("TagsAdmin_Display");
	const tForm = msgs("TagsAdmin_Form");

	return (
		<div className={cn(styles.card, styles.editModeCard, className)}>
			<div className={styles.cardEditActions}>
				<TagDelete tagType={tag.tagType} tag_id={tag._id} />
				<TagUpdate icons={icons} tag={tag} tagType={tag.tagType} />
			</div>

			<div className="flex justify-start items-center">
				<span className="text-foreground-secondary w-28">{t("name")}:</span>
				<span className="font-semibold">{name}</span>
			</div>
			<div className="flex justify-start items-center">
				<span className="text-foreground-secondary w-28">{t("description")}:</span>
				<span className="font-semibold">{description}</span>
			</div>
			<div className="flex justify-start items-center">
				<span className="text-foreground-secondary w-28">{t("type")}:</span>
				<span className="font-semibold">
					{(tForm("tag_type_list") as unknown as Record<string, string>)[tagType]}
				</span>
			</div>
			<div className="flex justify-start items-center">
				<span className="text-foreground-secondary w-28">{t("icon")}:</span>
				<span className="font-semibold">
					<DisplayTag icon={icons[icon]} />
				</span>
			</div>
		</div>
	);
};

export default TagDisplay;
