import React from "react";

import { AboutEntryType } from "@/interfaces/_dataTypes";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { msgs } from "@/messages";

import styles from "../_about.module.scss";
import DisplayEntryCard from "./TimeLine_EntryCard";
import ToggleCollapsible from "./ToggleHidden";

interface Props {
	className?: string;
	type: AboutEntryType;
	visibleItems?: number;
	entries: AboutEntryData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({ className, type, visibleItems = 3, entries }) => {
	const t = msgs("AboutCV");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = `section_${type}`;

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<div className={styles.sectionHeader}>
				<div className={styles.sectionButtons}>
					<ToggleCollapsible
						target_id={toggle_target_id}
						text={[t("btnAll"), t("btnLess")]}
						type="section"
					/>
				</div>
				<h1 dangerouslySetInnerHTML={{ __html: section_title }} className={styles.sectionTitle} />
			</div>

			<div className={styles.feed}>
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime())
					.map((entry, index) => (
						<DisplayEntryCard
							key={index}
							className={visibleItems > index ? "" : "section-card-collapsible"}
							entry={entry}
						/>
					))}
			</div>
		</div>
	);
};

export default TimeLine;
