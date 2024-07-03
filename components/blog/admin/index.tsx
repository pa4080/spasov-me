import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { postTuple } from "@/interfaces/_common-data-types";
import { getPosts } from "../_blog.actions";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	className?: string;
}

const BlogAdmin: React.FC<Props> = async ({ className }) => {
	const posts = await getPosts({ hyphen: true });
	const tags = await getTags();
	const fileList = await getFileList({ prefix: files_prefix });
	const iconList = await getFileList({ prefix: icons_prefix });

	return (
		<div className={cn("space-y-20", className)}>
			{postTuple.map((type) => (
				<TimeLine
					key={type}
					posts={posts}
					visibleItems={25}
					fileList={fileList}
					iconList={iconList}
					tags={tags}
					type={type}
				/>
			))}
		</div>
	);
};

export default BlogAdmin;
