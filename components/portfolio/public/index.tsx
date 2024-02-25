import React from "react";

import { getProjects } from "../_portfolio.actions";
import styles from "./_portfolio.module.scss";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const AboutPublic: React.FC<Props> = async ({ className }) => {
	const projectsHyphenated = await getProjects({
		hyphen: true,
		public: true,
	});

	return (
		<div className={`${styles.portfolio} ${className}`}>
			<TimeLine projects={projectsHyphenated} type="informationTechnologies" />
		</div>
	);
};

export default AboutPublic;
