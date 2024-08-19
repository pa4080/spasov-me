/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
 */

import React from "react";

import { notFound } from "next/navigation";

import { getPosts } from "@/components/blog/_blog.actions";
import BlogPublicPost from "@/components/blog/public/Post";
import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";

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

	const postId_Slug = params.slug[0];

	const data: {
		postsHyphenated?: PostData[] | null;
		fileList: FileListItem[] | null;
		iconList: FileListItem[] | null;
		tags: TagData[] | null;
		iconsMap: IconsMap;
	} = await Promise.all([
		getPosts({ hyphen: true, public: true }),
		getFileList({ prefix: files_prefix }),
		getFileList({ prefix: icons_prefix }),
		getTags(),
		getIconsMap(),
	]).then(([postsHyphenated, fileList, iconList, tags, iconsMap]) => ({
		postsHyphenated,
		fileList,
		iconList,
		tags,
		iconsMap,
	}));

	const post = data.postsHyphenated?.find(
		(post) => post._id === postId_Slug || post.slug === postId_Slug
	);

	if (!post) {
		notFound();
	}

	delete data.postsHyphenated;

	return (
		<div className="mt-2 sa:mt-6 mb-24 scroll-m-40">
			<BlogPublicPost post={post} {...data} />
		</div>
	);
};

export default Post;
