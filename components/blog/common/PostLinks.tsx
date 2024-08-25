"use client";

import TooltipWrapper from "@/components/fragments/TooltipWrapper";
import { msgs } from "@/messages";

import { cn } from "@/lib/cn-utils";

import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";

import DisplayResourceUrlAsIcon from "@/components/fragments/DisplayResourceUrlAsIcon";

import Gallery from "@/components/fragments/Gallery";

import UpdatePost from "../admin/Actions/Update";

interface Props {
	post: PostData;
	fileList: FileListItem[] | null;
	iconList: FileListItem[] | null;
	iconsMap: IconsMap;
	tags: TagData[] | null;
}

const PostLinks: React.FC<Props> = ({ post, fileList, iconList, tags, iconsMap }) => {
	const t = msgs("Posts_CardPublic");

	let gallery = post?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		post?.html?.attachment && gallery
			? [post?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	const iconWrapper =
		"fill-foreground-tertiary hover:fill-ring-secondary flex items-center justify-center h-full if-empty-display-none";

	return (
		<div className="pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7">
			<div className={iconWrapper}>
				<TooltipWrapper
					className="w-full h-full flex items-center fill-inherit"
					tooltipText={t("tooltip_gallery")}
				>
					<Gallery entry={post} gallery={gallery} />
				</TooltipWrapper>
			</div>

			<div className={iconWrapper}>
				<DisplayResourceUrlAsIcon
					className="grayscale-[100%] hover:grayscale-[0%]"
					height={21}
					iconType="arrow-up-right-from-square"
					icon_className_Path1="fill-accent-secondary"
					icon_className_Path2="fill-accent"
					label={t("tooltip_link", { linkType: "Link 1" })}
					url={post.url1}
					width={21}
				/>
			</div>

			<div className={iconWrapper}>
				<DisplayResourceUrlAsIcon
					className="grayscale-[100%] hover:grayscale-[0%]"
					height={21}
					iconType="arrow-up-right-from-square"
					icon_className_Path1="fill-accent-secondary"
					icon_className_Path2="fill-accent"
					label={t("tooltip_link", { linkType: "Link 2" })}
					url={post.url2}
					width={21}
				/>
			</div>

			<div className={cn(iconWrapper, "overflow-hidden")}>
				<TooltipWrapper
					className="w-full h-full flex items-center fill-inherit"
					tooltipText={t("tooltip_update")}
				>
					<UpdatePost
						className="h-6 w-6 flex items-center justify-center mr-[1px]"
						fileList={fileList}
						iconList={iconList}
						iconsMap={iconsMap}
						post={post}
						tags={tags}
					/>
				</TooltipWrapper>
			</div>
		</div>
	);
};

export default PostLinks;
