import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { getPosts } from "../_blog.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const BlogPublic: React.FC<Props> = async ({ className }) => {
	const postHyphenated = await getPosts({
		hyphen: true,
		public: true,
	});
	const fileList = await getFileList();
	const tags = await getTags();

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine posts={postHyphenated} fileList={fileList} tags={tags} />
		</div>
	);
};

export default BlogPublic;
