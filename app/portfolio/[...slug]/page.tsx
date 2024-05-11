/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import React from "react";

import { notFound } from "next/navigation";

import { getProjects } from "@/components/portfolio/_portfolio.actions";
import PortfolioPublicProject from "@/components/portfolio/public/Project";

interface Props {
	params: { slug: string[] };
}

export async function generateStaticParams() {
	const projects = await getProjects({
		hyphen: false,
		public: true,
	});

	return projects?.map((p) => ({ slug: [p.slug] })) || [];
}

const Project: React.FC<Props> = async ({ params }) => {
	// Handle the rest of the cases /[...slug]/b/c...
	if (!(params.slug.length === 1)) {
		notFound();
	}

	const projectIdSlug = params.slug[0];

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

	return (
		<div className="mt-2 sa:mt-6 mb-24 scroll-m-40">
			<PortfolioPublicProject project={project} />
		</div>
	);
};

export default Project;
