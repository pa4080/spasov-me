import React from "react";

import { AboutEntryType } from "@/interfaces/_dataTypes";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { msgs } from "@/messages";

import SectionHeader from "@/components/fragments/section-header";

import { FileListItem } from "@/interfaces/File";

import { TagListItem } from "@/interfaces/Tag";

import { Route } from "@/routes";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";

import ToggleCollapsible from "../../fragments/toggle-collapsible";
import styles from "../_about.module.scss";
import EntryCard from "../common/entry-card";
import EntryCreate from "../common/entry-card/actions/EntryCreate";

interface Props {
	className?: string;
	type: AboutEntryType;
	visibleItems?: number;
	entries: AboutEntryData[] | null;
	files?: FileListItem[] | null;
	tags: TagListItem[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({ className, type, visibleItems = 3, entries, tags, files }) => {
	const t = msgs("AboutCV");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = `section_${type}`;

	const entriesByType = entries
		?.filter(({ entryType }) => entryType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths paths={[Route.public.ABOUT.uri]} />
				<EntryCreate files={files} tags={tags} type={type} />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>
			<div className={styles.feed}>
				{entriesByType?.map((entry, index) => (
					<EntryCard
						key={index}
						displayActions
						className={visibleItems > index ? "" : "section-card-collapsible"}
						entry={entry}
						files={files}
						tags={tags}
					/>
				))}
			</div>
		</div>
	);
};

export default TimeLine;
