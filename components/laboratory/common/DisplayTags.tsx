import Link from "next/link";
import React from "react";

import DisplayIcon from "@/components/shared/DisplayIcon";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";

interface Props {
  className?: string;
  iconsMap: IconsMap;
  tags: TagData[];
  maxCount?: number;
  iconsSize?: number;
}

const DisplayTags: React.FC<Props> = ({
  className,
  iconsMap,
  tags,
  maxCount = 10,
  iconsSize = 28,
}) => {
  const tagsFiltered = maxCount ? tags?.slice(0, maxCount) : tags;

  return (
    <div className={cn("flex flex-wrap gap-0.5 justify-end items-center w-full", className)}>
      {tagsFiltered
        ?.sort((a, b) =>
          a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
        )
        .map((tag) => (
          <Link
            key={tag._id}
            className="m-0 p-0 h-fit"
            href={`${Route.public.SEARCH.uri}?tag=${tag._id}`}
          >
            <DisplayIcon
              key={tag._id}
              className="-mb-1.5"
              description={tag.html.description}
              icon={iconsMap[tag.icon]}
              size={iconsSize}
            />
          </Link>
        ))}
    </div>
  );
};

export default DisplayTags;
