import React from "react";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";

import { getPageCards } from "../_pages.actions";
import styles from "../_pages.module.css";
import Section from "./Section";

interface Props {
  className?: string;
}

const PagesAdmin: React.FC<Props> = async ({ className }) => {
  const pages = await getPageCards({ public: false });
  const fileList = await getFileList();
  const iconsMap = await getIconsMap();

  return (
    <div className={`${styles.pages} ${className}`}>
      <Section fileList={fileList} iconsMap={iconsMap} pages={pages} type="common" />
    </div>
  );
};

export default PagesAdmin;
