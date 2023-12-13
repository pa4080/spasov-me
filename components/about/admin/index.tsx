import React from "react";

import rehypeExternalLinks, { Target } from "rehype-external-links";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { AboutEntryItem } from "@/interfaces/_dataTypes";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { getEntries, getFileList } from "../_about.actions";
import styles from "../_about.module.scss";
import EntryCreate from "./EntryCreate";
import EntryDisplay from "./EntryDisplay";
import RevalidatePaths from "./RevalidatePaths";
import { FileListItem } from "./entry-form";

export interface GenericActionProps {
	className?: string;
	entryType: AboutEntryItem;
	files?: FileListItem[];
}

interface Props {
	className?: string;
}

const processMarkdown = (markdown: string) => {
	// https://github.com/unifiedjs/unified
	// https://github.com/unifiedjs/unified#processorprocesssyncfile
	const result = unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypeFormat)
		.use(rehypeExternalLinks, { rel: ["nofollow"], target: "spasov-me-tab" as Target })
		.use(rehypeStringify)
		.processSync(markdown);

	return result.value.toString();
};

const PagesFeedAndEditOptions: React.FC<Props> = async ({ className }) => {
	const t = msgs("AboutCV");

	const entryList = await getEntries();
	const fileList = await getFileList();

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
		};
	});

	const files: FileListItem[] | undefined = fileList
		?.filter((file) => file.filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx|gif)$/))
		.map((file) => ({
			value: file._id.toString(),
			label: file.filename,
		}));

	const Section = ({ type, title }: { type: AboutEntryItem; title: string }) => (
		<div className={cn(styles.section)}>
			<div className="flex items-center justify-between gap-4 mb-4 w-full">
				<h1 className={cn(styles.title, "flex-grow")}>{title}</h1>
				<div className="flex gap-2">
					<RevalidatePaths entryType={type} files={files} />
					<EntryCreate entryType={type} files={files} />
				</div>
			</div>

			<div className={cn(styles.feed)}>
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime())
					.map((entry, index) => <EntryDisplay key={index} entry={entry} files={files} />)}
			</div>
		</div>
	);

	return (
		<div className={cn(styles.about, className)}>
			<Section title={t("title_employment")} type="employment" />
			<Section title={t("title_education")} type="education" />
		</div>
	);
};

export default PagesFeedAndEditOptions;
