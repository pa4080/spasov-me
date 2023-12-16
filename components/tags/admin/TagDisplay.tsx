import React from "react";

// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates

import { cn } from "@/lib/cn-utils";

import { msgs } from "@/messages";

import { IconMap } from "@/interfaces/IconMap";

import styles from "../_about.module.scss";
import DisplayTag from "../common/DisplayTag";
import { Tag_FormSchema } from "./tag-form/schema";

interface Props {
	tag: Tag_FormSchema & {
		_id: string;
	};
	className?: string;
	icons: IconMap;
}

const TagDisplay: React.FC<Props> = ({ tag: tag, className, icons }) => {
	const { title, description, icon, tagType } = tag;

	const t = msgs("TagsAdmin_Display");

	return (
		<div className={cn(styles.card, styles.editModeCard, className)}>
			<div className={styles.cardEditActions}>
				{/* <EntryDelete entry_id={tag._id} tagType={tag.entryType} /> */}
				{/* <EntryShowAttachment uri={tag.html.attachmentUri} /> */}
				{/* <EntryUpdate entry={tag} files={files} tagType={tag.entryType} /> */}
			</div>

			<div className="flex justify-start items-center">
				<span className="text-foreground-secondary w-28">{t("title")}:</span>
				<span className="font-semibold">{title}</span>
			</div>
			<div className="flex justify-start items-center">
				<span className="text-foreground-secondary w-28">{t("description")}:</span>
				<span className="font-semibold">{description}</span>
			</div>
			<div className="flex justify-start items-center">
				<span className="text-foreground-secondary w-28">{t("type")}:</span>
				<span className="font-semibold">{tagType}</span>
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
