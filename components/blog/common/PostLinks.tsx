"use client";

import Gallery, { dialogTrigger_Type2 } from "@/components/fragments/Gallery";
import TooltipWrapper from "@/components/fragments/TooltipWrapper";
import { msgs } from "@/messages";

import { cn } from "@/lib/cn-utils";

import { FileListItem } from "@/interfaces/File";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";
import UpdatePost from "../admin/Actions/Update";
import DisplayResourceUrlAsIcon from "./DisplayResourceUrlAsIcon";

interface Props {
	post: PostData;
	fileList: FileListItem[] | null;
	tags: TagData[] | null;
}

const PostLinks: React.FC<Props> = ({ post, fileList, tags }) => {
	const t = msgs("Posts_CardPublic");

	let gallery = post?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		post?.html?.attachment && gallery
			? [post?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	const iconWrapper =
		"fill-foreground-tertiary hover:fill-ring-secondary flex items-center justify-center h-full";

	return (
		<div className="pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7">
			<div className={iconWrapper}>
				<DisplayResourceUrlAsIcon size={23} type="URL 1" url={post.url1} />
			</div>

			<div className={iconWrapper}>
				<DisplayResourceUrlAsIcon size={23} type="URL 2" url={post.url2} />
			</div>

			<div className={iconWrapper}>
				<TooltipWrapper
					className="w-full h-full flex items-center fill-inherit"
					tooltipText={t("tooltip_gallery")}
				>
					<Gallery
						dialogTrigger_buttonIconProps={{
							className:
								"p-0 bg-transparent hover:bg-transparent m-0 h-full fill-inherit grayscale-0",
							widthOffset: 0,
							heightOffset: 0,
							width: 27,
							height: 26,
							iconEmbedSvgProps: {
								className_Path1: "fill-transparent",
								className_Path2: "fill-inherit",
							},
						}}
						entry={post}
						gallery={gallery}
					/>
				</TooltipWrapper>
			</div>

			<div
				className={cn(
					iconWrapper,
					"overflow-hidden rounded-[3px] bg-foreground-tertiary hover:bg-ring-secondary -ml-1"
				)}
			>
				<TooltipWrapper
					className="w-full h-full flex items-center fill-inherit"
					tooltipText={t("tooltip_update")}
				>
					<UpdatePost
						fileList={fileList}
						tags={tags}
						className="h-6 w-6 flex items-center justify-center"
						dialogTrigger_buttonIconProps={dialogTrigger_Type2}
						post={post}
					/>
				</TooltipWrapper>
			</div>
		</div>
	);
};

export default PostLinks;
