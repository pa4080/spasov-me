import React from "react";

import messages from "@/messages/en.json";
import HomePages from "@/components/home-page";
import SiteLogo from "@/components/logo/SiteLogo";

const Home: React.FC = async () => {
	const {
		greeting: { ln1, ln2 },
	} = messages.Home;

	return (
		<>
			<SiteLogo className="w-full mt-20" greeting_ln1={ln1} greeting_ln2={ln2} />
			<HomePages className="mt-12 mb-20" />
		</>
	);
};

export default Home;
