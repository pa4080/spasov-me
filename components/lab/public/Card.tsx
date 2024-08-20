import Link from "next/link";
import React from "react";

import styles from "@/app/(styles)/card.module.scss";
import IconCircleWrapper from "@/components/fragments/IconCircleWrapper";
import { Button } from "@/components/ui/button";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { LabEntryData } from "@/interfaces/LabEntry";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import PostLinks from "../common/PostLinks";

interface Props {
	className?: string;
	labEntry: LabEntryData;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	iconsMap: IconsMap;
	tags: TagData[] | null;
}

const LabEntryPublic_Card: React.FC<Props> = ({
	labEntry,
	className,
	fileList,
	iconList,
	tags,
	iconsMap,
}) => {
	const t = msgs("Posts_CardPublic");

	// !!! Make sure the private part of the description doesn't goes public !!!
	// !!! We are on the server side here !!!
	const descriptionArr = labEntry.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		<div className={`${styles.card} group scroll-m-8 ${className}`} id={`lab_${labEntry._id}`}>
			{/* Header image */}
			{/* <div className="w-full h-0 pt-[56.25%] relative">
				<div className="w-full absolute inset-0 rounded-md overflow-hidden group-hover:shadow-lg">
					{labEntry.html.attachment && (
						<DisplayFileImageOrEmbed
							className={cn("w-auto mx-auto h-auto")}
							file={labEntry.html.attachment}
							sizes={["360px", "600px"]}
						/>
					)}
				</div>
			</div> */}

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
			<div className="flex flex-row items-center justify-between gap-2 w-full">
				<PostLinks
					fileList={fileList}
					iconList={iconList}
					iconsMap={iconsMap}
					labEntry_urlHome={labEntry.urlHome}
					tags={tags}
				/>
				<Link
					area-label={t("area_label_card_link")}
					href={`${Route.public.LAB.uri}/${labEntry.slug}`}
				>
					<Button
						className="transition-colors duration-300 hover:duration-150"
						size="sm"
						variant="defaultSecondary"
					>
						{t("button_call_to_action")}
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default LabEntryPublic_Card;
