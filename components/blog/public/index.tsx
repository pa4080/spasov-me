import React from "react";

import { cn } from "@/lib/cn-utils";
import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";

import { getPosts } from "../_blog.actions";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
  className?: string;
}

const BlogPublic: React.FC<Props> = async ({ className }) => {
  const data = await Promise.all([
    getPosts({
      hyphen: true,
      public: true,
    }),
    getFileList({ prefix: files_prefix }),
    getFileList({ prefix: icons_prefix }),
    getIconsMap(),
    getTags(),
  ]).then(([postHyphenated, fileList, iconList, iconsMap, tags]) => ({
    posts: postHyphenated,
    fileList,
    iconList,
    iconsMap,
    tags,
  }));

  return (
    <div className={cn("space-y-20", className)}>
      <TimeLine {...data} />
    </div>
  );
};

export default BlogPublic;
