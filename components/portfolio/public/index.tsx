import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const PortfolioPublic: React.FC<Props> = async ({ className }) => {
	const projectsHyphenated = await getProjects({
		hyphen: true,
		public: true,
	});
	const fileList = await getFileList();
	const tags = await getTags();

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine projects={projectsHyphenated} fileList={fileList} tags={tags} />
		</div>
	);
};

export default PortfolioPublic;
