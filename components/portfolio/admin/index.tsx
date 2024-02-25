import React from "react";

import { getFileList } from "@/components/files/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";

import { getProjects } from "../_portfolio.actions";
import styles from "./_portfolio.module.scss";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const AboutAdmin: React.FC<Props> = async ({ className }) => {
	const projects = await getProjects({ hyphen: true });
	const tags = await getTags();
	const fileList = await getFileList();

	return (
		<div className={`${styles.portfolio} ${className}`}>
			<TimeLine
				files={fileList}
				projects={projects}
				tags={tags}
				type="informationTechnologies"
				visibleItems={1}
			/>
			{/* <TimeLine projects={entries} files={fileList} tags={tags} type="resume" visibleItems={1} />
			<TimeLine projects={entries} files={fileList} tags={tags} type="employment" />
			<TimeLine projects={entries} files={fileList} tags={tags} type="education" />
			<TimeLine projects={entries} files={fileList} tags={tags} type="spokenLanguages" /> */}
		</div>
	);
};

export default AboutAdmin;
