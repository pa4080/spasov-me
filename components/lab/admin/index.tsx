import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { labEntryTuple } from "@/interfaces/_common-data-types";

import { getLabEntries } from "../_lab.actions";
import Section from "./Section";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	className?: string;
}

const LabAdmin: React.FC<Props> = async ({ className }) => {
	const labEntries = await getLabEntries({ hyphen: true });
	const tags = await getTags();
	const fileList = await getFileList({ prefix: files_prefix });
	const iconList = await getFileList({ prefix: icons_prefix });
	const iconsMap = await getIconsMap();

	return (
		<div className={cn("space-y-20", className)}>
			{labEntryTuple.map((type) => (
				<Section
					key={type}
					fileList={fileList}
					iconList={iconList}
					iconsMap={iconsMap}
					labEntries={labEntries}
					tags={tags}
					type={type}
					visibleItems={25}
				/>
			))}
		</div>
	);
};

export default LabAdmin;
