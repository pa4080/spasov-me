import React from "react";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getFileList_mongo } from "@/components/files-mongodb/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { labEntryTuple } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";

import { getLabEntries } from "../_lab.actions";
import Section from "./Section";

// const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";
const icons_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS || "icons";

interface Props {
  className?: string;
}

const LabAdmin: React.FC<Props> = async ({ className }) => {
  const [labEntries, tags, fileList, iconList, iconsMap] = await Promise.all([
    getLabEntries({ hyphen: true }),
    getTags(),
    getFileList_mongo(),
    getFileList({ prefix: icons_prefix }),
    getIconsMap(),
  ]);

  return (
    <div className={cn("space-y-20", className)}>
      {labEntryTuple.map((type) => (
        <Section
          key={type}
          fileList={fileList}
          iconList={iconList}
          iconsMap={iconsMap}
          labEntries={labEntries}
          tags={tags}
          type={type}
          visibleItems={2}
        />
      ))}
    </div>
  );
};

export default LabAdmin;
