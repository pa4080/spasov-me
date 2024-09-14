import React from "react";

import FilesAdmin_CloudFlare from "@/components/files-cloudflare/admin";

const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

const Icons: React.FC = () => {
	return (
		<FilesAdmin_CloudFlare
			className="margin_vh_top margin_vh_bottom scroll-m-40"
			files_prefix={icons_prefix}
			visibleItemsCommon={500}
		/>
	);
};

export default Icons;
