import React from "react";

import messages from "@/messages/en.json";
import HomePage_PagesFeed from "@/components/home-page-sr";
import SiteLogo from "@/components/logo/SiteLogo";

const Home: React.FC = async () => {
	const {
		greeting: { ln1, ln2 },
	} = messages.Home;

	return (
		<>
			<SiteLogo className="w-full margin_vh_top" greeting_ln1={ln1} greeting_ln2={ln2} />
			<HomePage_PagesFeed className="margin_vh_middle margin_vh_bottom" />
		</>
	);
};

export default Home;
