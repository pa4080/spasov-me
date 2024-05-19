import React from "react";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";

import { cn } from "@/lib/cn-utils";

import { getEntries } from "../_about.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const AboutAdmin: React.FC<Props> = async ({ className }) => {
	const entries = await getEntries({ hyphen: true });
	const tags = await getTags();
	const fileList = await getFileList();

	return (
		<div className={cn("space-y-20 scroll-m-8", className)}>
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
