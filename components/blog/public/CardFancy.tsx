"use client";

import React from "react";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

import Image from "next/image";
import Link from "next/link";

// import styles from "@/app/(styles)/card.module.scss";
// import { Button } from "@/components/ui/button";
import { FileListItem } from "@/interfaces/File";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import { Route } from "@/routes";
// import { Route } from "@/routes";
// import PostLinks from "../common/PostLinks";

interface Props {
	className?: string;
	post: PostData;
	fileList: FileListItem[] | null;
	tags: TagData[] | null;
}

const BlogPublic_CardFancy: React.FC<Props> = ({ post, className, fileList, tags }) => {
	const t = msgs("Posts_CardPublic");

	const descriptionArr = post.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		<CardContainer className="inter-var">
			<CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
				<CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
					<div dangerouslySetInnerHTML={{ __html: post.html.title }} />
				</CardItem>
				<CardItem translateZ="60" className="text-neutral-500 text-sm mt-2 dark:text-neutral-300">
					<div dangerouslySetInnerHTML={{ __html: descriptionArr[0] }} />
				</CardItem>
				<CardItem translateZ="100" className="w-full mt-4">
					<Image
						src={post.html.attachment?.metadata.html.fileUrl || Route.assets.LOGO_SVG}
						height="1000"
						width="1000"
						className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
						alt={post.title}
					/>
				</CardItem>
				<div className="flex justify-between items-center mt-20">
					<CardItem
						translateZ={20}
						as={Link}
						href="https://twitter.com/mannupaaji"
						target="__blank"
						className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
					>
						Try now →
					</CardItem>
					<CardItem
						translateZ={20}
						as="button"
						className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
					>
						Sign up
					</CardItem>
				</div>
			</CardBody>
		</CardContainer>
	);
};

export default BlogPublic_CardFancy;
