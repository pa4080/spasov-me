import React from "react";
import { useTranslations } from "next-intl";

import SiteLogo from "@/components/fragments/SiteLogo";

const Blog: React.FC = () => {
	const t = useTranslations("Site");

	return (
		<section className="">
			<header className="text-center">
				<SiteLogo size="3xl" />
			</header>
		</section>
	);
};

export default Blog;
