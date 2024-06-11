import React from "react";

import CreateFile from "@/components/files-cloudflare/admin/Actions/CreateFile";
import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { ProjectData } from "@/interfaces/Project";
import { ProjectType } from "@/interfaces/_common-data-types";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { cn } from "@/lib/cn-utils";

import { FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import CreateProject from "./Actions/Create";
import ProjectAdminCard from "./Card";

interface Props {
	className?: string;
	type: ProjectType;
	visibleItems?: number;
	projects: ProjectData[] | null;
	fileList: FileListItem[] | null;
	tags: TagData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({
	className,
	type,
	visibleItems = 3,
	projects,
	fileList,
	tags,
}) => {
	const t = msgs("Projects");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	// Filter the items by their type - i.e. ["informationTechnologies", "education", ...]
	const projectsByType = projects
		?.filter(({ entryType }) => entryType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={cn("portfolio-admin-section list-section scroll-m-8", className)}>
			<SectionHeader title={section_title}>
				<CreateFile />
				<RevalidatePaths paths={[Route.public.PORTFOLIO.uri]} />
				<CreateProject type={type} tags={tags} fileList={fileList} />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>
			<div className="space-y-10">
				{projectsByType?.map((project, index) => (
					<ProjectAdminCard
						fileList={fileList}
						tags={tags}
						key={index}
						className={visibleItems > index ? "" : "section-card-collapsible"}
						project={project}
					/>
				))}
			</div>
		</div>
	);
};

export default TimeLine;
