import React from "react";
import { useTranslations } from "next-intl";

import SiteLogo_ManualBreak from "@/components/fragments/SiteLogo_ManualBreak";

const ManageFiles: React.FC = () => {
	const t = useTranslations("Site");

	return (
		<section className="">
			<header className="text-center">
				<SiteLogo_ManualBreak size="3xl" />
			</header>
		</section>
	);
};

export default ManageFiles;
