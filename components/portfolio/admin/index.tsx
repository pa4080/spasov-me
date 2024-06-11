import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const PortfolioAdmin: React.FC<Props> = async ({ className }) => {
	const projects = await getProjects({ hyphen: true });
	const fileList = await getFileList();
	const tags = await getTags();

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine
				projects={projects}
				type="informationTechnologies"
				visibleItems={25}
				fileList={fileList}
				tags={tags}
			/>
			{/* <TimeLine projects={entries} files={fileList} tags={tags} type="resume" visibleItems={1} />
			<TimeLine projects={entries} files={fileList} tags={tags} type="employment" />
			<TimeLine projects={entries} files={fileList} tags={tags} type="education" />
			<TimeLine projects={entries} files={fileList} tags={tags} type="spokenLanguages" /> */}
		</div>
	);
};

export default PortfolioAdmin;
