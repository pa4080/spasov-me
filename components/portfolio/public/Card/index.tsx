import React from "react";

// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates

import { FileListItem } from "@/interfaces/File";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

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
	const descriptionArr = project.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		<div className={`${styles.cardWrapper} ${className}`} id={`project_${project._id}`}>
			<div className={styles.card}>
				<div dangerouslySetInnerHTML={{ __html: project.html.title }} />
				<div dangerouslySetInnerHTML={{ __html: descriptionArr[0] }} />

				<div className={styles.projectLinks}>
					<div className={styles.iconWrapper}>
						<DisplayResourceUrlAsIcon size={23} type="home" url={project.urlHome} />
					</div>
					<div className={styles.iconWrapper}>
						<DisplayResourceUrlAsIcon size={28} type="repo" url={project.urlRepo} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectPublicCard;
