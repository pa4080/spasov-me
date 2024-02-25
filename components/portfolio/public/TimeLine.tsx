import React from "react";

import { ProjectData } from "@/interfaces/Project";
import { ProjectType } from "@/interfaces/_common-data-types";

import ProjectPublicCard from "./Card";
import styles from "./_portfolio.module.scss";

interface Props {
	className?: string;
	type?: ProjectType;
	projects: ProjectData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({ className, projects }) => {
	const entriesByType = projects?.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={`${styles.section} ${className}`}>
			<div className={styles.feed}>
				{entriesByType?.map((entry, index) => (
					<ProjectPublicCard key={index} className="" project={entry} />
				))}
			</div>
		</div>
	);
};

export default TimeLine;
