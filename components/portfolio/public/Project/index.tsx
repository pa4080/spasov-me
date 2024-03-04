import React from "react";

import { notFound } from "next/navigation";

import GalleryCarousel from "@/components/fragments/Gallery/GalleryCarousel";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import SectionHeader from "@/components/fragments/SectionHeader";

import TechTags from "@/components/fragments/TechTags";

import { getProjects } from "../../_portfolio.actions";

import ProjectLinks from "../../common/ProjectLinks";
import styles from "./_project.module.scss";

interface Props {
	className?: string;
	projectIdSlug: string; // This could be ._id or .slug
}

const PortfolioPublicProject: React.FC<Props> = async ({ className, projectIdSlug }) => {
	const projectsHyphenated = await getProjects({
		hyphen: true,
		public: true,
	});

	const project = projectsHyphenated?.find(
		(p) => p._id === projectIdSlug || p.slug === projectIdSlug
	);

	if (!project) {
		notFound();
	}

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
		<div className={`${styles.container} ${className}`}>
			<GalleryCarousel
				gallery={gallery}
				navPosition="bottom"
				navType="inProject"
				projectData={project}
			/>
			<SectionHeader className="pop-header mt-6 sa:mt-8" title={project.html.title}>
				<ProjectLinks project={project} />
			</SectionHeader>

			{/* @see https://github.com/tailwindlabs/tailwindcss-typography */}
			<article className="prose lg:prose-lg max-w-none">
				<div
					dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
					className="font-semibold tracking-wide text-xl"
				/>
				{descriptionArr.length > 1 && (
					<div dangerouslySetInnerHTML={{ __html: descriptionArr[1] }} />
				)}
			</article>

			<TechTags className="mt-14" tags={project.tags} />
		</div>
	);
};

export default PortfolioPublicProject;
