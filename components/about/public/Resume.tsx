import React from "react";

import SectionHeader from "@/components/fragments/section-header";
import ToggleCollapsible from "@/components/fragments/toggle-collapsible";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { AboutEntryType } from "@/interfaces/_dataTypes";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";

import styles from "../_about.module.scss";
import cardStyles from "../common/entry-card/_entry-card.module.scss";

interface Props {
	entries: AboutEntryData[] | null;
	className?: string;
	type: AboutEntryType;
}

const Resume: React.FC<Props> = ({ entries, className, type }) => {
	const t = msgs("AboutCV");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = `section_${type}`;

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
				<SectionHeader title={section_title}>
					<ToggleCollapsible
						target_id={toggle_target_id}
						text={[t("btnAll"), t("btnLess")]}
						type="section"
					/>
				</SectionHeader>

				<div className={`${cardStyles.card}`}>
					<div className={cardStyles.description}>
						<div
							dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
							className="section-card-static"
						/>
						{descriptionArr[1] && (
							<div
								dangerouslySetInnerHTML={{ __html: descriptionArr[1] ?? "" }}
								className="mt-4 section-card-collapsible"
							/>
						)}
					</div>
				</div>
			</div>
		)
	);
};

export default Resume;
