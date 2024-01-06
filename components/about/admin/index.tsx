import React from "react";

import { getFileList } from "@/components/_common.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { TagListItem } from "@/interfaces/Tag";
import { AboutEntryType } from "@/interfaces/_dataTypes";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import RevalidatePaths from "../../fragments/RevalidatePaths";
import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import EntryCreate from "./EntryCreate";
import EntryDisplay from "./EntryDisplay";

export interface GenericActionProps {
	className?: string;
	entry: AboutEntryData;
	entryType: AboutEntryType;
	entry_id: string;
	files?: FileListItem[] | null;
	tags: TagListItem[] | null;
}

interface Props {
	className?: string;
}

const AboutAdmin: React.FC<Props> = async ({ className }) => {
	const t = msgs("AboutCV");

	const entries = await getEntries({ hyphen: true });
	const tags = await getTags();
	const fileList = await getFileList();

	const Section = ({ type, title }: { type: AboutEntryType; title: string }) => (
		<div className={styles.section}>
			<div className={styles.sectionHeader}>
				<div className={styles.sectionButtons}>
					<RevalidatePaths paths={[Route.public.ABOUT.uri]} />
					<EntryCreate entryType={type} files={fileList} tags={tags} />
				</div>
				<h1 className={styles.sectionTitle}>{title}</h1>
			</div>

			<div className={styles.feed}>
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime())
					.map((entry, index) => (
						<EntryDisplay key={index} entry={entry} files={fileList} tags={tags} />
					))}
			</div>
		</div>
	);

	return (
		<div className={`${styles.about} ${className}`}>
			<Section title={t("title_business_card")} type="businessCard" />
			<Section title={t("title_resume")} type="resume" />
			<Section title={t("title_employment")} type="employment" />
			<Section title={t("title_education")} type="education" />
			<Section title={t("title_spoken_languages")} type="spokenLanguages" />
		</div>
	);
};

export default AboutAdmin;
