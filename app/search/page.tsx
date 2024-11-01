import React from "react";

// import dynamic from "next/dynamic";
// const SearchPublic = dynamic(() => import("@/components/search/public"));

import { getEntries } from "@/components/about/_about.actions";
import { getPosts } from "@/components/blog/_blog.actions";
import { getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { getLabEntries } from "@/components/laboratory/_lab.actions";
import { getProjects } from "@/components/portfolio/_portfolio.actions";
import SearchPublic from "@/components/search/public";
import { getTags } from "@/components/tags/_tags.actions";
import { splitDescriptionKeyword } from "@/lib/md/process-markdown";
import { msgs } from "@/messages";

const Portfolio: React.FC = async () => {
  const t = msgs("Search");

  const data = await Promise.all([
    getEntries({ hyphen: true, public: true }),
    getTags({ hyphen: true, public: true }),
    getProjects({ hyphen: true, public: true }),
    getPosts({ hyphen: true, public: true }),
    getLabEntries({ hyphen: true, public: true }),
    getIconsMap(),
  ]).then(([aboutEntries, tags, projects, posts, labEntries, iconsMap]) => ({
    tags: tags ?? [],
    dataList: [
      ...(aboutEntries ?? []),
      ...(projects ?? []),
      ...(labEntries?.map((entry) => ({
        ...entry,
        entryType: "lab" as const,
        html: {
          ...entry.html,
          description: entry.html.description.split(splitDescriptionKeyword)[0],
        },
        description: entry.description.split(splitDescriptionKeyword)[0],
      })) ?? []),
      ...(posts ?? []),
    ],
    iconsMap,
  }));

  return (
    <div className="margin_vh_top scroll-mt-40 min-h-contentShortPage">
      <h1 className="section_title">{t("title")}</h1>
      <SearchPublic {...data} />
    </div>
  );
};

export default Portfolio;
