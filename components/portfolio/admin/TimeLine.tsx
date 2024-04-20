import React from "react";

import CreateFile from "@/components/files-mongodb/admin/Actions/CreateFile"; // TODO: files-cloudflare
import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { FileListItem } from "@/interfaces/File";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { ProjectType } from "@/interfaces/_common-data-types";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import CreateProject from "./Actions/Create";
import ProjectAdminCard from "./Card";
import styles from "./_portfolio.module.scss";

interface Props {
	className?: string;
	type: ProjectType;
	visibleItems?: number;
	projects: ProjectData[] | null;
	files?: FileListItem[] | null;
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
	tags,
	files,
}) => {
	const t = msgs("Projects");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	// Filter the items by their type - i.e. ["informationTechnologies", "education", ...]
	const projectsByType = projects
		?.filter(({ projectType }) => projectType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<CreateFile />
				<RevalidatePaths paths={[Route.public.PORTFOLIO.uri]} />
				<CreateProject files={files} tags={tags} type={type} />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>
			<div className={styles.feed}>
				{projectsByType?.map((project, index) => (
					<ProjectAdminCard
						key={index}
						displayActions
						className={visibleItems > index ? "" : "section-card-collapsible"}
						files={files}
						project={project}
						tags={tags}
					/>
				))}
			</div>
		</div>
	);
};

export default TimeLine;
