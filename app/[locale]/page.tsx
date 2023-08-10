import React from "react";
import { useTranslations } from "next-intl";

import Feed from "@/components/Feed";
import SiteLogo from "@/components/fragments/SiteLogo";

const Home: React.FC = () => {
	const t = useTranslations("Home");

	return (
		<>
			<SiteLogo size="3xl" />

			<Feed />
		</>
	);
};

export default Home;
