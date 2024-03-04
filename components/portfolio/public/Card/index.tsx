import React from "react";

// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates

import Image from "next/image";

import Link from "next/link";

import { FileListItem } from "@/interfaces/File";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { Route } from "@/routes";

import { Button } from "@/components/ui/button";

import { msgs } from "@/messages";

import Gallery from "@/components/fragments/Gallery";

import TooltipWrapper from "../../../fragments/TooltipWrapper";
import DisplayResourceUrlAsIcon from "../../common/DisplayResourceUrlAsIcon";
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

const ProjectPublicCard: React.FC<Props> = ({ project, className }) => {
	const t = msgs("Projects_CardPublic");

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

	return (
		<div className={`${styles.cardWrapper} ${className}`} id={`project_${project._id}`}>
			<div className={styles.card}>
				<div className="flex gap-2 items-center justify-start w-full">
					<div className="rounded-full p-1 overflow-clip bg-primary/80 min-w-[3rem]">
						<Image
							alt={project.title}
							className="size-10"
							height={44}
							src={project.html.icon?.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER}
							width={44}
						/>
					</div>
					<div
						dangerouslySetInnerHTML={{ __html: project.html.title }}
						className="text-lg font-semibold line-clamp-1 flex-shrink"
					/>
				</div>
				<div
					dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
					className="flex-grow line-clamp-2 text-sm pl-2"
				/>

				<div className={styles.projectFooter}>
					<div className={styles.projectLinks}>
						<div className={styles.iconWrapper}>
							<DisplayResourceUrlAsIcon size={23} type="home" url={project.urlHome} />
						</div>
						<div className={styles.iconWrapper}>
							<DisplayResourceUrlAsIcon size={28} type="repo" url={project.urlRepo} />
						</div>
						<div className={styles.iconWrapper}>
							<TooltipWrapper
								className="w-full h-full flex items-center -ml-1 fill-inherit"
								tooltipText={t("tooltip_gallery")}
							>
								<Gallery
									dialogTrigger_buttonIconProps={{
										className:
											"p-0 bg-transparent hover:bg-transparent m-0 h-full fill-inherit grayscale-0",
										widthOffset: 0,
										heightOffset: 0,
										width: 27,
										height: 26,
										iconEmbedSvgProps: {
											className_Path1: "fill-transparent",
											className_Path2: "fill-inherit",
										},
									}}
									entry={project}
									gallery={gallery}
								/>
							</TooltipWrapper>
						</div>
					</div>

					<Link href={`${Route.public.PORTFOLIO.uri}/${project.slug}`}>
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
		</div>
	);
};

export default ProjectPublicCard;
