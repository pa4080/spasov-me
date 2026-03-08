import React from "react";

import { getFilesR2 } from "../_files.actions";
import styles from "../_files.module.css";
import List_FilesAdmin_CloudFlare from "./List";

interface Props {
  className?: string;
  files_prefix: string;
  visibleItemsCommon?: number;
}

const FilesAdmin_CloudFlare: React.FC<Props> = async ({
  className,
  files_prefix,
  visibleItemsCommon = 3,
}) => {
  const files = await getFilesR2({ prefix: files_prefix });

  return (
    <div className={`${styles.files} ${className}`}>
      <List_FilesAdmin_CloudFlare
        files={files}
        files_prefix={files_prefix}
        visibleItemsCommon={visibleItemsCommon}
      />
    </div>
  );
};

export default FilesAdmin_CloudFlare;
