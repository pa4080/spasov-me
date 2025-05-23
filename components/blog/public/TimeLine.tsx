import React from "react";

import { type FileListItem } from "@/interfaces/File";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type PostData } from "@/interfaces/Post";
import { type TagData } from "@/interfaces/Tag";
import { type PostType } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";

import BlogPublic_Card from "./Card";

interface Props {
  className?: string;
  type?: PostType;
  posts: PostData[] | null;
  fileList: FileListItem[] | null;
  iconList: FileListItem[] | null;
  tags: TagData[] | null;
  iconsMap: IconsMap;
}

/**
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"...
 *
 * We won't filter the posts by type because we want to show all posts,
 * ordered by date... probably we need may indicate the type by a icon?(!?)
 */
const TimeLine: React.FC<Props> = ({ className, posts, fileList, iconList, tags, iconsMap }) => {
  const postsByType = posts?.sort((b, a) => a.dateFrom.getTime() - b.dateFrom.getTime());

  return (
    <div className={cn("blog-cards-section scroll-mt-24 3xl:scroll-mt-8", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
        {postsByType?.map((post, index) => (
          <BlogPublic_Card
            key={index}
            className=""
            fileList={fileList}
            iconList={iconList}
            iconsMap={iconsMap}
            post={post}
            tags={tags}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeLine;
