import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import DisplayFileImage from "@/components/fragments/DisplayFileImage";
import DisplayIcon from "@/components/fragments/DisplayIcon";
import Gallery from "@/components/fragments/Gallery";
import RedirectToUri from "@/components/fragments/RedirectToUri";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { FileData, FileListItem } from "@/interfaces/File";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import DisplayResourceUrlAsIcon from "../../common/DisplayResourceUrlAsIcon";
import DeleteProject from "../Actions/Delete";
import UpdateProject from "../Actions/Update";
import styles from "./_card.module.scss";

interface Props {
	className?: string;
	project: ProjectData;
	files?: FileListItem[] | null | undefined;
	tags?: TagData[] | null | undefined;
	displayActions?: boolean;
	displayTagsInline?: boolean;
	displayGalleryInline?: boolean;
}

const ProjectAdminCard: React.FC<Props> = ({
	project,
	className,
	files,
	tags,
	displayActions = true,
	displayTagsInline = true,
	displayGalleryInline = true,
}) => {
	const tTime = msgs("Projects_Form");
	const tCommon = msgs("Projects");

	const { dateFrom, dateTo } = project;
	const dtFrom = new Date(dateFrom);
	const dtTo = dateTo ? new Date(dateTo) : undefined;
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`entry_${project?._id.toString()}`);
	const descriptionArr = project.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	let gallery = project?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		project?.html?.attachment && gallery
			? [project?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	gallery =
		project?.html?.icon && gallery ? [project?.html?.icon.metadata.html].concat(gallery) : gallery;

	const haveGallery = gallery && gallery.length > 0;

	return (
		<div className={`card-borer-wrapper ${className}`} id={toggle_target_id}>
			<div className={styles.card}>
				<div className={styles.info}>
					<div className={styles.date}>
						<span>
							{/* <span className={styles.lightSecondaryText}>
							{format(dtFrom, "MM/", { locale: en })}
						</span> */}
							<span className={styles.lightPrimaryText}>
								{format(dtFrom, "yyyy", { locale: en })}
							</span>
						</span>
						<span className={styles.lightPrimaryText}>{" - "}</span>
						{dtTo ? (
							<span>
								{/* <span className={styles.lightSecondaryText}>
								{format(dtTo, "MM/", { locale: en })}
							</span> */}
								<span className={styles.lightPrimaryText}>
									{format(dtTo, "yyyy", { locale: en })}
								</span>
							</span>
						) : (
							<span className={styles.lightPrimaryText}>{tTime("dateTo_now_current")}</span>
						)}
					</div>

					{project.slug && (
						<div className={`${styles.slug} ${styles.lightSecondaryText}`}>/{project.slug}</div>
					)}

					<div className={styles.projectLinks}>
						<div className={styles.iconWrapper}>
							<DisplayResourceUrlAsIcon size={23} type="home" url={project.urlHome} />
						</div>
						<div className={styles.iconWrapper}>
							<DisplayResourceUrlAsIcon size={28} type="repo" url={project.urlRepo} />
						</div>
					</div>
				</div>
				<div className={styles.header}>
					<div
						className={`${styles.buttons} ${displayActions ? "w-44" : haveGallery ? "w-16" : "w-8"}`}
					>
						<div className={styles.buttonsContainer}>
							{displayActions ? (
								<>
									<DeleteProject project={project} />
									<RedirectToUri uri={project.html.attachment?.metadata.html.fileUri} />
									<Gallery entry={project} gallery={gallery} />
									<UpdateProject files={files} project={project} tags={tags} />
								</>
							) : (
								<>{haveGallery && <Gallery entry={project} gallery={gallery} />}</>
							)}
							<ToggleCollapsible
								tooltip
								className="icon_accent_primary"
								target_id={toggle_target_id}
								text={[tCommon("btnMore"), tCommon("btnLess")]}
								type={descriptionArr[1] ? "card" : "card-single-item"}
							/>
						</div>
					</div>
					<div dangerouslySetInnerHTML={{ __html: project.html.title }} className={styles.title} />
				</div>
				<div className={`${styles.description} md-processed-to-html`}>
					<div className="prose max-w-none">
						{descriptionArr.map((description, index, arr) => (
							<div
								dangerouslySetInnerHTML={{ __html: description }}
								key={index}
								className={
									index === 0
										? arr.length > 1
											? "card-item-static font-semibold"
											: "card-single-item font-semibold"
										: "card-item-collapsible"
								}
							/>
						))}
					</div>

					{displayTagsInline && (
						<div className="card-item-collapsible--disabled mt-4">
							<div className="about-entry-tags">
								{project.tags
									?.sort((a, b) =>
										a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
									)
									.map((tag) => (
										<DisplayIcon
											key={tag._id}
											description={tag.html.description}
											icon={iconsMap[tag.icon as IconsMapItem]}
										/>
									))}
							</div>
						</div>
					)}

					{displayGalleryInline && gallery && gallery.length > 0 && (
						<div className="card-item-collapsible--disabled">
							<div className="flex gap-2 flex-wrap p-0 mt-4">
								{gallery.map((image, index) => (
									<DisplayFileImage
										key={index}
										className={`w-8 h-8 rounded-sm`}
										description={image.filename}
										file={
											{
												filename: image.filename,
												metadata: {
													html: {
														fileUri: image.fileUri,
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

export default ProjectAdminCard;
