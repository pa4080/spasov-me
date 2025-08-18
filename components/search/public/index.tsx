"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";

import IconEmbedSvg from "@/components/shared/IconEmbedSvg";
import SectionHeader from "@/components/shared/SectionHeader";
import TooltipWrapper from "@/components/shared/TooltipWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { type IconsMap } from "@/interfaces/IconsMap";
import { type TagData } from "@/interfaces/Tag";
import { postTuple, projectTuple } from "@/interfaces/_common-data-types";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import CheckList_AtLeastOne, { type CheckListItem } from "../../shared/CheckList_AtLeastOne";
import TagFilter from "./TagsFilter";
import TimeLine from "./TimeLine";
import { type UnitedEntryType } from "./type";
import { type CheckListItemModelType, filterItems_byCats } from "./utils/filterItems_byCats";
import { filterItems_byTag } from "./utils/filterItems_byTag";
import { filterItems_byText } from "./utils/filterItems_byText";

interface Props {
  className?: string;
  tags: TagData[];
  dataList: UnitedEntryType[];
  iconsMap: IconsMap;
}

const SearchPublic: React.FC<Props> = ({ className, tags, dataList, iconsMap }) => {
  const t = msgs("Search");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState<UnitedEntryType[] | null>(dataList);

  const defaultCategories = useMemo<CheckListItemModelType[]>(
    () => [
      { key: "prj", selected: true, label: t("cat_filter_projects"), modelType: "Project" },
      { key: "lbs", selected: true, label: t("cat_filter_labs"), modelType: "LabEntry" },
      { key: "cv", selected: true, label: t("cat_filter_about"), modelType: "AboutEntry" },
      { key: "blg", selected: true, label: t("cat_filter_blog"), modelType: "Post" },
    ],
    [t]
  );

  const searchValue = searchParams.get("value");
  const selectedTagQuery = searchParams.get("tag");
  const selectedCatsQuery = searchParams.get("cats");
  const selectedSearchMode = searchParams.get("mode");

  const setSearchMode = (mode: boolean) => {
    const params = new URLSearchParams(searchParams);

    if (!mode) {
      params.set("mode", "exact");
    } else {
      params.delete("mode");
    }

    router.replace(pathname + "?" + params.toString(), {
      scroll: false,
    });
  };

  const setTag = (tag: TagData | null) => {
    const params = new URLSearchParams(searchParams);

    if (tag) {
      params.set("tag", tag._id || "");
    } else {
      params.delete("tag");
    }

    router.replace(pathname + "?" + params.toString(), {
      scroll: false,
    });
  };

  const setSearchValue = (value: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("value", value || "");
    } else {
      params.delete("value");
    }

    router.replace(pathname + "?" + params.toString(), {
      scroll: false,
    });
  };

  const setCategories = useCallback(
    (cats: CheckListItem[]) => {
      const params = new URLSearchParams(searchParams);

      const catParams = cats.filter(({ selected }) => selected).map(({ key }) => key);

      if (catParams.length !== cats.length) {
        params.set("cats", catParams.join("_"));
      } else {
        params.delete("cats");
      }

      router.replace(pathname + "?" + params.toString(), {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (searchValue && searchInputRef?.current) {
      searchInputRef.current.value = searchValue;
    }
  }, [searchValue]);

  useEffect(() => {
    if (selectedTagQuery) {
      const tag = tags.find(({ _id }) => _id === selectedTagQuery);

      tag && setTag(tag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTagQuery]);

  const categories = useMemo(() => {
    if (selectedCatsQuery) {
      const cats = selectedCatsQuery.split("_");

      return defaultCategories.map((cat) =>
        cats.includes(cat.key) ? { ...cat, selected: true } : { ...cat, selected: false }
      );
    }

    return defaultCategories;
  }, [defaultCategories, selectedCatsQuery]);

  useEffect(() => {
    startTransition(() => {
      const result_text_filter = filterItems_byText({
        searchValue,
        items: dataList,
        searchMode: selectedSearchMode === "exact" ? "exact" : "hungry",
      });
      const result_tag_filter = filterItems_byTag({
        items: result_text_filter,
        tags: tags,
        selectedTagQuery,
      });

      const result_cat_filter = filterItems_byCats({
        categories,
        items: result_tag_filter,
      });

      const results = searchValue || selectedTagQuery ? result_cat_filter : result_tag_filter;

      setSearchResults(results);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, dataList]);

  const clearButtonClasses =
    "h-6 w-7 flex items-center justify-center rounded-md grayscale hover:grayscale-0 hover:brightness-110 active:brightness-75 transition-colors duration-300 hover:bg-primary-foreground/20"; // bg-accent-secondary/20

  const showResults =
    searchResults && searchResults.length > 0 && searchResults.length !== dataList.length;

  return (
    <div className={cn("space-y-20", cn(className))}>
      {/* Form */}
      <div>
        <div className="mx-auto mt-12 sa:my-auto h-full select-none flex justify-center items-start sa:items-center w-full max-w-screen-1xl bg-secondary px-5 py-3 rounded-2xl">
          <div className="relative w-full flex-grow h-fit flex flex-col gap-3 sm:gap-6 px-2 py-0 sa:px-0 sa:py-2 space-y-6">
            <div className="space-y-2">
              <Label className="text-lg flex gap-2 w-fit">
                <span>{t("input_label")}</span>
                <button
                  className={clearButtonClasses}
                  role="button"
                  onClick={() => {
                    if (searchInputRef.current && searchInputRef.current.value !== "") {
                      searchInputRef.current.value = "";
                      searchInputRef.current.focus();
                      setSearchValue("");
                    }
                  }}
                >
                  <IconEmbedSvg height={16} type="broom" width={16} />
                </button>
              </Label>

              <Input
                ref={searchInputRef}
                className="ring-offset-secondary focus-visible:ring-offset-secondary focus:ring-offset-secondary"
                placeholder={t("input_placeholder")}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <div className="space-y-[0.625em]">
              <Label className="text-lg flex gap-2 w-fit">
                <span>{t("tags_label")}</span>
                <button
                  className={clearButtonClasses}
                  role="button"
                  onClick={() => {
                    if (selectedTagQuery) {
                      setTag(null);
                    }
                  }}
                >
                  <IconEmbedSvg height={16} type="broom" width={16} />
                </button>
              </Label>

              <TagFilter
                iconsMap={iconsMap}
                selectedTag={selectedTagQuery}
                tags={tags}
                onTagClick={setTag}
              />
            </div>
          </div>
        </div>
        <div className="mt-2 pl-4 pr-3 flex gap-2 justify-between w-full">
          <CheckList_AtLeastOne
            checklistItems={categories}
            className_List="flex-col sm:flex-row"
            setChecklistItems={setCategories}
          />

          <TooltipWrapper
            className=""
            tooltipText={
              selectedSearchMode === "exact" ? t("search_mode_exact") : t("search_mode_hungry")
            }
          >
            <Switch
              checked={selectedSearchMode !== "exact"}
              className="scale-90 origin-right"
              onCheckedChange={setSearchMode}
            />
          </TooltipWrapper>
        </div>
      </div>

      {/* Results */}
      {isPending ? (
        <SectionHeader className="h-12" title={t("loading")} />
      ) : (
        <div className="pb-20 space-y-20">
          {showResults &&
            [...postTuple, ...projectTuple, "employment", "education", "resume", "lab"].map(
              (entryType) => {
                return (
                  <TimeLine
                    key={entryType}
                    displayTags={true}
                    entries={searchResults}
                    iconsMap={iconsMap}
                    type={entryType as UnitedEntryType["entryType"]}
                  />
                );
              }
            )}
        </div>
      )}
    </div>
  );
};

export default SearchPublic;
