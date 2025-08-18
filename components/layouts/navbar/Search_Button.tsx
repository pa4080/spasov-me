import Link from "next/link";
import React from "react";

import IconEmbedSvg from "@/components/shared/IconEmbedSvg";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";
import { Route } from "@/routes";

interface Props {
  className?: string;
}

const Search_Button: React.FC<Props> = ({ className }) => {
  const t = msgs("Navigation");

  return (
    <Link
      aria-label={t("searchButton")}
      className={cn(
        "h-8 w-9 flex items-center justify-center rounded-md grayscale hover:grayscale-0 hover:bg-accent-secondary/20 bg-accent-secondary/20 hover:brightness-110 active:brightness-75 transition-colors duration-300",
        className
      )}
      href={Route.public.SEARCH.uri}
    >
      <IconEmbedSvg type="magnifying-glass" />
    </Link>
  );
};

export default Search_Button;
