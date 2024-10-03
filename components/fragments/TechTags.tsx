import React from "react";

import Link from "next/link";

import DisplayIcon from "@/components/fragments/DisplayIcon";
import SectionHeader from "@/components/fragments/SectionHeader";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";
import { cn } from "@/lib/cn-utils";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import { Route } from "@/routes";

interface Props {
	className?: string;
	tags: TagData[] | null;
	iconsMap: IconsMap;
}

const TechTags: React.FC<Props> = ({ className, tags, iconsMap }) => {
	const t = msgs("TechTags");

	const section_title = t(`title`);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_techTags`);

	return (
		<div
			className={cn("scroll-mt-24 3xl:scroll-mt-8 list-section", className)}
			id={toggle_target_id}
		>
			<SectionHeader className="pop-header" title={section_title} />

			<div className="flex flex-wrap gap-2 items-center justify-start pop-item">
				{tags?.map((tag) => (
					<Link key={tag._id} href={`${Route.public.SEARCH.uri}?tag=${tag._id}`}>
						<DisplayIcon
							className_TooltipTrigger="!mt-0"
							description={tag.html.description}
							icon={iconsMap[tag.icon]}
						/>
					</Link>
				))}
			</div>
		</div>
	);
};

export default TechTags;
