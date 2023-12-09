import React from "react";

import { cn } from "@/lib/cn-utils";

import { AboutEntryDoc } from "@/interfaces/AboutEntry";

import styles from "../../_about.module.scss";

interface Props {
	entry: AboutEntryDoc;
	className?: string;
}

const AboutEntryContent: React.FC<Props> = ({ entry, className }) => {
	return (
		<div className={cn(className)}>
			<div>{entry.title}</div>
		</div>
	);
};

export default AboutEntryContent;
