import React from "react";

import { LabEntryPropertyType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";

import { LabEntryData } from "@/interfaces/LabEntry";

import { IconsMap } from "@/interfaces/IconsMap";

import SectionHeader from "@/components/fragments/SectionHeader";
import { msgs } from "@/messages";

import LabEntryPublic_Card from "./Card";

interface Props {
	className?: string;
	labEntryPropertyType: LabEntryPropertyType;
	labEntries: LabEntryData[] | null;
	iconsMap: IconsMap;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"...
 */
const TimeLine: React.FC<Props> = ({ className, labEntries, labEntryPropertyType, iconsMap }) => {
	const t = msgs("LabEntries");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_by_property_${labEntryPropertyType}` as tType);

	const labEntriesByPropertyType = labEntries
		?.filter(({ propertyType }) => propertyType === labEntryPropertyType)
		?.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={cn("laboratory-cards-section scroll-mt-24 3xl:scroll-mt-8", className)}>
			<SectionHeader title={section_title} />
			<div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
				{labEntriesByPropertyType?.map((labEntry, index) => (
					<LabEntryPublic_Card key={index} className="" iconsMap={iconsMap} labEntry={labEntry} />
				))}
			</div>
		</div>
	);
};

export default TimeLine;
