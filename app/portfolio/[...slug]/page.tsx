/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import React from "react";

import { notFound } from "next/navigation";

import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getProjects } from "@/components/portfolio/_portfolio.actions";
import PortfolioPublicProject from "@/components/portfolio/public/Project";
import { getTags } from "@/components/tags/_tags.actions";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

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

	const fileList = await getFileList({ prefix: files_prefix });
	const iconList = await getFileList({ prefix: icons_prefix });
	const tags = await getTags();

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
			<PortfolioPublicProject
				project={project}
				fileList={fileList}
				iconList={iconList}
				tags={tags}
			/>
		</div>
	);
};

export default Project;
