import React from "react";

import SearchPublic from "@/components/search/public";
import { msgs } from "@/messages";

const Portfolio: React.FC = () => {
	const t = msgs("Search");

	return (
		<div className="margin_vh_top margin_vh_bottom scroll-m-40">
			<h1 className="section_title">{t("title")}</h1>
			<SearchPublic />

			<br />
			<br />
			<br />
			<a href="/about?id=entry_65991ea62c5656013d1eae06">
				/about?id=entry_65991ea62c5656013d1eae06
			</a>
			<br />
			<a href="/portfolio?id=project_65db8c233e7b3ef74e682f9b">
				/portfolio?id=project_65db8c233e7b3ef74e682f9b
			</a>
			<br />
			<a href="/portfolio/promptopia-mlt">/portfolio/promptopia-mlt</a>
		</div>
	);
};

export default Portfolio;
