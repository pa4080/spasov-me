import React from "react";
import { useTranslations } from "next-intl";

import Files_Feed from "@/components/files/Files_Feed";

const ManageFiles: React.FC = () => {
	const t = useTranslations("Site");

	return (
		<>
			<section>
				<Files_Feed files={[]} />
			</section>
		</>
	);
};

export default ManageFiles;
