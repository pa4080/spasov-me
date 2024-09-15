import React from "react";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";

interface Props {
	tags: TagData[];
	onTagClick: (tag: TagData) => void;
	selectedTag: TagData | null;
	iconsMap: IconsMap;
}

const TagFilter: React.FC<Props> = ({ tags, onTagClick, selectedTag, iconsMap }) => {
	return (
		<div className="flex flex-wrap gap-2 items-center justify-start">
			{tags?.length > 0
				? tags?.map((tag) => (
						<DisplayIcon
							key={tag._id}
							className={`${tag._id === selectedTag?._id ? "ring-2 ring-accent" : ""}`}
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
