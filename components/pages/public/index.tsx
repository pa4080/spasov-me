import React from "react";

import { getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getPageCards } from "../_pages.actions";
import PagesPublic_Card from "./Card";

interface Props {
	className?: string;
}

const PagesPublic: React.FC<Props> = async ({ className }) => {
	const pages = await getPageCards({ public: true });
	const iconsMap = await getIconsMap();

	return (
		<div className={className}>
			<div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
				{pages?.map((page) => <PagesPublic_Card key={page._id} page={page} iconsMap={iconsMap} />)}
			</div>
		</div>
	);
};

export default PagesPublic;
