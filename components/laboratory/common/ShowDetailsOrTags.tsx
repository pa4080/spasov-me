"use client";
import React from "react";

import { useAppContext } from "@/contexts/AppContext";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";

import DetailsButton from "./DetailsButton";
import DisplayTags from "./DisplayTags";

interface Props {
  slug: string;
  iconsMap: IconsMap;
  tags: TagData[];
  className?: string;
}

const ShowDetailsOrTags: React.FC<Props> = ({ slug, iconsMap, tags, className }) => {
  const { session } = useAppContext();

  return session ? (
    <DetailsButton className={cn("max-2xs:self-end", className)} slug={slug} />
  ) : (
    <DisplayTags
      className={cn(
        "scale-100 flex flex-direction-row gap-x-1 gap-y-0 origin-left",
        "items-center justify-start 2xs:justify-end translate-y-0.5",
        className
      )}
      iconsMap={iconsMap}
      tags={tags}
    />
  );
};

export default ShowDetailsOrTags;
