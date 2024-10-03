import React from "react";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";
import { AboutEntryType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import AboutEntryCard from "../common/Card";
import CreateAboutEntry from "./Actions/Create";

interface Props {
	className?: string;
	type: AboutEntryType;
	visibleItems?: number;
	entries: AboutEntryData[] | null;
	fileList: FileListItem[] | null;
	iconsMap: IconsMap;
	tags: TagData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({
	className,
	type,
	visibleItems = 3,
	entries,
	fileList,
	iconsMap,
	tags,
}) => {
	const t = msgs("AboutEntries");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	// Filter the items by their type - i.e. ["employment", "education", ...]
	const entriesByType = entries
		?.filter(({ entryType }) => entryType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div
			className={cn("about-cards-section list-section scroll-mt-24 3xl:scroll-mt-8", className)}
			id={toggle_target_id}
		>
			<SectionHeader title={section_title}>
				<RevalidatePaths paths={[Route.public.ABOUT.uri]} />
				<CreateAboutEntry fileList={fileList} iconsMap={iconsMap} tags={tags} type={type} />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>
			<div className="about-cards-section-items space-y-14">
				{entriesByType?.map((entry, index) => (
					<AboutEntryCard
						key={index}
						displayGalleryInline
						className={visibleItems > index ? "" : "section-card-collapsible"}
						entry={entry}
						fileList={fileList}
						iconsMap={iconsMap}
						tags={tags}
					/>
				))}
			</div>
		</div>
	);
};

export default TimeLine;
