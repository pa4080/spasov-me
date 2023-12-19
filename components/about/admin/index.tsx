import React from "react";

import rehypeExternalLinks, { Target } from "rehype-external-links";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { AboutEntryItem } from "@/interfaces/_dataTypes";
import { msgs } from "@/messages";

import { getFileList } from "@/components/_common.actions";

import { Route } from "@/routes";

import { getTags } from "@/components/tags/_tags.actions";

import { TagList } from "@/interfaces/Tag";

import RevalidatePaths from "../../fragments/RevalidatePaths";
import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import EntryCreate from "./EntryCreate";
import EntryDisplay from "./EntryDisplay";
import { FileListItem } from "./entry-form";

export interface GenericActionProps {
	className?: string;
	entryType: AboutEntryItem;
	files?: FileListItem[];
	tags: TagList;
}

interface Props {
	className?: string;
}

export const new_tab_target = "spasov-me-tab" as Target;

const processMarkdown = (markdown: string) => {
	// https://github.com/unifiedjs/unified
	// https://github.com/unifiedjs/unified#processorprocesssyncfile
	const result = unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeFormat)
		.use(rehypeExternalLinks, { rel: ["nofollow"], target: new_tab_target })
		.use(rehypeStringify)
		.processSync(markdown);

	return result.value.toString();
};

const AboutAdmin: React.FC<Props> = async ({ className }) => {
	const t = msgs("AboutCV");

	const entryList = await getEntries();
	const fileList = await getFileList();
	const tagList = await getTags();

	const entries = entryList?.map((entry) => {
		return {
			_id: entry._id.toString(),
			html: {
				// This cannot be done in the client side
				title: processMarkdown(entry.title),
				description: processMarkdown(entry.description),
				attachmentUri:
					entry.attachment && `${entry.attachment?._id.toString()}/${entry.attachment?.filename}`,
			},

			title: entry.title,
			description: entry.description,
			country: entry.country,
			city: entry.city,
			dateFrom: entry.dateFrom as Date,
			dateTo: entry.dateTo as Date | undefined,
			entryType: entry.entryType,
			visibility: entry.visibility as boolean,
			attachment: entry.attachment?._id.toString(),
			tags:
				entry.tags?.map((tag) => ({
					name: tag.name,
					description: tag.description,
					_id: tag._id.toString(),
					icon: tag.icon,
					tagType: tag.tagType,
				})) || [],
		};
	});

	const files: FileListItem[] | undefined = fileList
		?.filter((file) => file.filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx|gif)$/))
		.map((file) => ({
			value: file._id.toString(),
			label: file.filename,
		}));

	const tags: TagList =
		tagList?.map((tag) => ({
			name: tag.name,
			description: tag.description,
			_id: tag._id.toString(),
			icon: tag.icon,
			tagType: tag.tagType,
		})) || [];

	const Section = ({ type, title }: { type: AboutEntryItem; title: string }) => (
		<div className={styles.section}>
			<div className={styles.sectionHeader}>
				<h1 className={styles.sectionTitle}>{title}</h1>
				<div className="flex gap-2">
					<RevalidatePaths paths={[Route.public.ABOUT.uri]} />
					<EntryCreate entryType={type} files={files} tags={tags} />
				</div>
			</div>

			<div className={styles.feed}>
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime())
					.map((entry, index) => (
						<EntryDisplay key={index} entry={entry} files={files} tags={tags} />
					))}
			</div>
		</div>
	);

	return (
		<div className={`${styles.about} ${className}`}>
			<Section title={t("title_employment")} type="employment" />
			<Section title={t("title_education")} type="education" />
		</div>
	);
};

export default AboutAdmin;
