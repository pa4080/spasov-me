import React from "react";

import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { AboutEntryType } from "@/interfaces/_common-data-types";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import styles from "../_about.module.scss";
import cardStyles from "../common/Card/_about-card.module.scss";

interface Props {
	entries: AboutEntryData[] | null;
	className?: string;
	type: AboutEntryType;
}

const Resume: React.FC<Props> = ({ entries, className, type }) => {
	const t = msgs("AboutEntries");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	const entry =
		entries
			?.filter(({ entryType }) => entryType === type)
			?.find(({ dateTo, visibility }) => dateTo === undefined && visibility) ?? null;

	const descriptionArr = entry?.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		entry &&
		descriptionArr && (
			<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
				<SectionHeader className="pop-header" title={section_title}>
					<ToggleCollapsible
						target_id={toggle_target_id}
						text={[t("btnMore"), t("btnLess")]}
						type="section"
					/>
				</SectionHeader>

				<div className={`section_resume-public-text ${cardStyles.card}`}>
					<div className={`${cardStyles.description} md-processed-to-html`}>
						{descriptionArr.map((description, index) => (
							<div
								dangerouslySetInnerHTML={{ __html: description }}
								key={index}
								className={index === 0 ? "section-card-static" : "mt-4 section-card-collapsible"}
							/>
						))}
					</div>
				</div>
			</div>
		)
	);
};

export default Resume;
