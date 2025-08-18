import React from "react";

import DisplayIcon from "@/components/shared/DisplayIcon";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import DeleteTag from "../Actions/DeleteTag";
import UpdateTag from "../Actions/UpdateTag";

export interface GenericActionProps {
  className?: string;
  tag: TagData;
  iconsMap: IconsMap;
}

const TagCard: React.FC<GenericActionProps> = ({ tag, className, iconsMap }) => {
  const {
    name,
    html: { description },
    icon,
    tagType,
    orderKey,
  } = tag;

  const t = msgs("Tags_Display");
  const tForm = msgs("Tags_Form");

  return (
    <div
      className={cn("scroll-mt-24 3xl:scroll-mt-8 relative group", className)}
      id={`tag_${tag._id}`}
    >
      <div
        className={cn(
          "card-shadow",
          "bg-card/[50%] md:bg-card/[25%] dark:bg-card/[25%] rounded-2xl h-full p-4 min-h-fit border-4 border-transparent",
          "hover:bg-popover/[80%] hover:border-muted/60 dark:hover:border-primary/60",
          "group-target:border-primary/80",
          "grid grid-cols-[7rem_1fr] gap-y-2"
        )}
      >
        <div className="flex gap-2 absolute right-0 bottom-0 p-4 rounded-2xl">
          <DeleteTag tag={tag} />
          <UpdateTag iconsMap={iconsMap} tag={tag} tagType={tag.tagType} />
        </div>

        <div className="">{t("name")}:</div>
        <div className="line-clamp-1 font-semibold">{name}</div>

        <div className="">{t("description")}:</div>
        <div dangerouslySetInnerHTML={{ __html: description }} className="line-clamp-1" />

        <div className="">{t("type")}:</div>
        <div className="line-clamp-1">
          {(tForm("tag_type_list") as unknown as Record<string, string>)[tagType]}
        </div>

        <div className="">{t("orderKey")}:</div>
        <div className="line-clamp-1">{orderKey}</div>

        <div className="">{t("icon")}:</div>
        <div className="line-clamp-1">
          <DisplayIcon icon={iconsMap[icon]} />
        </div>
      </div>
    </div>
  );
};

export default TagCard;
