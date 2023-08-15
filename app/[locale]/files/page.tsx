import React from "react";
import { useTranslations } from "next-intl";

import SiteLogo_ManualBreak from "@/components/logo/SiteLogo_ManualBreak";

const ManageFiles: React.FC = () => {
	const t = useTranslations("Site");

	return (
		<section className="">
			<header className="text-center">
				<SiteLogo_ManualBreak />
			</header>
		</section>
	);
};

export default ManageFiles;
