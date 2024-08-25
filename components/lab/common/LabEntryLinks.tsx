"use client";

import Link from "next/link";

import { LabEntryData } from "@/interfaces/LabEntry";

import { msgs } from "@/messages";

import Gallery from "@/components/fragments/Gallery";
import TooltipWrapper from "@/components/fragments/TooltipWrapper";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";

import { useClickButtonByDomId } from "@/hooks/useClickButtonByDomId";

import { Route } from "@/routes";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";

import { cn } from "@/lib/cn-utils";

import DisplayConditionally from "../../fragments/DisplayConditionally";
import UpdateLabEntry from "../admin/Actions/Update";
import DisplayConditionally_ResourceButtons from "./DisplayConditionally_ResourceButtons";

interface Props {
	labEntry: LabEntryData;
	tags?: TagData[] | null;
	fileList?: FileListItem[] | null;
	iconList?: FileListItem[] | null;
	iconsMap?: IconsMap;
}

const LabEntryLinks: React.FC<Props> = ({ labEntry, tags, fileList, iconList, iconsMap }) => {
	useClickButtonByDomId();
	const t = msgs("LabEntries_CardPublic");

	let gallery = labEntry?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		labEntry?.html?.attachment && gallery
			? [labEntry?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	const iconWrapper =
		"fill-foreground-tertiary hover:fill-ring-secondary flex items-center justify-center h-full if-empty-display-none";

	return (
		<div className="pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7">
			<div className={iconWrapper}>
				<DisplayConditionally_ResourceButtons
					entryUrl={labEntry.urlHome}
					entryVisibilityType={labEntry.visibilityType}
					iconType="globe-pointer"
					icon_className_Path1="fill-accent-secondary"
					icon_className_Path2="fill-accent"
					isPrivateOnly={false}
					linkType="Home Page"
				/>
			</div>

			<div className={iconWrapper}>
				<DisplayConditionally_ResourceButtons
					entryUrl={labEntry.urlAdmin}
					entryVisibilityType={labEntry.visibilityType}
					iconType="user-shield"
					icon_className_Path1="fill-accent-secondary"
					icon_className_Path2="fill-accent"
					linkType="Admin Page"
					width={32}
				/>
			</div>

			<div className={iconWrapper}>
				<DisplayConditionally_ResourceButtons
					className="ml-1"
					entryUrl={labEntry.urlSource}
					entryVisibilityType={labEntry.visibilityType}
					iconType="dice-d6"
					icon_className_Path1="fill-accent-secondary"
					icon_className_Path2="fill-accent"
					linkType="Source"
					width={24}
				/>
			</div>

			{tags && fileList && iconList && iconsMap ? (
				<>
					<div className={iconWrapper}>
						<TooltipWrapper
							className="w-full h-full flex items-center fill-inherit"
							tooltipText={t("tooltip_gallery")}
						>
							<Gallery entry={labEntry} gallery={gallery} />
						</TooltipWrapper>
					</div>
					<div className={iconWrapper}>
						<TooltipWrapper
							className="w-full h-full flex items-center fill-inherit ml-0.5"
							tooltipText={t("tooltip_gallery")}
						>
							<UpdateLabEntry
								fileList={fileList}
								iconList={iconList}
								iconsMap={iconsMap}
								labEntry={labEntry}
								tags={tags}
							/>
						</TooltipWrapper>
					</div>
				</>
			) : (
				<DisplayConditionally>
					<>
						<div className={iconWrapper}>
							<Link href={`${Route.public.LAB.uri}/${labEntry.slug}?id=gallery-open-button`}>
								<IconEmbedSvg
									className={cn(
										gallery?.length === 0
											? "grayscale-[100%] hover:grayscale-[100%] opacity-40"
											: "grayscale-[100%] hover:grayscale-[0%]"
									)}
									className_Path1="fill-accent-secondary"
									className_Path2="fill-accent"
									cursor={gallery?.length === 0 ? "not-allowed" : "pointer"}
									height={23}
									type={"box-circle-check"}
									width={30}
								/>
							</Link>
						</div>
						<div className={iconWrapper}>
							<Link href={`${Route.public.LAB.uri}/${labEntry.slug}?id=lab-entry-update-button`}>
								<IconEmbedSvg
									className="grayscale-[100%] hover:grayscale-[0%]"
									className_Path1="fill-accent-secondary"
									className_Path2="fill-accent"
									height={23}
									type={"screwdriver-wrench"}
									width={24}
								/>
							</Link>
						</div>
					</>
				</DisplayConditionally>
			)}
		</div>
	);
};

export default LabEntryLinks;
