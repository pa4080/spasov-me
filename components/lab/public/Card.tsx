import React from "react";

import styles from "@/app/(styles)/card.module.scss";

import IconCircleWrapper from "@/components/fragments/IconCircleWrapper";
import { LabEntryData } from "@/interfaces/LabEntry";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { IconsMap } from "@/interfaces/IconsMap";

import { msgs } from "@/messages";

import TooltipWrapper from "@/components/fragments/TooltipWrapper";

import { cn } from "@/lib/cn-utils";

import LabEntryLinks from "../common/LabEntryLinks";
import ShowDetailsOrTags from "../common/ShowDetailsOrTags";

interface Props {
	className?: string;
	labEntry: LabEntryData;
	iconsMap: IconsMap;
}

const LabEntryPublic_Card: React.FC<Props> = ({ labEntry, className, iconsMap }) => {
	// !!! Make sure the private part of the description doesn't goes public !!!
	// !!! We are on the server side here !!!
	const descriptionArr = labEntry.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	const t = msgs("LabEntries_CardPublic");

	type tType = Parameters<typeof t>[0];

	const label = t(`label_by_property_${labEntry.propertyType}` as tType);
	const tooltip = t(`label_tooltip_by_property_${labEntry.propertyType}` as tType);

	return (
		<div className={cn("display-wrapper scroll-m-8", className)}>
			<div className={styles.card} id={`lab_${labEntry._id}`}>
				{/* Logo and Title */}
				<div className="flex gap-2 items-center justify-start w-full relative">
					<IconCircleWrapper
						alt={labEntry.title}
						src={
							labEntry.html.icon?.metadata.html.fileUrl || labEntry.html.icon?.metadata.html.fileUri
						}
						unoptimized={labEntry.html.icon?.filename.match(/\.svg$/) ? true : false}
					/>

					<div
						dangerouslySetInnerHTML={{ __html: labEntry.html.title }}
						className="text-lg font-semibold line-clamp-2 flex-shrink leading-5 text-balance"
					/>

					<TooltipWrapper className="absolute -right-4 -top-4 cursor-default" tooltipText={tooltip}>
						<span className="font-unicephalon text-sm text-primary-foreground">{label}</span>
					</TooltipWrapper>
				</div>

				{/* Description */}
				<div
					dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
					className="flex-grow line-clamp-2 pl-2"
				/>

				{/* Footer buttons */}

				<div className="flex flex-col 2xs:flex-row items-stretch justify-between gap-4 2xs:gap-2 w-full -mb-1 min-h-9">
					<LabEntryLinks
						className="max-2xs:self-start pl-1 2xs:pl-0 translate-y-0.5"
						labEntry={labEntry}
					/>
					<ShowDetailsOrTags iconsMap={iconsMap} slug={labEntry.slug} tags={labEntry.tags} />
				</div>
			</div>
		</div>
	);
};

export default LabEntryPublic_Card;
