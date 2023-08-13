"use client";

import React from "react";
import { useTranslations } from "next-intl";

import HomePage_Logo from "@/components/home/Logo";
import AddPageForm from "@/components/home/Pages_AddDialog";
import { useAppContext } from "@/contexts/AppContext";

const Home: React.FC = () => {
	const t = useTranslations("Home");
	const { logoScaleFactor } = useAppContext();

	return (
		<div
			style={{
				opacity: logoScaleFactor > 0 ? 1 : 0,
			}}
		>
			<HomePage_Logo greeting_ln1={t("greeting.ln1")} greeting_ln2={t("greeting.ln2")} />
			<AddPageForm />
		</div>
	);
};

export default Home;
