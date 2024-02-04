import React from "react";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/section-header";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import { AboutEntryType } from "@/interfaces/_common-data-types";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import ToggleCollapsible from "../../fragments/toggle-collapsible";
import styles from "../_about.module.scss";
import AboutEntryCard from "../common/about-card";
import CreateAboutEntry from "./about-actions/CreateAboutEntry";

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
