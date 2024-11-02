import React from "react";

import FilesAdmin_MongoDB from "@/components/files-mongodb/admin";

export const dynamic = "force-dynamic";

const Files: React.FC = () => {
  return <FilesAdmin_MongoDB className="margin_vh_top margin_vh_bottom scroll-mt-40" />;
};

export default Files;
