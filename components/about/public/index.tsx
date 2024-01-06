import React from "react";

import { msgs } from "@/messages";

import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import BusinessCard from "./Section_BusinessCard";
import Resume from "./Section_Resume";
import TimeLine from "./Section_TimeLine";

interface Props {
	className?: string;
}

const AboutPublic: React.FC<Props> = async ({ className }) => {
	const t = msgs("AboutCV");

	const entries = await getEntries();

	return (
		<div className={`${styles.about} ${className}`}>
			<BusinessCard
				entry={
					entries
						?.filter(({ entryType }) => entryType === "businessCard")
						.find(({ dateTo, visibility }) => dateTo === undefined && visibility) ?? null
				}
			/>
			{/* <Section title={t("title_business_card")} type="businessCard" /> */}
			<Resume
				entry={
					entries
						?.filter(({ entryType }) => entryType === "resume")
						.find(({ dateTo, visibility }) => dateTo === undefined && visibility) ?? null
				}
				title={t("title_resume")}
			/>
			<TimeLine entries={entries} type="employment" />
			<TimeLine entries={entries} type="education" />
			{/* <Section title={t("title_spoken_languages")} type="spokenLanguages" /> */}
		</div>
	);
};

export default AboutPublic;
