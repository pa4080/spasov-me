import React from "react";

import SearchPublic from "@/components/search/public";
import { msgs } from "@/messages";

const Portfolio: React.FC = () => {
	const t = msgs("Search");

	return (
		<div className="margin_vh_top margin_vh_bottom scroll-m-40">
			<h1 className="section_title">{t("title")}</h1>
			<SearchPublic />
		</div>
	);
};

export default Portfolio;
