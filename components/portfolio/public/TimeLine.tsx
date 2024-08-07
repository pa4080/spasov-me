import React from "react";

import { ProjectData } from "@/interfaces/Project";
import { ProjectType } from "@/interfaces/_common-data-types";

import { cn } from "@/lib/cn-utils";

import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";

import ProjectPublic_Card from "./Card";

interface Props {
	className?: string;
	type?: ProjectType;
	projects: ProjectData[] | null;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	iconsMap: IconsMap;
	tags: TagData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"...
 *
 * We won't filter the projects by type because we want to show all projects,
 * ordered by date... probably we need may indicate the type by a icon?(!?)
 */
const TimeLine: React.FC<Props> = ({ className, projects, fileList, iconList, iconsMap, tags }) => {
	const projectsByType = projects?.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={cn("portfolio-cards-section scroll-m-8", className)}>
			<div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
				{projectsByType?.map((project, index) => (
					<ProjectPublic_Card
						key={index}
						fileList={fileList}
						iconList={iconList}
						iconsMap={iconsMap}
						project={project}
						tags={tags}
					/>
				))}
			</div>
		</div>
	);
};

export default TimeLine;
