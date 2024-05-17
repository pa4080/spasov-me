import React from "react";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";

import { cn } from "@/lib/cn-utils";

import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const PortfolioAdmin: React.FC<Props> = async ({ className }) => {
	const projects = await getProjects({ hyphen: true });
	const tags = await getTags();
	const fileList = await getFileList();

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine
				files={fileList}
				projects={projects}
				tags={tags}
				type="informationTechnologies"
				visibleItems={25}
			/>
			{/* <TimeLine projects={entries} files={fileList} tags={tags} type="resume" visibleItems={1} />
			<TimeLine projects={entries} files={fileList} tags={tags} type="employment" />
			<TimeLine projects={entries} files={fileList} tags={tags} type="education" />
			<TimeLine projects={entries} files={fileList} tags={tags} type="spokenLanguages" /> */}
		</div>
	);
};

export default PortfolioAdmin;
