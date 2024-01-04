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
	title: string;
	visibleItems?: number;
	entries: AboutEntryData[] | null;
}

const TimeLine: React.FC<Props> = ({ className, type, title, visibleItems = 3, entries }) => {
	const tCommon = msgs("AboutCV");
	const toggle_target_id = `section_${type}`;

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<div className={styles.sectionHeader}>
				<div className={styles.sectionButtons}>
					<ToggleCollapsible
						target_id={toggle_target_id}
						text={[tCommon("btnAll"), tCommon("btnLess")]}
						type="section"
					/>
				</div>
				<h1 dangerouslySetInnerHTML={{ __html: title }} className={styles.sectionTitle} />
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
