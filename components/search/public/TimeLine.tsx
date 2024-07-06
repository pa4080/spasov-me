import React from "react";

import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

import SearchResultEntryCard from "../common/Card";

import { IconsMap } from "@/interfaces/IconsMap";
import { UnitedEntryType } from ".";

interface Props {
	className?: string;
	type: UnitedEntryType["entryType"];
	visibleItems?: number;
	entries: UnitedEntryType[] | null;
	displayTags: boolean;
	iconsMap: IconsMap;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({ type, visibleItems = 15, entries, displayTags, iconsMap }) => {
	const t = msgs("Search");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	const entriesByType = entries
		?.filter(({ entryType }) => entryType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		entriesByType &&
		entriesByType.length > 0 && (
			<div className="list-section scroll-m-8" id={toggle_target_id}>
				<SectionHeader className="pop-header h-12" title={section_title}>
					<ToggleCollapsible
						tooltip
						disabled={entriesByType && entriesByType?.length <= visibleItems}
						target_id={toggle_target_id}
						text={[t("btnAll"), t("btnLess")]}
						type="section"
					/>
				</SectionHeader>
				<div className="about-cards-section-items space-y-14">
					{entriesByType?.map((entry, index) => (
						<SearchResultEntryCard
							key={index}
							iconsMap={iconsMap}
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
