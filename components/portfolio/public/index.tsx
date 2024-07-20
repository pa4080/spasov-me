import React from "react";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { cn } from "@/lib/cn-utils";

import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	className?: string;
}

const PortfolioPublic: React.FC<Props> = async ({ className }) => {
	const data = await Promise.all([
		getProjects({ hyphen: true, public: true }),
		getFileList({ prefix: files_prefix }),
		getFileList({ prefix: icons_prefix }),
		getIconsMap(),
		getTags(),
	]).then(([projectsHyphenated, fileList, iconList, iconsMap, tags]) => ({
		projects: projectsHyphenated,
		fileList,
		iconList,
		iconsMap,
		tags,
	}));

	return (
		<div className={cn("space-y-20", className)}>
			<TimeLine {...data} />
		</div>
	);
};

export default PortfolioPublic;
