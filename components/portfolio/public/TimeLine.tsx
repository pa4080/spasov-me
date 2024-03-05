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
 * In the format of: `title_${type}`, i.e. "title_employment"...
 *
 * We won't filter the projects by type because we want to show all projects,
 * ordered by date... probably we need may indicate the type by a icon?(!?)
 */
const TimeLine: React.FC<Props> = ({ className, projects }) => {
	const projectsByType = projects?.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={`${styles.section} ${className}`}>
			<div className={styles.feed}>
				{projectsByType?.map((project, index) => (
					<ProjectPublicCard key={index} className="" project={project} />
				))}
			</div>
		</div>
	);
};

export default TimeLine;
