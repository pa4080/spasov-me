import { ProjectType } from "@/interfaces/_common-data-types";

import { NewProjectData, ProjectData, ProjectDocPopulated } from "@/interfaces/Project";

import { fileDocuments_toData } from "./process-data-files";
import { tagDocuments_toData } from "./process-data-tags";
import { processMarkdown } from "./process-markdown";

export function projectDocuments_toData({
	projects,
	hyphen,
	typeList,
	visible,
}: {
	projects: ProjectDocPopulated[];
	hyphen?: boolean;
	typeList?: ProjectType[];
	visible?: boolean;
}): ProjectData[] {
	let projectsFiltered = projects;

	if (visible) {
		projectsFiltered = projects.filter((entry) => entry.visibility);
	}

	return projectsFiltered
		.filter(({ projectType }) => (typeList && typeList.includes(projectType)) ?? true)
		.map((project) => ({
			_id: project._id.toString(),
			html: {
				// This cannot be done in the client side
				title: processMarkdown({
					markdown: project.title,
					hyphen,
				}),
				description: processMarkdown({
					markdown: project.description,
					hyphen,
				}),
				attachment: fileDocuments_toData({
					files: project?.attachment ? [project?.attachment] : [],
				})?.[0],
				icon: fileDocuments_toData({
					files: project?.icon ? [project?.icon] : [],
				})?.[0],
			},
			title: project.title,
			description: project.description,
			slug: project.slug,
			urlHome: project.urlHome,
			urlRepo: project.urlRepo,
			dateFrom: project.dateFrom as Date,
			dateTo: project.dateTo as Date | undefined,
			projectType: project.projectType,
			visibility: project.visibility as boolean,
			attachment: project.attachment?._id.toString(),
			icon: project.icon?._id.toString(),
			tags: tagDocuments_toData({ tags: project.tags || [], hyphen: true }),
			gallery: fileDocuments_toData({ files: project.gallery || [] }),
		}));
}

export function projectFormData_toNewProjectData({
	data,
	user_id,
}: {
	data: FormData;
	user_id: string;
}): NewProjectData {
	return {
		title: data.get("title") as string,
		description: data.get("description") as string,
		slug: data.get("slug") as string,
		urlHome: data.get("urlHome") as string,
		urlRepo: data.get("urlRepo") as string,
		projectType: data.get("projectType") as ProjectType,
		dateFrom: data.get("dateFrom") as string,
		dateTo: data.get("dateTo") as string,
		visibility: data.get("visibility") as string,
		attachment: data.get("attachment") as string,
		icon: data.get("icon") as string,

		tags: JSON.parse(data.get("tags") as string) as string[],
		gallery: JSON.parse(data.get("gallery") as string) as string[],

		creator: user_id,
	};
}
