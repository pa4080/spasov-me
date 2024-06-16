import React from "react";

import dynamic from "next/dynamic";

import Loading from "@/components/fragments/Loading";
import SectionHeader from "@/components/fragments/SectionHeader";
import TechTags from "@/components/fragments/TechTags";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { cn } from "@/lib/cn-utils";

import { FileListItem } from "@/interfaces/File";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";
import PostLinks from "../../common/PostLinks";

const GalleryCarousel = dynamic(() => import("@/components/fragments/Gallery/GalleryCarousel"), {
	ssr: false,
	loading: () => (
		<Loading className="h-auto w-auto max-h-[74vh] mx-auto" maxHeight="100%" scale={4} />
	),
});

interface Props {
	className?: string;
	post: PostData;
	fileList: FileListItem[] | null;
	tags: TagData[] | null;
}

const PortfolioPublicPost: React.FC<Props> = async ({ className, post, fileList, tags }) => {
	const descriptionArr = post.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	let gallery = post?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		post?.html?.attachment && gallery
			? [post?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	return (
		<div className={cn("w-full pt-8 sa:pt-6 lg:pt-1", className)}>
			<GalleryCarousel gallery={gallery} navPosition="bottom" navType="embedded" entryData={post} />
			<SectionHeader className="pop-header mt-6 sa:mt-8" title={post.html.title}>
				<PostLinks post={post} fileList={fileList} tags={tags} />
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

			<TechTags className="mt-14" tags={post.tags} />
		</div>
	);
};

export default PortfolioPublicPost;
