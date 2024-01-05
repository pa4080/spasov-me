import React from "react";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { msgs } from "@/messages";

import styles from "../_about.module.scss";
import ToggleCollapsible from "./ToggleHidden";

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
			<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
				<div className={styles.sectionHeader}>
					<div className={styles.sectionButtons}>
						<ToggleCollapsible
							target_id={toggle_target_id}
							text={[t("btnMore"), t("btnLess")]}
							type="section"
						/>
					</div>
					<h1 className={styles.sectionTitle}>{title}</h1>
				</div>

				<div className={`${styles.card} ${styles.cardPublic}`}>
					<div className={styles.description}>
						<div
							dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
							className="section-card-static"
						/>
						{descriptionArr[1] && (
							<div
								dangerouslySetInnerHTML={{ __html: descriptionArr[1] ?? "" }}
								className="section-card-collapsible"
							/>
						)}
					</div>
				</div>
			</div>
		)
	);
};

export default Resume;
