import React from "react";

import { cn } from "@/lib/cn-utils";

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

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine projects={projectsHyphenated} />
		</div>
	);
};

export default PortfolioPublic;
