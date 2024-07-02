import React from "react";

import { getFilesR2 } from "@/components/files-cloudflare/_files.actions";
import FilesAdmin_CloudFlare from "@/components/files-cloudflare/admin";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

const Icons: React.FC = async () => {
	const files = await getFilesR2({ prefix: files_prefix });

	return (
		<FilesAdmin_CloudFlare
			className="margin_vh_top margin_vh_bottom scroll-m-40"
			files={files}
			visibleItemsCommon={500}
		/>
	);
};

export default Icons;
