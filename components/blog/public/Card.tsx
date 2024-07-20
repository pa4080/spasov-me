import React from "react";

import Link from "next/link";

import styles from "@/app/(styles)/card.module.scss";
import DisplayFileImageOrEmbed from "@/components/fragments/DisplayFileImageOrEmbed";
import IconCircleWrapper from "@/components/fragments/IconCircleWrapper";
import { Button } from "@/components/ui/button";
import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import PostLinks from "../common/PostLinks";

interface Props {
	className?: string;
	post: PostData;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	iconsMap: IconsMap;
	tags: TagData[] | null;
}

const BlogPublic_Card: React.FC<Props> = ({
	post,
	className,
	fileList,
	iconList,
	tags,
	iconsMap,
}) => {
	const t = msgs("Posts_CardPublic");

	const descriptionArr = post.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		<div className={`${styles.card} group scroll-m-8 ${className}`} id={`post_${post._id}`}>
			{/* Header image */}
			<div className="w-full h-0 pt-[56.25%] relative">
				<div className="w-full absolute inset-0 rounded-md overflow-hidden group-hover:shadow-lg">
					{post.html.attachment && (
						<DisplayFileImageOrEmbed
							className={cn("w-auto mx-auto h-auto")}
							file={post.html.attachment}
							sizes={["360px", "600px"]}
						/>
					)}
				</div>
			</div>

			{/* Logo and Title */}
			<div className="flex gap-2 items-center justify-start w-full">
				<IconCircleWrapper
					alt={post.title}
					src={post.html.icon?.metadata.html.fileUrl || post.html.icon?.metadata.html.fileUri}
					unoptimized={post.html.icon?.filename.match(/\.svg$/) ? true : false}
				/>

				<div
					dangerouslySetInnerHTML={{ __html: post.html.title }}
					className="text-lg font-semibold line-clamp-2 flex-shrink leading-5"
				/>
			</div>

			{/* Description */}
			<div
				dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
				className="flex-grow line-clamp-2 pl-2"
			/>

			{/* Footer buttons */}
			<div className="flex flex-row items-center justify-between gap-2 w-full">
				<PostLinks
					fileList={fileList}
					iconList={iconList}
					iconsMap={iconsMap}
					post={post}
					tags={tags}
				/>
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
