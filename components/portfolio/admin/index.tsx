import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { projectTuple } from "@/interfaces/_common-data-types";
import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	className?: string;
}

const PortfolioAdmin: React.FC<Props> = async ({ className }) => {
	const data = await Promise.all([
		getProjects({ hyphen: true }),
		getFileList({ prefix: files_prefix }),
		getFileList({ prefix: icons_prefix }),
		getIconsMap(),
		getTags(),
	]).then(([projects, fileList, iconList, iconsMap, tags]) => ({
		projects,
		fileList,
		iconList,
		iconsMap,
		tags,
	}));

	return (
		<div className={cn("space-y-20", className)}>
			{projectTuple.map((type) => (
				<TimeLine type={type} key={type} visibleItems={25} {...data} />
			))}
		</div>
	);
};

export default PortfolioAdmin;
