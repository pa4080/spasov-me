import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	className?: string;
}

const PortfolioPublic: React.FC<Props> = async ({ className }) => {
	const projectsHyphenated = await getProjects({
		hyphen: true,
		public: true,
	});
	const fileList = await getFileList({ prefix: files_prefix });
	const iconList = await getFileList({ prefix: icons_prefix });

	const tags = await getTags();

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine projects={projectsHyphenated} fileList={fileList} iconList={iconList} tags={tags} />
		</div>
	);
};

export default PortfolioPublic;
