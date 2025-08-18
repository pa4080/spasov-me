"use client";

import DisplayResourceUrlAsIcon from "@/components/shared/DisplayResourceUrlAsIcon";
import Gallery from "@/components/shared/Gallery";
import TooltipWrapper from "@/components/shared/TooltipWrapper";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type PostData } from "@/interfaces/Post";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import UpdatePost from "../admin/Actions/Update";

interface Props {
  post: PostData;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
  tags: TagData[] | null;
  categoryPosition?: "left" | "right";
  className?: string;
  classNameCategory?: string;
}

const PostLinks: React.FC<Props> = ({
  post,
  fileList,
  iconList,
  tags,
  iconsMap,
  categoryPosition,
  className,
  classNameCategory,
}) => {
  const t = msgs("Posts_CardPublic");
  const tCommon = msgs("Posts");

  type tType = Parameters<typeof tCommon>[0];

  let gallery = post?.gallery
    ?.map((file) => file.metadata.html)
    ?.sort((a, b) => a.filename.localeCompare(b.filename));

  gallery =
    post?.html?.attachment && gallery
      ? [post?.html?.attachment.metadata.html].concat(gallery)
      : gallery;

  const iconWrapper =
    "fill-foreground-tertiary hover:fill-ring-secondary flex items-center justify-center h-full if-empty-display-none";

  const label = tCommon(`title_${post.entryType}` as tType);
  const tooltip = t("category_tooltip", { category: label });

  const isDisabled_Url1 =
    post.url1 === undefined || post.url1 === null || post.url1 === "" || post.url1 === "undefined";

  const isDisabled_Url2 =
    post.url2 === undefined || post.url2 === null || post.url2 === "" || post.url2 === "undefined";

  const Category = ({ className }: { className?: string }) => (
    <TooltipWrapper className={cn("cursor-default", className)} tooltipText={tooltip}>
      <span
        className={cn(
          "grayscale-[100%] hover:grayscale-0 transition-colors duration-150 font-unicephalon text-sm text-background bg-accent-secondary px-1 block rounded-sm translate-y-[1px]",
          classNameCategory
        )}
      >
        {label}
      </span>
    </TooltipWrapper>
  );

  return (
    <div
      className={cn(
        "pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7",
        className
      )}
    >
      {categoryPosition === "left" && <Category />}

      <div className={iconWrapper}>
        <TooltipWrapper
          className="w-full h-full flex items-center fill-inherit"
          tooltipText={t("tooltip_gallery")}
        >
          <Gallery descriptionDisplay={post.galleryCaptions} entry={post} gallery={gallery} />
        </TooltipWrapper>
      </div>

      <div className={iconWrapper}>
        <DisplayResourceUrlAsIcon
          className="grayscale-[100%] hover:grayscale-[0%]"
          height={21}
          iconType="arrow-up-right-from-square"
          icon_className_Path1="fill-accent-secondary"
          icon_className_Path2="fill-accent"
          isDisabled={isDisabled_Url1}
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
          isDisabled={isDisabled_Url2}
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

      {categoryPosition === "right" && <Category />}
    </div>
  );
};

export default PostLinks;
