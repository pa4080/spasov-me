import React from "react";

import HomePage_PagesFeed from "@/components/pages/sr";
import SiteLogo from "@/components/layouts/logo/SiteLogo";
import { msgs } from "@/messages";

const Home: React.FC = async () => {
	const t = msgs("Home");

	return (
		<>
			<SiteLogo
				className="w-full margin_vh_top"
				greeting_ln1={t("greeting_ln1")}
				greeting_ln2={t("greeting_ln2")}
			/>
			<HomePage_PagesFeed className="margin_vh_middle margin_vh_bottom" />
		</>
	);
};

export default Home;
