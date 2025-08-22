import React from "react";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import TechTags from "@/components/shared/TechTags";
import { getTags } from "@/components/tags/_tags.actions";
import { cn } from "@/lib/cn-utils";

import { getEntries } from "../_about.actions";
import BusinessCard from "./BusinessCard";
import SpokenLanguages from "./Languages";
import Resume from "./Resume";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";

interface Props {
  className?: string;
}

const AboutPublic: React.FC<Props> = async ({ className }) => {
  const data = await Promise.all([
    getEntries({
      hyphen: true,
      typeList: ["employment", "education", "resume"],
      public: true,
    }),

    getEntries({
      hyphen: false,
      typeList: ["businessCard", "spokenLanguages"],
      public: true,
    }),
    getFileList({ prefix: files_prefix }),
    getIconsMap(),
    getTags({ hyphen: true, public: true }),
  ]).then(([entriesHyphenated, entriesClear, fileList, iconsMap, tags]) => ({
    entriesHyphenated,
    entriesClear,
    fileList,
    iconsMap,
    tags,
  }));

  const { entriesHyphenated, entriesClear, fileList, iconsMap, tags } = data;

  return (
    <div className={cn("space-y-20 scroll-mt-24 3xl:scroll-mt-8", className)}>
      <BusinessCard
        className="about-cards-section list-section scroll-mt-24 3xl:scroll-mt-8"
        entries={entriesClear}
        fileList={fileList}
        iconsMap={iconsMap}
        tags={tags}
        type="businessCard"
      />
      <Resume
        className="about-cards-section list-section scroll-mt-24 3xl:scroll-mt-8"
        entries={entriesHyphenated}
        fileList={fileList}
        iconsMap={iconsMap}
        tags={tags}
        type="resume"
      />
      <TimeLine
        className="about-cards-section list-section scroll-mt-24 3xl:scroll-mt-8"
        displayTags={true}
        entries={entriesHyphenated}
        fileList={fileList}
        iconsMap={iconsMap}
        tags={tags}
        type="employment"
      />
      <TimeLine
        className="about-cards-section list-section scroll-mt-24 3xl:scroll-mt-8"
        displayTags={true}
        entries={entriesHyphenated}
        fileList={fileList}
        iconsMap={iconsMap}
        tags={tags}
        type="education"
        visibleItems={2}
      />
      <SpokenLanguages
        className="about-cards-section list-section scroll-mt-24 3xl:scroll-mt-8"
        entries={entriesClear}
        type="spokenLanguages"
      />
      <TechTags
        className="about-cards-section list-section scroll-mt-24 3xl:scroll-mt-8"
        iconsMap={iconsMap}
        tags={tags}
      />
    </div>
  );
};

export default AboutPublic;
