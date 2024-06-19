import React from "react";

import Image from "next/image";
import Link from "next/link";

import styles from "@/app/(styles)/card.module.scss";
import { Button } from "@/components/ui/button";
import { FileListItem } from "@/interfaces/File";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import { Route } from "@/routes";
import PostLinks from "../common/PostLinks";

interface Props {
	className?: string;
	post: PostData;
	fileList: FileListItem[] | null;
	tags: TagData[] | null;
}

const BlogPublic_Card: React.FC<Props> = ({ post, className, fileList, tags }) => {
	const t = msgs("Posts_CardPublic");

	const descriptionArr = post.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		<div className={`${styles.card} scroll-m-8 ${className}`} id={`post_${post._id}`}>
			<div className="flex gap-2 items-center justify-start w-full">
				<div className="rounded-full p-1 overflow-clip bg-primary/80 min-w-[3rem]">
					<Image
						alt={post.title}
						className="size-10"
						height={44}
						src={
							post.html.icon?.metadata.html.fileUrl ||
							post.html.icon?.metadata.html.fileUri ||
							Route.assets.LOGO_SVG
						}
						style={{
							filter:
								!post.html.icon?.metadata.html.fileUrl && !post.html.icon?.metadata.html.fileUri
									? "grayscale(1)"
									: "",
						}}
						unoptimized={post.html.icon?.filename.match(/\.svg$/) ? true : false}
						width={44}
					/>
				</div>
				<div
					dangerouslySetInnerHTML={{ __html: post.html.title }}
					className="text-lg font-semibold line-clamp-1 flex-shrink"
				/>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
				className="flex-grow line-clamp-2 pl-2"
			/>

			<div className="flex flex-row items-center justify-between gap-2 w-full">
				<PostLinks post={post} fileList={fileList} tags={tags} />
				<Link area-label={t("area_label_card_link")} href={`${Route.public.BLOG.uri}/${post.slug}`}>
					<Button
						className="transition-colors duration-300 hover:duration-150"
						size="sm"
						variant="defaultSecondary"
					>
						{t("button_call_to_action")}
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default BlogPublic_Card;
