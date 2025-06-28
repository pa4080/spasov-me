import Link from "next/link";
import React from "react";

import DisplayFileImageOrEmbed from "@/components/fragments/DisplayFileImageOrEmbed";
import IconCircleWrapper from "@/components/fragments/IconCircleWrapper";
import { Button } from "@/components/ui/button";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type PostData } from "@/interfaces/Post";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { msgs } from "@/messages";
import { Route } from "@/routes";
import styles from "app/_styles/card.module.css";

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
    <div
      className={`${styles.card} group scroll-mt-24 3xl:scroll-mt-8 ${className}`}
      id={`post_${post._id}`}
    >
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
          src={post.html.icon?.metadata.html.fileUrl ?? post.html.icon?.metadata.html.fileUri}
          unoptimized={post.html.icon?.filename.match(/\.svg$/) ? true : false}
        />

        <div
          dangerouslySetInnerHTML={{ __html: post.html.title }}
          className="text-lg font-semibold line-clamp-2 flex-shrink leading-5 text-balance"
        />
      </div>

      {/* Description */}
      <div
        dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
        className="flex-grow line-clamp-2 pl-2"
      />

      {/* Footer buttons */}
      <div
        className={cn(
          "flex flex-row items-center justify-between w-full",
          "gap-4 flex-col",
          "2xs:gap-2 2xs:flex-row",
          "md:gap-4 md:flex-col",
          "mc:gap-2 mc:flex-row"
        )}
      >
        <PostLinks
          categoryPosition="right"
          className="max-2xs:self-start md:max-mc:self-start"
          classNameCategory="2xs:tracking-wide max-2xs:max-w-[4.95rem] overflow-hidden text-ellipsis whitespace-nowrap"
          fileList={fileList}
          iconList={iconList}
          iconsMap={iconsMap}
          post={post}
          tags={tags}
        />
        <Link
          area-label={t("area_label_card_link")}
          className="max-2xs:self-end md:max-mc:self-end"
          href={`${Route.public.BLOG.uri}/${post.slug}`}
        >
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
