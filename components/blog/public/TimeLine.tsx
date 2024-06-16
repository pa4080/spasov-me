import React from "react";

import { FileListItem } from "@/interfaces/File";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";
import { PostType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";
import BlogPublic_Card from "./Card";

interface Props {
	className?: string;
	type?: PostType;
	posts: PostData[] | null;
	fileList: FileListItem[] | null;
	tags: TagData[] | null;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"...
 *
 * We won't filter the posts by type because we want to show all posts,
 * ordered by date... probably we need may indicate the type by a icon?(!?)
 */
const TimeLine: React.FC<Props> = ({ className, posts, fileList, tags }) => {
	const postsByType = posts?.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

	return (
		<div className={cn("portfolio-cards-section scroll-m-8", className)}>
			<div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
				{postsByType?.map((post, index) => (
					<BlogPublic_Card key={index} className="" post={post} fileList={fileList} tags={tags} />
				))}
			</div>
		</div>
	);
};

export default TimeLine;
