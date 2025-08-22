import React from "react";

import DisplayIcon from "@/components/shared/DisplayIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";

interface Props {
  tags: TagData[];
  onTagClick: (tag: TagData) => void;
  selectedTag: string | null;
  iconsMap: IconsMap;
}

const TagFilter: React.FC<Props> = ({
  tags,
  onTagClick,
  selectedTag: selectedTag_id,
  iconsMap,
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-start">
      {tags?.length > 0
        ? tags?.map((tag) => (
            <DisplayIcon
              key={tag._id}
              className={`${tag._id === selectedTag_id ? "ring-2 ring-accent" : ""}`}
              className_TooltipTrigger="!mt-0"
              description={tag.html.description}
              icon={iconsMap[tag.icon]}
              onClick={() => onTagClick(tag)}
            />
          ))
        : Array.from({ length: 82 }).map((_, i) => (
            <Skeleton
              key={i}
              className="hover:bg-muted-secondary bg-primary py-1 px-1 rounded-sm saturate-150"
            >
              <div
                className=""
                style={{
                  width: "23px",
                  height: "22px",
                  minWidth: "23px",
                }}
              ></div>
            </Skeleton>
          ))}
    </div>
  );
};

export default TagFilter;
