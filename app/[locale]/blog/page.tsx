import React from "react";
import { useTranslations } from "next-intl";

import SiteLogo_ManualBreak from "@/components/fragments/SiteLogo_ManualBreak";

const Blog: React.FC = () => {
	const t = useTranslations("Site");

	return (
		<section className="">
			<header className="text-center">
				<SiteLogo_ManualBreak />
			</header>
		</section>
	);
};

export default Blog;
