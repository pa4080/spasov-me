import React from "react";

import { cn } from "@/lib/cn-utils";

import { getEntries } from "../_about.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const AboutAdmin: React.FC<Props> = async ({ className }) => {
	const entries = await getEntries({ hyphen: true });

	return (
		<div className={cn("space-y-20 scroll-m-8", className)}>
			<TimeLine entries={entries} type="businessCard" visibleItems={1} />
			<TimeLine entries={entries} type="resume" visibleItems={1} />
			<TimeLine entries={entries} type="employment" />
			<TimeLine entries={entries} type="education" />
			<TimeLine entries={entries} type="spokenLanguages" />
		</div>
	);
};

export default AboutAdmin;
