import React from "react";
import { useTranslations } from "next-intl";

import HomePage_Logo from "@/components/HomePage_Logo";

const Home: React.FC = () => {
	const t = useTranslations("Home");

	return (
		<>
			<header>
				<HomePage_Logo greeting_ln1={t("greeting.ln1")} greeting_ln2={t("greeting.ln2")} />
			</header>
		</>
	);
};

export default Home;
