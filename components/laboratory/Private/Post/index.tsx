import React from "react";

import dynamic from "next/dynamic";
// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import IconCircleWrapper from "@/components/fragments/IconCircleWrapper";
import Loading from "@/components/fragments/Loading";
import SectionHeader from "@/components/fragments/SectionHeader";
import TechTags from "@/components/fragments/TechTags";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { LabEntryData } from "@/interfaces/LabEntry";

import LabEntryLinks from "../../common/LabEntryLinks";

const GalleryCarousel = dynamic(() => import("@/components/fragments/Gallery/GalleryCarousel"), {
	ssr: false,
	loading: () => (
		<Loading className="h-auto w-auto max-h-[74vh] mx-auto" maxHeight="100%" scale={4} />
	),
});

interface Props {
	className?: string;
	labEntry: LabEntryData;
	tags: TagData[] | null;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	iconsMap: IconsMap;
}

const LabPublicEntry: React.FC<Props> = ({
	className,
	labEntry,
	tags,
	fileList,
	iconList,
	iconsMap,
}) => {
	const descriptionArr = labEntry.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	const gallery = labEntry?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	// If we need to display the attachment within the gallery we can add it there;
	// Right now the attachment is only used for the blog post card's cover image.
	// gallery =
	// 	post?.html?.attachment && gallery
	// 		? [post?.html?.attachment.metadata.html].concat(gallery)
	// 		: gallery;

	const dtFrom = new Date(labEntry.dateFrom);
	const dateLabel = format(dtFrom, "dd MMM yyyy", { locale: en });

	// lab-entry-update-button

	return (
		<div className={cn("w-full pt-8 sa:pt-6 lg:pt-1", className)}>
			<GalleryCarousel entryData={labEntry} gallery={gallery} navPosition="bottom" navType="none" />
			<SectionHeader
				className="pop-header mt-6 1xl:mt-[1.15rem] relative justify-end"
				className_Actions="absolute right-0 -bottom-3"
				iconComponent={
					<IconCircleWrapper
						alt={labEntry.title}
						className="min-w-[3.74rem] w-[3.74rem] min-h-[3.74rem] h-[3.74rem] drop-shadow-2xl"
						className_Image="size-12"
						src={
							labEntry.html.icon?.metadata.html.fileUrl || labEntry.html.icon?.metadata.html.fileUri
						}
						unoptimized={labEntry.html.icon?.filename.match(/\.svg$/) ? true : false}
					/>
				}
				label={dateLabel}
				title={labEntry.html.title}
			>
				<LabEntryLinks
					fileList={fileList}
					iconList={iconList}
					iconsMap={iconsMap}
					labEntry={labEntry}
					tags={tags}
				/>
			</SectionHeader>

			{/* @see https://github.com/tailwindlabs/tailwindcss-typography */}
			<article className="prose lg:prose-lg max-w-none xa:text-justify">
				<div
					dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
					className="font-semibold tracking-wide text-xl"
				/>
				{descriptionArr.length > 1 && (
					<div dangerouslySetInnerHTML={{ __html: descriptionArr[1] }} className="post-body" />
				)}
			</article>

			<TechTags className="mt-20" iconsMap={iconsMap} tags={labEntry.tags} />
		</div>
	);
};

export default LabPublicEntry;
