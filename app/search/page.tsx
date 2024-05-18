import React from "react";

import SearchPublic from "@/components/search/public";

const Portfolio: React.FC = () => {
	return (
		<div className="margin_vh_top margin_vh_bottom scroll-m-40">
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
