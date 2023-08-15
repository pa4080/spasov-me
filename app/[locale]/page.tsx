"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";

import Pages_Feed from "@/components/home/Pages_Feed";

import Logo from "@/components/logo/Logo";
import { useAppContext } from "@/contexts/AppContext";
import { Path } from "@/interfaces/Path";

const Home: React.FC = () => {
	const t = useTranslations("Home");
	const { pages, setPages } = useAppContext();

	useEffect(() => {
		(async () => {
			try {
				const response = await fetch(Path.api.PAGES);

				if (!response.ok) {
					return null;
				}

				const data = (await response.json()).data;

				setPages(data.length > 0 ? data : []);
			} catch (error) {
				return null;
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Logo greeting_ln1={t("greeting.ln1")} greeting_ln2={t("greeting.ln2")} />
			<Pages_Feed className="mt-12 sm580:mt-16 mb-4" pages={pages} />
		</>
	);
};

export default Home;
