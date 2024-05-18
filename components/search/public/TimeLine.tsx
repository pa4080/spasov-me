import React from "react";

import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { AboutEntryType } from "@/interfaces/_common-data-types";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import AboutEntryCard from "../common/Card";

interface Props {
	className?: string;
	type: AboutEntryType;
	visibleItems?: number;
	entries: AboutEntryData[] | null;
	displayTags: boolean;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({ type, visibleItems = 3, entries, displayTags }) => {
	const t = msgs("AboutEntries");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	const entriesByType = entries
		?.filter(({ entryType }) => entryType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		entriesByType &&
		entriesByType.length > 0 && (
			<div className="list-section" id={toggle_target_id}>
				<SectionHeader className="pop-header h-12" title={section_title}>
					{entriesByType && entriesByType?.length > visibleItems && (
						<ToggleCollapsible
							tooltip
							target_id={toggle_target_id}
							text={[t("btnAll"), t("btnLess")]}
							type="section"
						/>
					)}
				</SectionHeader>
				<div className="about-cards-section-items space-y-14">
					{entriesByType?.map((entry, index) => (
						<AboutEntryCard
							key={index}
							className={visibleItems > index ? "pop-item" : "section-card-collapsible pop-item"}
							displayTagsInline={displayTags}
							entry={entry}
						/>
					))}
				</div>
			</div>
		)
	);
};

export default TimeLine;
