import React from "react";
import { useTranslations } from "next-intl";

import HomePage_Logo from "@/components/HomePage_Logo";
import AddPageForm from "@/components/Form_AddPage";

const Home: React.FC = () => {
	const t = useTranslations("Home");

	return (
		<>
			<HomePage_Logo greeting_ln1={t("greeting.ln1")} greeting_ln2={t("greeting.ln2")} />

			<AddPageForm />
		</>
	);
};

export default Home;
