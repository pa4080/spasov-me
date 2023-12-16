import React from "react";

import { TagItem } from "@/interfaces/_dataTypes";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { getFileList } from "@/components/_common.actions";

import RevalidatePaths from "../../fragments/RevalidatePaths";
import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import TagCreate from "./TagCreate";
import { FileListItem } from "./tag-form";

export interface GenericActionProps {
	className?: string;
	tagType: TagItem;
	files?: FileListItem[];
}

interface Props {
	className?: string;
}

const PagesFeedAndEditOptions: React.FC<Props> = async ({ className }) => {
	const t = msgs("TagsAdmin");

	const entryList = await getEntries();
	const fileList = await getFileList();

	// const entries = entryList?.map((entry) => {
	// 	return {
	// 		_id: entry._id.toString(),
	// 		html: {
	// 			// This cannot be done in the client side
	// 			title: processMarkdown(entry.title),
	// 			description: processMarkdown(entry.description),
	// 			attachmentUri:
	// 				entry.attachment && `${entry.attachment?._id.toString()}/${entry.attachment?.filename}`,
	// 		},

	// 		title: entry.title,
	// 		description: entry.description,
	// 		country: entry.country,
	// 		city: entry.city,
	// 		dateFrom: entry.dateFrom as Date,
	// 		dateTo: entry.dateTo as Date | undefined,
	// 		entryType: entry.entryType,
	// 		visibility: entry.visibility as boolean,
	// 		attachment: entry.attachment?._id.toString(),
	// 	};
	// });

	const icons: FileListItem[] | undefined = fileList
		?.filter((file) => file.filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx|gif)$/))
		.map((file) => ({
			value: file._id.toString(),
			label: file.filename,
		}));

	const Section = ({ type, title }: { type: TagItem; title: string }) => (
		<div className={styles.section}>
			<div className={styles.sectionHeader}>
				<h1 className={styles.sectionTitle}>{title}</h1>
				<div className="flex gap-2">
					<RevalidatePaths />
					<TagCreate files={icons} tagType={type} />
				</div>
			</div>

			{/* <div className={cn(styles.feed)}>
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime())
					.map((entry, index) => <EntryDisplay key={index} entry={entry} files={files} />)}
			</div> */}
		</div>
	);

	return (
		<div className={cn(styles.about, className)}>
			<Section title={t("title_it_tags")} type="technology" />
		</div>
	);
};

export default PagesFeedAndEditOptions;
