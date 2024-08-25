"use client";

import Gallery from "@/components/fragments/Gallery";
import TooltipWrapper from "@/components/fragments/TooltipWrapper";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { msgs } from "@/messages";

import DisplayResourceUrlAsIcon from "@/components/fragments/DisplayResourceUrlAsIcon";

import UpdateProject from "../admin/Actions/Update";

interface Props {
	project: ProjectData;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	iconsMap: IconsMap;
	tags: TagData[] | null;
}

const ProjectLinks: React.FC<Props> = ({ project, fileList, iconList, iconsMap, tags }) => {
	const t = msgs("Projects_CardPublic");

	let gallery = project?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		project?.html?.attachment && gallery
			? [project?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	const iconWrapper =
		"fill-foreground-tertiary hover:fill-accent flex items-center justify-center h-full if-empty-display-none";

	return (
		<div className="pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7">
			<div className={iconWrapper}>
				<DisplayResourceUrlAsIcon
					className="grayscale-[100%] hover:grayscale-[0%]"
					iconType="globe-pointer"
					icon_className_Path1="fill-accent-secondary"
					icon_className_Path2="fill-accent"
					label={t("tooltip_link", { linkType: "Homepage" })}
					size={23}
					url={project.urlHome}
				/>
			</div>

			<div className={iconWrapper}>
				<DisplayResourceUrlAsIcon
					className="grayscale-[100%] hover:grayscale-[0%] ml-1"
					height={23}
					iconType="dice-d6"
					icon_className_Path1="fill-accent-secondary"
					icon_className_Path2="fill-accent"
					label={t("tooltip_link", { linkType: "Repository" })}
					url={project.urlRepo}
					width={24}
				/>
			</div>

			<div className={iconWrapper}>
				<TooltipWrapper
					className="w-full h-full flex items-center fill-inherit"
					tooltipText={t("tooltip_gallery")}
				>
					<Gallery entry={project} gallery={gallery} />
				</TooltipWrapper>
			</div>

			<div className={iconWrapper}>
				<TooltipWrapper
					className="w-full h-full flex items-center fill-inherit ml-0.5"
					tooltipText={t("tooltip_update")}
				>
					<UpdateProject
						fileList={fileList}
						iconList={iconList}
						iconsMap={iconsMap}
						project={project}
						tags={tags}
					/>
				</TooltipWrapper>
			</div>
		</div>
	);
};

export default ProjectLinks;
