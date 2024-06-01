import React from "react";

// import dynamic from "next/dynamic";
// const SearchPublic = dynamic(() => import("@/components/search/public"));

import { getEntries } from "@/components/about/_about.actions";
import { getProjects } from "@/components/portfolio/_portfolio.actions";
import SearchPublic from "@/components/search/public";
import { getTags } from "@/components/tags/_tags.actions";
import { msgs } from "@/messages";

const Portfolio: React.FC = async () => {
	const t = msgs("Search");

	const data = await Promise.all([
		getEntries({ hyphen: true, public: true }),
		getTags({ hyphen: true, public: true }),
		getProjects({ hyphen: true, public: true }),
	]).then(([aboutEntries, tags, projects]) => ({
		tags: tags ?? [],
		dataList: [...(aboutEntries ?? []), ...(projects ?? [])],
	}));

	return (
		<div className="margin_vh_top margin_vh_bottom scroll-m-40">
			<h1 className="section_title">{t("title")}</h1>
			<SearchPublic {...data} />
		</div>
	);
};

export default Portfolio;
