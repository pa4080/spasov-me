import React from "react";
import { useTranslations } from "next-intl";

import SiteLogo from "@/components/fragments/SiteLogo";

const Portfolio: React.FC = () => {
	const t = useTranslations("Site");

	return (
		<section className="">
			<header className="text-center">
				<SiteLogo size="3xl" textBreakpoint="xs" textHidePoint="none" />
			</header>
		</section>
	);
};

export default Portfolio;
