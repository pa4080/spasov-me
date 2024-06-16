import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { postTuple } from "@/interfaces/_common-data-types";
import { getPosts } from "../_blog.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const BlogAdmin: React.FC<Props> = async ({ className }) => {
	const posts = await getPosts({ hyphen: true });
	const fileList = await getFileList();
	const tags = await getTags();
	const postTypes = postTuple;

	return (
		<div className={cn("space-y-20", className)}>
			{postTypes.map((type) => (
				<TimeLine posts={posts} visibleItems={25} fileList={fileList} tags={tags} type={type} />
			))}
		</div>
	);
};

export default BlogAdmin;
