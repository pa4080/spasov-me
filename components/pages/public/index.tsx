import React from "react";

import { getIconsMap } from "@/components/files-cloudflare/_files.actions";
import { Route } from "@/routes";

import { getPageCards } from "../_pages.actions";
import PagesPublic_Card from "./Card";

interface Props {
  className?: string;
}

const PagesPublic: React.FC<Props> = async ({ className }) => {
  const inFeed = Object.values(Route.public)
    .filter((route) => route.inFeed)
    .map((route) => route.uri.replace("/", ""));

  const { pages, iconsMap } = await Promise.all([
    getPageCards({ public: true }),
    getIconsMap(),
  ]).then(([pages, iconsMap]) => ({
    pages: pages?.filter((page) => inFeed.includes(page.uri)),
    iconsMap,
  }));

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-12 md:gap-10 lg:gap-14">
        {pages?.map((page) => <PagesPublic_Card key={page._id} iconsMap={iconsMap} page={page} />)}
      </div>
    </div>
  );
};

export default PagesPublic;
