import React from "react";

import CreateFile from "@/components/files-cloudflare/admin/Actions/CreateFile";
import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/SectionHeader";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { FileListItem } from "@/interfaces/File";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";
import { PostType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";
import CreatePost from "./Actions/Create";
import PostAdminCard from "./Card";

interface Props {
	className?: string;
	type?: PostType;
	visibleItems?: number;
	posts: PostData[] | null;
	fileList: FileListItem[] | null;
	tags: TagData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const TimeLine: React.FC<Props> = ({
	className,
	type = "blog",
	visibleItems = 3,
	posts,
	fileList,
	tags,
}) => {
	const t = msgs("Posts");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	// Filter the items by their type - i.e. ["informationTechnologies", "education", ...]
	const postsByType = posts
		?.filter(({ entryType }) => entryType === type)
		.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={cn("portfolio-admin-section list-section scroll-m-8", className)}>
			<SectionHeader title={section_title}>
				<CreateFile />
				<RevalidatePaths paths={[Route.public.PORTFOLIO.uri]} />
				<CreatePost type={type} tags={tags} fileList={fileList} />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>
			<div className="space-y-10">
				{postsByType?.map((project, index) => (
					<PostAdminCard
						fileList={fileList}
						tags={tags}
						key={index}
						className={visibleItems > index ? "" : "section-card-collapsible"}
						post={project}
					/>
				))}
			</div>
		</div>
	);
};

export default TimeLine;
