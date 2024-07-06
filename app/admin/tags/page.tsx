import React from "react";

import TagsAdmin from "@/components/tags/admin";

//nextjs.org/docs/messages/app-static-to-dynamic-error
// export const dynamic = 'force-static';
export const dynamic = "force-dynamic";

const Pages: React.FC = () => {
	return <TagsAdmin className="margin_vh_top margin_vh_bottom scroll-m-40" />;
};

export default Pages;
