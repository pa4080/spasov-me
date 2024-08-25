import React from "react";

import styles from "@/app/(styles)/card.module.scss";

import IconCircleWrapper from "@/components/fragments/IconCircleWrapper";
import { LabEntryData } from "@/interfaces/LabEntry";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { IconsMap } from "@/interfaces/IconsMap";

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

	return (
		<div className={`${styles.card} group scroll-m-8 ${className}`} id={`lab_${labEntry._id}`}>
			{/* Logo and Title */}
			<div className="flex gap-2 items-center justify-start w-full">
				<IconCircleWrapper
					alt={labEntry.title}
					src={
						labEntry.html.icon?.metadata.html.fileUrl || labEntry.html.icon?.metadata.html.fileUri
					}
					unoptimized={labEntry.html.icon?.filename.match(/\.svg$/) ? true : false}
				/>

				<div
					dangerouslySetInnerHTML={{ __html: labEntry.html.title }}
					className="text-lg font-semibold line-clamp-2 flex-shrink leading-5"
				/>
			</div>

			{/* Description */}
			<div
				dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
				className="flex-grow line-clamp-2 pl-2"
			/>

			{/* Footer buttons */}
			<div className="flex flex-row items-center justify-between gap-2 w-full -mb-1 min-h-9">
				<LabEntryLinks labEntry={labEntry} />
				<ShowDetailsOrTags iconsMap={iconsMap} slug={labEntry.slug} tags={labEntry.tags} />
			</div>
		</div>
	);
};

export default LabEntryPublic_Card;
