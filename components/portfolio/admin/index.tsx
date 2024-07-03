import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	className?: string;
}

const PortfolioAdmin: React.FC<Props> = async ({ className }) => {
	const projects = await getProjects({ hyphen: true });
	const fileList = await getFileList({ prefix: files_prefix });
	const iconList = await getFileList({ prefix: icons_prefix });
	const tags = await getTags();

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine
				projects={projects}
				type="informationTechnologies"
				visibleItems={25}
				fileList={fileList}
				iconList={iconList}
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
