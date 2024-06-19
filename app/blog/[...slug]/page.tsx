/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import React from "react";

import { notFound } from "next/navigation";

import { getPosts } from "@/components/blog/_blog.actions";
import PortfolioPublicPost from "@/components/blog/public/Post";
import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";

interface Props {
	params: { slug: string[] };
}

export async function generateStaticParams() {
	const posts = await getPosts({
		hyphen: false,
		public: true,
	});

	return posts?.map((p) => ({ slug: [p.slug] })) || [];
}

const Post: React.FC<Props> = async ({ params }) => {
	// Handle the rest of the cases /[...slug]/b/c...
	if (!(params.slug.length === 1)) {
		notFound();
	}

	const postIdSlug = params.slug[0];

	const fileList = await getFileList();
	const tags = await getTags();

	const postsHyphenated = await getPosts({
		hyphen: true,
		public: true,
	});

	const post = postsHyphenated?.find((p) => p._id === postIdSlug || p.slug === postIdSlug);

	if (!post) {
		notFound();
	}

	return (
		<div className="mt-2 sa:mt-6 mb-24 scroll-m-40">
			<PortfolioPublicPost post={post} fileList={fileList} tags={tags} />
		</div>
	);
};

export default Post;
