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

	/*
	const Section = ({
		type,
		title,
		visibleItems = 2,
	}: {
		type: AboutEntryType;
		title: string;
		visibleItems?: number;
	}) => (
		<div className={styles.section}>
			<div className={styles.sectionHeader}>
				<h1 className={styles.sectionTitle}>{title}</h1>
				<div className={styles.sectionButtons}>BTN</div>
			</div>

			<div className={styles.feed}>
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime())
					.map((entry, index) => (
						<EntryDisplay
							key={index}
							className={visibleItems > index ? "visible" : "hidden"}
							entry={entry}
						/>
					))}
			</div>
		</div>
	);
*/
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
			<TimeLine entries={entries} title={t("title_employment")} type="employment" />
			{/* <Section title={t("title_education")} type="education" /> */}
			{/* <Section title={t("title_spoken_languages")} type="spokenLanguages" /> */}
		</div>
	);
};

export default AboutPublic;
