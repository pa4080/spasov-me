import React from "react";

import FilesAdmin_CloudFlare from "@/components/files-cloudflare/admin";
import { icons_prefix } from "@/lib/redis";

export const dynamic = "force-dynamic";

const Icons: React.FC = () => {
  return (
    <FilesAdmin_CloudFlare
      className="margin_vh_top margin_vh_bottom scroll-mt-40"
      files_prefix={icons_prefix}
      visibleItemsCommon={10}
    />
  );
};

export default Icons;
