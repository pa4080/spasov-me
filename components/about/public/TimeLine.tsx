import React from "react";

import { AboutEntryType } from "@/interfaces/_common-data-types";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { msgs } from "@/messages";

import SectionHeader from "@/components/fragments/section-header";

import ToggleCollapsible from "../../fragments/toggle-collapsible";
import styles from "../_about.module.scss";
import AboutEntryCard from "../common/about-card";

interface Props {
	className?: string;
	type: AboutEntryType;
	visibleItems?: number;
	entries: AboutEntryData[] | null;
	displayTags: boolean;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({ className, type, visibleItems = 3, entries, displayTags }) => {
	const t = msgs("AboutCV");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = `section_${type}`;

	const entriesByType = entries
		?.filter(({ entryType }) => entryType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader className="pop-header" title={section_title}>
				<ToggleCollapsible
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>
			<div className={styles.feed}>
				{entriesByType?.map((entry, index) => (
					<AboutEntryCard
						key={index}
						className={visibleItems > index ? "pop-item" : "section-card-collapsible pop-item"}
						displayTags={displayTags}
						entry={entry}
					/>
				))}
			</div>
		</div>
	);
};

export default TimeLine;
