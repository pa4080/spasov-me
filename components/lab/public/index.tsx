import React from "react";

import { cn } from "@/lib/cn-utils";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";

import { labEntryPropertyTuple } from "@/interfaces/_common-data-types";

import { getLabEntries } from "../_lab.actions";
import Section from "./Section";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	className?: string;
}

const LabPublic: React.FC<Props> = async ({ className }) => {
	const data = await Promise.all([
		getLabEntries({
			hyphen: true,
			public: true,
		}),
		getFileList({ prefix: files_prefix }),
		getFileList({ prefix: icons_prefix }),
		getIconsMap(),
		getTags(),
	]).then(([labEntriesHyphenated, fileList, iconList, iconsMap, tags]) => ({
		labEntries: labEntriesHyphenated,
		fileList,
		iconList,
		iconsMap,
		tags,
	}));

	return (
		<div className={cn("space-y-20", className)}>
			{labEntryPropertyTuple.map((type) => (
				<Section key={type} {...data} labEntryPropertyType={type} />
			))}
		</div>
	);
};

export default LabPublic;
