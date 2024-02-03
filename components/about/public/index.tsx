import React from "react";

import { getTags } from "@/components/tags/_tags.actions";

import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import SpokenLanguages from "./Languages";
import Resume from "./Resume";
import TechTags from "./TechTags";
import TimeLine from "./TimeLine";
import BusinessCard from "./business-card";

interface Props {
	className?: string;
}

const AboutPublic: React.FC<Props> = async ({ className }) => {
	const entriesHyphenated = await getEntries({
		hyphen: true,
		typeList: ["employment", "education", "resume"],
		public: true,
	});

	const entriesClear = await getEntries({
		hyphen: false,
		typeList: ["businessCard", "spokenLanguages"],
		public: true,
	});

	const tags = await getTags();

	return (
		<div className={`${styles.about} ${className}`}>
			<BusinessCard entries={entriesClear} type="businessCard" />
			<Resume entries={entriesHyphenated} type="resume" />
			<TimeLine displayTags={true} entries={entriesHyphenated} type="employment" />
			<TimeLine displayTags={false} entries={entriesHyphenated} type="education" visibleItems={2} />
			<SpokenLanguages entries={entriesClear} type="spokenLanguages" />
			<TechTags tags={tags} />
		</div>
	);
};

export default AboutPublic;
