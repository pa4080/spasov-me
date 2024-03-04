import React from "react";

import { notFound } from "next/navigation";

import GalleryCarousel from "@/components/fragments/Gallery/GalleryCarousel";

import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { getProjects } from "../../_portfolio.actions";

import styles from "./_project.module.scss";

interface Props {
	className?: string;
	projectIdSlug: string; // This could be ._id or .slug
}

const SingleProjectPublic: React.FC<Props> = async ({ className, projectIdSlug }) => {
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
		</div>
	);
};

export default SingleProjectPublic;
