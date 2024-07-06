import React from "react";

import { generateIconIndex } from "@/components/files-cloudflare/_files.actions";
import TagsAdmin from "@/components/tags/admin";

const Pages: React.FC = async () => {
	const iconIndex = await generateIconIndex();
	console.log(iconIndex);
	return <TagsAdmin className="margin_vh_top margin_vh_bottom scroll-m-40" />;
};

export default Pages;
