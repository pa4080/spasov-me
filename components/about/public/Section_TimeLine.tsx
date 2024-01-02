import React from "react";

import { AboutEntryType } from "@/interfaces/_dataTypes";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { msgs } from "@/messages";

import styles from "../_about.module.scss";
import DisplayEntry from "./Section_TimeLineEntry";
import ToggleHidden_Single from "./ToggleHidden_Single";

interface Props {
	className?: string;
	type: AboutEntryType;
	title: string;
	visibleItems?: number;
	entries: AboutEntryData[] | null;
}

const TimeLine: React.FC<Props> = ({ className, type, title, visibleItems = 2, entries }) => {
	const tCommon = msgs("AboutCV");
	const toggle_target_id = `section_${type}`;

	return (
		<div className={`${styles.section} ${className}`} id={toggle_target_id}>
			<div className={styles.sectionHeader}>
				<div className={styles.sectionButtons}>
					<ToggleHidden_Single
						target_class="card-collapsible"
						target_id={toggle_target_id}
						text={[tCommon("btnAll"), tCommon("btnLess")]}
					/>
				</div>
				<h1 className={styles.sectionTitle}>{title}</h1>
			</div>

			<div className={styles.feed}>
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime())
					.map((entry, index) => (
						<DisplayEntry
							key={index}
							className={visibleItems > index ? "" : "card-collapsible hidden"}
							entry={entry}
						/>
					))}
			</div>
		</div>
	);
};

export default TimeLine;
