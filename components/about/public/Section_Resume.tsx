import React from "react";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { msgs } from "@/messages";

import styles from "../_about.module.scss";
import ToggleHidden_Single from "./ToggleHidden_Single";

interface Props {
	entry: AboutEntryData | null;
	className?: string;
	title: string;
}

const Resume: React.FC<Props> = ({ entry, className, title }) => {
	const t = msgs("AboutCV");
	const toggle_target_id = `resume_${entry?._id.toString()}`;
	const descriptionArr = entry?.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		entry &&
		descriptionArr && (
			<div className={`${styles.section} ${className}`} id={toggle_target_id}>
				<div className={styles.sectionHeader}>
					<div className={styles.sectionButtons}>
						<ToggleHidden_Single
							target_class="about-entry-description-collapsible"
							target_id={toggle_target_id}
							text={[t("btnMore"), t("btnLess")]}
						/>
					</div>
					<h1 className={styles.sectionTitle}>{title}</h1>
				</div>

				<div className={`${styles.card} ${styles.cardPublic}`}>
					<div className={styles.content}>
						<div className={`about-entry-description ${styles.description}`}>
							<div dangerouslySetInnerHTML={{ __html: descriptionArr[0] }} />
							<div className="about-entry-description-collapsible hidden">
								{descriptionArr[1] && (
									<div
										dangerouslySetInnerHTML={{ __html: descriptionArr[1] ?? "" }}
										className="about-entry-description-collapsible-text"
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	);
};

export default Resume;
