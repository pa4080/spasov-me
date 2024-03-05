/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import React from "react";

import { notFound } from "next/navigation";

import PortfolioPublicProject from "@/components/portfolio/public/Project";

interface Props {
	params: { slug: string[] };
}

const Project: React.FC<Props> = ({ params }) => {
	// Handle the rest of the cases /[...slug]/b/c...
	if (!(params.slug.length === 1)) {
		notFound();
	}

	return (
		<div className="mt-2 sa:mt-6 mb-24 scroll-m-40">
			<PortfolioPublicProject projectIdSlug={params.slug[0]} />
		</div>
	);
};

export default Project;
