"use client";
import React from "react";

import { useAppContext } from "@/contexts/AppContext";
import { postTuple } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";

import TimeLine from "./TimeLine";

interface Props {
  className?: string;
}

const BlogAdmin: React.FC<Props> = ({ className }) => {
  const { posts, tags, fileList, iconList, iconsMap } = useAppContext();

  return (
    <div className={cn("space-y-20", className)}>
      {postTuple.map((type) => (
        <TimeLine
          key={type}
          fileList={fileList}
          iconList={iconList}
          iconsMap={iconsMap}
          posts={posts}
          tags={tags}
          type={type}
          visibleItems={2}
        />
      ))}
    </div>
  );
};

export default BlogAdmin;
