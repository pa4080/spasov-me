import React from "react";
import { useTranslations } from "next-intl";

import SiteLogo_ManualBreak from "@/components/fragments/SiteLogo_ManualBreak";

const Portfolio: React.FC = () => {
	const t = useTranslations("Site");

	return (
		<section className="">
			<header className="text-center">
				<SiteLogo_ManualBreak fontSize={18} />
				<br />
				<SiteLogo_ManualBreak fontSize={28} shouldBreakText={true} textBreakRelativeSize={0.7} />
			</header>
		</section>
	);
};

export default Portfolio;
