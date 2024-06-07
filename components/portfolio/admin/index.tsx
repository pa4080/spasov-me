import React from "react";

import { cn } from "@/lib/cn-utils";

import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const PortfolioAdmin: React.FC<Props> = async ({ className }) => {
	const projects = await getProjects({ hyphen: true });

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine projects={projects} type="informationTechnologies" visibleItems={25} />
			{/* <TimeLine projects={entries} files={fileList} tags={tags} type="resume" visibleItems={1} />
			<TimeLine projects={entries} files={fileList} tags={tags} type="employment" />
			<TimeLine projects={entries} files={fileList} tags={tags} type="education" />
			<TimeLine projects={entries} files={fileList} tags={tags} type="spokenLanguages" /> */}
		</div>
	);
};

export default PortfolioAdmin;
