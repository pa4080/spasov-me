import React from "react";

// import dynamic from "next/dynamic";
// const SearchPublic = dynamic(() => import("@/components/search/public"));

const sourceUrl: string = "https://media.spasov.me/spas.spasov_accessKeys_aws.xlsx";
const baseUrl: string = "https://view.officeapps.live.com/op/";
const action: "view" | "embed" = "view";

const Portfolio: React.FC = async () => {
	const srcUrl = baseUrl + action + ".aspx?src=" + sourceUrl;

	return (
		<div className="margin_vh_top margin_vh_bottom scroll-m-40 h-72">
			<iframe height="100.4%" width="100.4%" src={srcUrl} />
		</div>
	);
};

export default Portfolio;
