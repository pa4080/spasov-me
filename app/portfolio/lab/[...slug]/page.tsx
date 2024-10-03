/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import React from "react";

import { notFound } from "next/navigation";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getFileList_mongo } from "@/components/files-mongodb/_files.actions";
import { getLabEntries } from "@/components/laboratory/_lab.actions";
import LabPublicEntry from "@/components/laboratory/Private/Post";
import { getTags } from "@/components/tags/_tags.actions";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { LabEntryData } from "@/interfaces/LabEntry";
import { TagData } from "@/interfaces/Tag";

// const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
	params: { slug: string[] };
}

export async function generateStaticParams() {
	const labEntries = await getLabEntries({
		hyphen: false,
		public: true,
	});

	return labEntries?.map((p) => ({ slug: [p.slug] })) || [];
}

const LabEntry: React.FC<Props> = async ({ params }) => {
	// Handle the rest of the cases /[...slug]/b/c...
	if (!(params.slug.length === 1)) {
		notFound();
	}

	const entryId_Slug = params.slug[0];

	const data: {
		labEntriesHyphenated?: LabEntryData[] | null;
		fileList: FileListItem[] | null;
		iconList: FileListItem[] | null;
		tags: TagData[] | null;
		iconsMap: IconsMap;
	} = await Promise.all([
		getLabEntries({ hyphen: true, public: true }),
		getFileList_mongo(),
		getFileList({ prefix: icons_prefix }),
		getTags(),
		getIconsMap(),
	]).then(([labEntriesHyphenated, fileList, iconList, tags, iconsMap]) => ({
		labEntriesHyphenated,
		fileList,
		iconList,
		tags,
		iconsMap,
	}));

	const labEntry = data.labEntriesHyphenated?.find(
		(entry) => entry._id === entryId_Slug || entry.slug === entryId_Slug
	);

	if (!labEntry) {
		notFound();
	}

	delete data.labEntriesHyphenated;

	return (
		<div className="mt-2 sa:mt-6 mb-24 scroll-mt-40">
			<LabPublicEntry labEntry={labEntry} {...data} />
		</div>
	);
};

export default LabEntry;
