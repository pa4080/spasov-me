import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { getPosts } from "../_blog.actions";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	className?: string;
}

const BlogPublic: React.FC<Props> = async ({ className }) => {
	const postHyphenated = await getPosts({
		hyphen: true,
		public: true,
	});
	const tags = await getTags();
	const fileList = await getFileList({ prefix: files_prefix });
	const iconList = await getFileList({ prefix: icons_prefix });

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine posts={postHyphenated} fileList={fileList} iconList={iconList} tags={tags} />
		</div>
	);
};

export default BlogPublic;
