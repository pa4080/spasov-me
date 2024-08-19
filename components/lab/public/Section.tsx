import React from "react";

import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";
import { LabEntryPropertyType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";

import { LabEntryData } from "@/interfaces/LabEntry";

import BlogPublic_Card from "./Card";

interface Props {
	className?: string;
	labEntryPropertyType: LabEntryPropertyType;
	labEntries: LabEntryData[] | null;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	tags: TagData[] | null;
	iconsMap: IconsMap;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"...
 */
const Section: React.FC<Props> = ({
	className,
	labEntries,
	fileList,
	iconList,
	tags,
	iconsMap,
	labEntryPropertyType,
}) => {
	const labEntriesByPropertyType = labEntries
		?.filter(({ propertyType }) => propertyType === labEntryPropertyType)
		?.sort((b, a) => a.title.localeCompare(b.title));

	return (
		<div className={cn("portfolio-cards-section scroll-m-8", className)}>
			<div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
				{labEntriesByPropertyType?.map((labEntry, index) => (
					<BlogPublic_Card
						key={index}
						className=""
						fileList={fileList}
						iconList={iconList}
						iconsMap={iconsMap}
						labEntry={labEntry}
						tags={tags}
					/>
				))}
			</div>
		</div>
	);
};

export default Section;
