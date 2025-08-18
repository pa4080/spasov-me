import { format } from "date-fns";
import { enUS as en } from "date-fns/locale";
import dynamic from "next/dynamic";
import React from "react";

import IconCircleWrapper from "@/components/shared/IconCircleWrapper";
import Loading from "@/components/shared/Loading";
import SectionHeader from "@/components/shared/SectionHeader";
import TechTags from "@/components/shared/TechTags";
import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type PostData } from "@/interfaces/Post";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/md/process-markdown";

import PostLinks from "../../common/PostLinks";

const GalleryCarousel = dynamic(() => import("@/components/shared/Gallery/GalleryCarousel"), {
  ssr: true,
  loading: () => (
    <Loading className="h-auto w-auto max-h-[74vh] mx-auto" maxHeight="100%" scale={4} />
  ),
});

interface Props {
  className?: string;
  post: PostData;
  tags: TagData[] | null;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  iconsMap: IconsMap;
}

const BlogPublicPost: React.FC<Props> = async ({
  className,
  post,
  tags,
  fileList,
  iconList,
  iconsMap,
}) => {
  const descriptionArr = post.html.description.split(splitDescriptionKeyword).map((str) => {
    return str.replace(commentsMatcher, "");
  });

  const gallery = post?.gallery
    ?.map((file) => file.metadata.html)
    ?.sort((a, b) => a.filename.localeCompare(b.filename));

  // If we need to display the attachment within the gallery we can add it there;
  // Right now the attachment is only used for the blog post card's cover image.
  // gallery =
  // 	post?.html?.attachment && gallery
  // 		? [post?.html?.attachment.metadata.html].concat(gallery)
  // 		: gallery;

  const dtFrom = new Date(post.dateFrom);
  const dateLabel = format(dtFrom, "dd MMM yyyy", { locale: en });

  return (
    <div className={cn("w-full pt-8 sa:pt-6 lg:pt-1", className)}>
      {post.galleryDisplay && (
        <GalleryCarousel
          descriptionDisplay={post.galleryCaptions}
          entryData={post}
          gallery={gallery}
          navPosition="bottom"
          navType={post.galleryNav ? "embedded" : "none"}
        />
      )}
      <SectionHeader
        className="pop-header mt-6 1xl:mt-[1.15rem] relative justify-end"
        className_Actions="absolute right-0 -bottom-3"
        iconComponent={
          post.galleryNav ? undefined : (
            <IconCircleWrapper
              alt={post.title}
              className="min-w-[3.74rem] w-[3.74rem] min-h-[3.74rem] h-[3.74rem] drop-shadow-2xl"
              className_Image="size-12"
              src={post.html.icon?.metadata.html.fileUrl ?? post.html.icon?.metadata.html.fileUri}
              unoptimized={post.html.icon?.filename.match(/\.svg$/) ? true : false}
            />
          )
        }
        label={dateLabel}
        title={post.html.title}
      >
        <PostLinks
          categoryPosition="left"
          classNameCategory="tracking-wider mr-1 translate-y-[1px]"
          fileList={fileList}
          iconList={iconList}
          iconsMap={iconsMap}
          post={post}
          tags={tags}
        />
      </SectionHeader>

      {/* @see https://github.com/tailwindlabs/tailwindcss-typography */}
      <article className="prose lg:prose-lg max-w-none xa:text-justify">
        <div
          dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
          className="font-semibold tracking-wide text-xl"
        />
        {descriptionArr.length > 1 && (
          <div dangerouslySetInnerHTML={{ __html: descriptionArr[1] }} className="post-body" />
        )}
      </article>

      <TechTags className="mt-20" iconsMap={iconsMap} tags={post.tags} />
    </div>
  );
};

export default BlogPublicPost;
