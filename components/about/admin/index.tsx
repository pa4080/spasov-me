import React from "react";

import { getFileList } from "@/components/files/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";

import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const AboutAdmin: React.FC<Props> = async ({ className }) => {
	const entries = await getEntries({ hyphen: true });
	const tags = await getTags();
	const fileList = await getFileList();

	return (
		<div className={`${styles.about} ${className}`}>
			<TimeLine
				entries={entries}
				files={fileList}
				tags={tags}
				type="businessCard"
				visibleItems={1}
			/>
			<TimeLine entries={entries} files={fileList} tags={tags} type="resume" visibleItems={1} />
			<TimeLine entries={entries} files={fileList} tags={tags} type="employment" />
			<TimeLine entries={entries} files={fileList} tags={tags} type="education" />
			<TimeLine entries={entries} files={fileList} tags={tags} type="spokenLanguages" />
		</div>
	);
};

export default AboutAdmin;
