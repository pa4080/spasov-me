import React from "react";
import { useTranslations } from "next-intl";

import Feed from "@/components/Feed";
import SiteLogo from "@/components/fragments/SiteLogo";

const Home: React.FC = () => {
	const t = useTranslations("Home");

	return (
		<section className="">
			<header className="text-center">
				<SiteLogo />
			</header>

			<Feed />
		</section>
	);
};

export default Home;
