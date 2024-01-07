import React from "react";

import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import BusinessCard from "./Section_BusinessCard";
import Resume from "./Section_Resume";
import TimeLine from "./Section_TimeLine";

interface Props {
	className?: string;
}

const AboutPublic: React.FC<Props> = async ({ className }) => {
	const entriesHyphenated = await getEntries({
		hyphen: true,
		typeList: ["employment", "education", "resume"],
	});
	const entriesClear = await getEntries({
		hyphen: false,
		typeList: ["businessCard", "spokenLanguages"],
	});

	return (
		<div className={`${styles.about} ${className}`}>
			<BusinessCard entries={entriesClear} type="businessCard" />
			<Resume entries={entriesHyphenated} type="resume" />
			<TimeLine entries={entriesHyphenated} type="employment" />
			<TimeLine entries={entriesHyphenated} type="education" />
			{/* <SpokenLanguages entries={entriesClear} type="spokenLanguages" /> */}
		</div>
	);
};

export default AboutPublic;
