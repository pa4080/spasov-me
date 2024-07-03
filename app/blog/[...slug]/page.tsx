/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import React from "react";

import { notFound } from "next/navigation";

import { getPosts } from "@/components/blog/_blog.actions";
import BlogPublicPost from "@/components/blog/public/Post";
import { getFileList } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

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

	const fileList = await getFileList({ prefix: files_prefix });
	const iconList = await getFileList({ prefix: icons_prefix });
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
			<BlogPublicPost post={post} fileList={fileList} iconList={iconList} tags={tags} />
		</div>
	);
};

export default Post;
