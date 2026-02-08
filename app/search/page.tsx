import dynamic from "next/dynamic";
import React from "react";

const SearchPublic = dynamic(() => import("@/components/search/public"));

const Search: React.FC = () => {
  return (
    <div className="margin_vh_top scroll-mt-40 max-3xl:min-h-contentShortPage">
      <SearchPublic />
    </div>
  );
};

export default Search;
