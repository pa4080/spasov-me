import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { getEntries } from "../_about.actions";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const AboutAdmin: React.FC<Props> = async ({ className }) => {
	const entries = await getEntries({ hyphen: true });
	const fileList = await getFileList();
	const tags = await getTags();

	return (
		<div className={cn("space-y-20 scroll-m-8", className)}>
			<TimeLine
				fileList={fileList}
				tags={tags}
				entries={entries}
				type="businessCard"
				visibleItems={1}
			/>
			<TimeLine fileList={fileList} tags={tags} entries={entries} type="resume" visibleItems={1} />
			<TimeLine fileList={fileList} tags={tags} entries={entries} type="employment" />
			<TimeLine fileList={fileList} tags={tags} entries={entries} type="education" />
			<TimeLine fileList={fileList} tags={tags} entries={entries} type="spokenLanguages" />
		</div>
	);
};

export default AboutAdmin;
