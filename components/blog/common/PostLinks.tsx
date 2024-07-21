"use client";

import Gallery, { dialogTrigger_Type2 } from "@/components/fragments/Gallery";
import TooltipWrapper from "@/components/fragments/TooltipWrapper";
import { msgs } from "@/messages";

import { cn } from "@/lib/cn-utils";

import { FileListItem } from "@/interfaces/File";
import { IconsMap } from "@/interfaces/IconsMap";
import { PostData } from "@/interfaces/Post";
import { TagData } from "@/interfaces/Tag";

import UpdatePost from "../admin/Actions/Update";
import DisplayResourceUrlAsIcon from "./DisplayResourceUrlAsIcon";

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
		"fill-foreground-tertiary hover:fill-ring-secondary flex items-center justify-center h-full";

	return (
		<div className="pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7">
			<div className="flex gap-0 items-center justify-start">
				{["url1", "url2"].map((key) => {
					if (!post[key as keyof typeof post]) {
						return null;
					}

					return (
						<div key={key} className={iconWrapper}>
							<DisplayResourceUrlAsIcon
								height={18}
								icon_className_Path2="fill-accent"
								type="URL 1"
								url={post[key as "url1" | "url2"]}
								width={26}
							/>
						</div>
					);
				})}
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
						className="h-6 w-6 flex items-center justify-center"
						dialogTrigger_buttonIconProps={dialogTrigger_Type2}
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
