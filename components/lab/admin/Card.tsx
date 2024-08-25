import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import Link from "next/link";

import styles from "@/app/(styles)/card-info.module.scss";
import DisplayFileImage from "@/components/fragments/DisplayFileImage";
import DisplayIcon from "@/components/fragments/DisplayIcon";
import FileAddressHandle from "@/components/fragments/FileAddressHandle";
import Gallery from "@/components/fragments/Gallery";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import VisibilitySwitchDisplay from "@/components/fragments/VisibilitySwitchDisplay";
import { FileData, FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { LabEntryData } from "@/interfaces/LabEntry";

import DisplayConditionally_ResourceButtons from "../common/DisplayConditionally_ResourceButtons";
import DeleteLabEntry from "./Actions/Delete";
import UpdateLabEntry from "./Actions/Update";

interface Props {
	className?: string;
	labEntry: LabEntryData;
	displayTagsInline?: boolean;
	displayGalleryInline?: boolean;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	iconsMap: IconsMap;
	tags: TagData[] | null;
}

const LabEntryAdminCard: React.FC<Props> = ({
	labEntry,
	className,
	displayTagsInline = true,
	displayGalleryInline = true,
	fileList,
	iconList,
	iconsMap,
	tags,
}) => {
	// const tTime = msgs("Posts_Form");
	const tCommon = msgs("Posts");

	const { dateFrom, dateTo } = labEntry;
	const dtFrom = new Date(dateFrom);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const dtTo = dateTo ? new Date(dateTo) : undefined;
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`entry_${labEntry?._id.toString()}`);
	const descriptionArr = labEntry.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	let gallery = labEntry?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		labEntry?.html?.attachment && gallery
			? [labEntry?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	// This is disabled because the "icon" usually is SVG with a transparent background
	// and looks ugly within the container which have the site logo oas background
	// gallery =
	// 	post?.html?.icon && gallery ? [post?.html?.icon.metadata.html].concat(gallery) : gallery;

	return (
		<div className={`card-border-wrapper ${className}`} id={toggle_target_id}>
			<div className={styles.card}>
				<div className={styles.info}>
					<div className={styles.date}>
						<span>
							<span className={styles.lightPrimaryText}>
								{format(dtFrom, "dd.MM.yyyy", { locale: en })}
							</span>
						</span>
					</div>

					{labEntry.slug && (
						<div className={`${styles.slug} ${styles.lightSecondaryText}`}>
							<Link href={`${Route.public.LAB.uri}/${labEntry.slug}`}>/{labEntry.slug}</Link>
						</div>
					)}

					<div className={`${styles.linksProjectPost} scale-90 origin-left`}>
						<div className={styles.iconWrapper}>
							<DisplayConditionally_ResourceButtons
								className="grayscale-[100%] hover:grayscale-[20%] opacity-90"
								entryUrl={labEntry.urlHome}
								entryVisibilityType={labEntry.visibilityType}
								iconType="globe-pointer"
								icon_className_Path1="fill-accent-secondary"
								icon_className_Path2="fill-accent"
								isPrivateOnly={false}
								linkType="Home Page"
								size={23}
							/>
						</div>
						<div className={styles.iconWrapper}>
							<DisplayConditionally_ResourceButtons
								className="grayscale-[100%] hover:grayscale-[20%] opacity-90"
								entryUrl={labEntry.urlAdmin}
								entryVisibilityType={labEntry.visibilityType}
								height={23}
								iconType="user-shield"
								icon_className_Path1="fill-accent-secondary"
								icon_className_Path2="fill-accent"
								linkType="Admin Page"
								width={32}
							/>
						</div>
						<div className={styles.iconWrapper}>
							<DisplayConditionally_ResourceButtons
								className="grayscale-[100%] hover:grayscale-[20%] opacity-90 ml-1"
								entryUrl={labEntry.urlSource}
								entryVisibilityType={labEntry.visibilityType}
								height={23}
								iconType="dice-d6"
								icon_className_Path1="fill-accent-secondary"
								icon_className_Path2="fill-accent"
								linkType="Source"
								width={24}
							/>
						</div>
					</div>
				</div>
				<div className={styles.header}>
					<div className={styles.buttons}>
						<div className={styles.buttonsContainer}>
							<Gallery
								className="mt-0.5"
								entry={labEntry}
								gallery={gallery}
								height={24}
								width={32}
							/>
							<FileAddressHandle
								address={
									labEntry.html.attachment?.metadata?.html?.fileUri ||
									labEntry.html.attachment?.metadata?.html?.fileUrl ||
									""
								}
							/>
							<DeleteLabEntry labEntry={labEntry} />
							<VisibilitySwitchDisplay disabled checked={labEntry.visibility} className="mt-0.5" />
							<UpdateLabEntry
								fileList={fileList}
								iconList={iconList}
								iconsMap={iconsMap}
								labEntry={labEntry}
								tags={tags}
							/>
							<ToggleCollapsible
								tooltip
								className="icon_accent_primary"
								target_id={toggle_target_id}
								text={[tCommon("btnMore"), tCommon("btnLess")]}
								type={descriptionArr[1] ? "card" : "card-item-single"}
							/>
						</div>
					</div>
					<div
						dangerouslySetInnerHTML={{ __html: labEntry?.html?.title || "" }}
						className={styles.title}
					/>
				</div>
				<div className={`${styles.description} md-processed-to-html`}>
					<div className="prose max-w-none">
						{descriptionArr.map((description, index, arr) => (
							<div
								dangerouslySetInnerHTML={{ __html: description || "" }}
								key={index}
								className={
									index === 0
										? arr.length > 1
											? "card-item-static font-semibold admin-projects-card"
											: "card-item-single font-semibold"
										: "card-item-collapsible"
								}
							/>
						))}
					</div>

					{displayTagsInline && (
						<div className="card-item-collapsible--disabled mt-4">
							<div className="about-entry-tags">
								{labEntry.tags
									?.sort((a, b) =>
										a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
									)
									.map((tag) => (
										<DisplayIcon
											key={tag._id}
											description={tag.html.description}
											icon={iconsMap[tag.icon]}
										/>
									))}
							</div>
						</div>
					)}

					{displayGalleryInline && ((gallery && gallery.length > 0) || labEntry?.html?.icon) && (
						<div className="card-item-collapsible--disabled">
							<div className="flex gap-2 flex-wrap p-0 mt-4">
								{[labEntry?.html?.icon?.metadata?.html, ...(gallery || [])].map((image, index) => (
									<DisplayFileImage
										key={index}
										className={`w-8 h-8 rounded-sm`}
										description={image?.filename}
										file={
											{
												filename: image?.filename,
												metadata: {
													html: {
														fileUri: image?.fileUri || image?.fileUrl,
													},
												},
											} as FileData
										}
										sizes={["32px", "32px"]}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LabEntryAdminCard;
