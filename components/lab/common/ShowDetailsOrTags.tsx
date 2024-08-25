"use client";
import React from "react";

import { useAppContext } from "@/contexts/AppContext";

import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";

import DetailsButton from "./DetailsButton";
import DisplayTags from "./DisplayTags";

interface Props {
	slug: string;
	iconsMap: IconsMap;
	tags: TagData[];
}

const ShowDetailsOrTags: React.FC<Props> = ({ slug, iconsMap, tags }) => {
	const { session } = useAppContext();

	return session ? (
		<DetailsButton slug={slug} />
	) : (
		<DisplayTags
			className="-mb-1 scale-100 flex flex-direction-row gap-1 origin-left"
			iconsMap={iconsMap}
			tags={tags}
		/>
	);
};

export default ShowDetailsOrTags;
