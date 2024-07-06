import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { getEntries } from "../_about.actions";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";

interface Props {
	className?: string;
}

const AboutAdmin: React.FC<Props> = async ({ className }) => {
	const data = await Promise.all([
		getEntries({ hyphen: true }),
		getFileList({ prefix: files_prefix }),
		getIconsMap(),
		getTags(),
	]).then(([entries, fileList, iconsMap, tags]) => ({
		entries,
		fileList,
		iconsMap,
		tags,
	}));

	return (
		<div className={cn("space-y-20 scroll-m-8", className)}>
			<TimeLine {...data} type="businessCard" visibleItems={1} />
			<TimeLine {...data} type="resume" visibleItems={1} />
			<TimeLine {...data} type="employment" />
			<TimeLine {...data} type="education" />
			<TimeLine {...data} type="spokenLanguages" />
		</div>
	);
};

export default AboutAdmin;
