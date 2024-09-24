import React from "react";

import dynamic from "next/dynamic";

import Loading from "@/components/fragments/Loading";
import SectionHeader from "@/components/fragments/SectionHeader";
import TechTags from "@/components/fragments/TechTags";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";

import ProjectLinks from "../../common/ProjectLinks";

const GalleryCarousel = dynamic(() => import("@/components/fragments/Gallery/GalleryCarousel"), {
	ssr: false,
	loading: () => (
		<Loading className="h-auto w-auto max-h-[74vh] mx-auto" maxHeight="100%" scale={4} />
	),
});

interface Props {
	className?: string;
	project: ProjectData;
	tags: TagData[] | null;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	iconsMap: IconsMap;
}

const PortfolioPublicProject: React.FC<Props> = async ({
	className,
	project,
	tags,
	fileList,
	iconList,
	iconsMap,
}) => {
	const descriptionArr = project.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	let gallery = project?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		project?.html?.attachment && gallery
			? [project?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	return (
		<div className={cn("w-full pt-8 sa:pt-6 lg:pt-1", className)}>
			<GalleryCarousel
				entryData={project}
				gallery={gallery}
				navPosition="bottom"
				navType="embedded"
			/>
			<SectionHeader className="pop-header mt-6 sa:mt-8" title={project.html.title}>
				<ProjectLinks
					fileList={fileList}
					iconList={iconList}
					iconsMap={iconsMap}
					project={project}
					tags={tags}
				/>
			</SectionHeader>

			{/* @see https://github.com/tailwindlabs/tailwindcss-typography */}
			<article className="prose lg:prose-lg max-w-none xa:text-justify">
				<div
					dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
					className="font-semibold tracking-wide text-xl"
				/>
				{descriptionArr.length > 1 && (
					<div dangerouslySetInnerHTML={{ __html: descriptionArr[1] }} className="project-body" />
				)}
			</article>

			<TechTags className="mt-20" iconsMap={iconsMap} tags={project.tags} />
		</div>
	);
};

export default PortfolioPublicProject;
