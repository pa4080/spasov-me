import React from "react";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getTags } from "@/components/tags/_tags.actions";
import { projectTuple } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";
import { files_prefix, icons_prefix } from "@/lib/redis";

import { getProjects } from "../_portfolio.actions";
import TimeLine from "./TimeLine";

interface Props {
  className?: string;
}

const PortfolioAdmin: React.FC<Props> = async ({ className }) => {
  const data = await Promise.all([
    getProjects({ hyphen: true }),
    getFileList({ prefix: files_prefix }),
    getFileList({ prefix: icons_prefix }),
    getIconsMap(),
    getTags(),
  ]).then(([projects, fileList, iconList, iconsMap, tags]) => ({
    projects,
    fileList,
    iconList,
    iconsMap,
    tags,
  }));

  return (
    <div className={cn("space-y-20", className)}>
      {projectTuple.map((type) => (
        <TimeLine key={type} type={type} visibleItems={25} {...data} />
      ))}
    </div>
  );
};

export default PortfolioAdmin;
