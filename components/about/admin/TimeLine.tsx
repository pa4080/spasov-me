import React from "react";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import { AboutEntryType } from "@/interfaces/_common-data-types";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import styles from "../_about.module.scss";
import AboutEntryCard from "../common/Card";
import CreateAboutEntry from "./Actions/Create";

interface Props {
	className?: string;
	type: AboutEntryType;
	visibleItems?: number;
	entries: AboutEntryData[] | null;
	files?: FileListItem[] | null;
	tags: TagData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({ className, type, visibleItems = 3, entries, tags, files }) => {
	const t = msgs("AboutEntries");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	// Filter the items by their type - i.e. ["employment", "education", ...]
	const entriesByType = entries
		?.filter(({ entryType }) => entryType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths paths={[Route.public.ABOUT.uri]} />
				<CreateAboutEntry files={files} tags={tags} type={type} />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>
			<div className={styles.feed}>
				{entriesByType?.map((entry, index) => (
					<AboutEntryCard
						key={index}
						displayActions
						displayGalleryInline
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
