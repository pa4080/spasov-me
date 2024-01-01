import React from "react";

import { AboutEntryType } from "@/interfaces/_dataTypes";
import { msgs } from "@/messages";

import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import BusinessCard from "./BusinessCard";
import EntryDisplay from "./EntryDisplay";

interface Props {
	className?: string;
}

const AboutPublic: React.FC<Props> = async ({ className }) => {
	const t = msgs("AboutCV");

	const entries = await getEntries();

	const Section = ({ type, title }: { type: AboutEntryType; title: string }) => (
		<div className={styles.section}>
			<div className={styles.sectionHeader}>
				<h1 className={styles.sectionTitle}>{title}</h1>
				<div className="flex gap-2">BTN</div>
			</div>

			<div className={styles.feed}>
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime())
					.map((entry, index) => <EntryDisplay key={index} entry={entry} />)}
			</div>
		</div>
	);

	return (
		<div className={`${styles.about} ${className}`}>
			<BusinessCard
				data={
					entries
						?.filter(({ entryType }) => entryType === "businessCard")
						.find(({ dateTo, visibility }) => dateTo === undefined && visibility) ?? null
				}
			/>
			{/* <Section title={t("title_business_card")} type="businessCard" /> */}
			<Section title={t("title_resume")} type="resume" />
			<Section title={t("title_employment")} type="employment" />
			<Section title={t("title_education")} type="education" />
			<Section title={t("title_spoken_languages")} type="spokenLanguages" />
		</div>
	);
};

export default AboutPublic;
