"use client";

import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import IconEmbedSvg from "@/components/shared/IconEmbedSvg";
import SectionHeader from "@/components/shared/SectionHeader";
import TooltipWrapper from "@/components/shared/TooltipWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "@/contexts/AppContext";
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

/**
 * Update the browser URL without triggering Next.js navigation.
 * This avoids server-side re-fetches on every keystroke/tag click.
 */
const updateUrlParams = (params: URLSearchParams) => {
  const search = params.toString();
  const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;

  window.history.replaceState(window.history.state, "", url);
};

interface Props {
  className?: string;
}

const SearchPublic: React.FC<Props> = ({ className }) => {
  "use no memo";

  const t = msgs("Search");

  // Read URL params only on mount to initialize state
  const initialParams = useSearchParams();

  // Get data from AppContext (fetched once on app init)
  const { aboutEntries, tags, projects, posts, labEntries, iconsMap, searchDataReady } =
    useAppContext();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Build the unified data list from context
  const dataList = useMemo<UnitedEntryType[]>(
    () => [
      ...(aboutEntries as UnitedEntryType[]),
      ...(projects as UnitedEntryType[]),
      ...labEntries.map(
        (entry) =>
          ({
            ...entry,
            entryType: "lab",
          }) as UnitedEntryType
      ),
      ...(posts as UnitedEntryType[]),
    ],
    [aboutEntries, projects, labEntries, posts]
  );

  // Filter state — managed locally, synced to URL via history.replaceState
  const [searchValue, setSearchValueState] = useState<string | null>(initialParams.get("value"));
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(() => {
    const tagParam = initialParams.get("tag");

    return tagParam ? tagParam.split(",").filter(Boolean) : [];
  });
  const [searchMode, setSearchModeState] = useState<"hungry" | "exact">(
    initialParams.get("mode") === "exact" ? "exact" : "hungry"
  );

  const defaultCategories = useMemo<CheckListItemModelType[]>(
    () => [
      { key: "prj", selected: true, label: t("cat_filter_projects"), modelType: "Project" },
      { key: "lbs", selected: true, label: t("cat_filter_labs"), modelType: "LabEntry" },
      { key: "cv", selected: true, label: t("cat_filter_about"), modelType: "AboutEntry" },
      { key: "blg", selected: true, label: t("cat_filter_blog"), modelType: "Post" },
    ],
    [t]
  );

  const [categories, setCategories] = useState<CheckListItemModelType[]>(() => {
    const catsParam = initialParams.get("cats");

    if (catsParam) {
      const cats = catsParam.split("_");

      return defaultCategories.map((cat) =>
        cats.includes(cat.key) ? { ...cat, selected: true } : { ...cat, selected: false }
      );
    }

    return defaultCategories;
  });

  // Sync filter state to URL params
  const syncUrlParams = useCallback(
    ({
      value,
      tagIds,
      mode,
      cats,
    }: {
      value?: string | null;
      tagIds?: string[];
      mode?: "hungry" | "exact";
      cats?: CheckListItem[];
    }) => {
      const params = new URLSearchParams();

      const currentValue = value !== undefined ? value : searchValue;
      const currentTagIds = tagIds !== undefined ? tagIds : selectedTagIds;
      const currentMode = mode !== undefined ? mode : searchMode;
      const currentCats = cats !== undefined ? cats : categories;

      if (currentValue) {
        params.set("value", currentValue);
      }

      if (currentTagIds.length > 0) {
        params.set("tag", currentTagIds.join(","));
      }

      if (currentMode === "exact") {
        params.set("mode", "exact");
      }

      const selectedCats = currentCats.filter(({ selected }) => selected);

      if (selectedCats.length !== currentCats.length) {
        params.set("cats", selectedCats.map(({ key }) => key).join("_"));
      }

      updateUrlParams(params);
    },
    [searchValue, selectedTagIds, searchMode, categories]
  );

  // Sync search input value from state
  useEffect(() => {
    if (searchValue && searchInputRef?.current) {
      searchInputRef.current.value = searchValue;
    }
  }, [searchValue]);

  // Setters that update both local state and URL
  const setSearchValue = useCallback(
    (value: string | null) => {
      const val = value || null;

      setSearchValueState(val);
      syncUrlParams({ value: val });
    },
    [syncUrlParams]
  );

  const toggleTag = useCallback(
    (tag: TagData) => {
      setSelectedTagIds((prev) => {
        const newTagIds = prev.includes(tag._id)
          ? prev.filter((id) => id !== tag._id)
          : [...prev, tag._id];

        syncUrlParams({ tagIds: newTagIds });

        return newTagIds;
      });
    },
    [syncUrlParams]
  );

  const clearTags = useCallback(() => {
    setSelectedTagIds([]);
    syncUrlParams({ tagIds: [] });
  }, [syncUrlParams]);

  const setSearchMode = useCallback(
    (hungry: boolean) => {
      const mode = hungry ? "hungry" : "exact";

      setSearchModeState(mode);
      syncUrlParams({ mode });
    },
    [syncUrlParams]
  );

  const handleSetCategories = useCallback(
    (cats: CheckListItem[]) => {
      setCategories(cats as CheckListItemModelType[]);
      syncUrlParams({ cats });
    },
    [syncUrlParams]
  );

  // Compute filtered results
  const searchResults = useMemo(() => {
    if (dataList.length === 0) {
      return null;
    }

    const result_text_filter = filterItems_byText({
      searchValue,
      items: dataList,
      searchMode,
    });
    const result_tag_filter = filterItems_byTag({
      items: result_text_filter,
      tags: tags,
      selectedTagIds,
    });

    const result_cat_filter = filterItems_byCats({
      categories,
      items: result_tag_filter,
    });

    return searchValue || selectedTagIds.length > 0 ? result_cat_filter : result_tag_filter;
  }, [dataList, tags, searchValue, selectedTagIds, searchMode, categories]);

  const clearButtonClasses =
    "h-6 w-7 flex items-center justify-center rounded-md grayscale hover:grayscale-0 hover:brightness-110 active:brightness-75 transition-colors duration-300 hover:bg-primary-foreground/20"; // bg-accent-secondary/20

  const hasActiveFilters = !!searchValue || selectedTagIds.length > 0;

  const titleText = useMemo(() => {
    if (!hasActiveFilters || !searchResults) {
      return t("title");
    }

    const count = searchResults.length;

    if (count === 0) {
      return t("results_count_zero");
    }

    if (count === 1) {
      return t("results_count_one");
    }

    return t("results_count_other", { count });
  }, [hasActiveFilters, searchResults, t]);

  const showResults =
    searchResults && searchResults.length > 0 && searchResults.length !== dataList.length;

  return (
    <>
      <h1 className="section_title">{titleText}</h1>

      <div className={cn("space-y-20", cn(className))}>
        {/* Form */}
        <div>
          <div className="mx-auto mt-12 sa:my-auto h-full select-none flex justify-center items-start sa:items-center w-full max-w-screen-1xl bg-secondary px-5 py-3 rounded-2xl">
            <div className="relative w-full flex-grow h-fit flex flex-col gap-1 sm:gap-2 px-2 py-0 sa:px-0 sa:py-2 space-y-6">
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
                      if (selectedTagIds.length > 0) {
                        clearTags();
                      }
                    }}
                  >
                    <IconEmbedSvg height={16} type="broom" width={16} />
                  </button>
                </Label>

                <TagFilter
                  iconsMap={iconsMap}
                  selectedTags={selectedTagIds}
                  tags={tags}
                  onTagClick={toggleTag}
                />
              </div>
            </div>
          </div>
          <div className="mt-2 pl-4 pr-3 flex gap-2 justify-between w-full">
            <CheckList_AtLeastOne
              checklistItems={categories}
              className_List="flex-col sm:flex-row"
              setChecklistItems={handleSetCategories}
            />

            <TooltipWrapper
              className=""
              tooltipText={
                searchMode === "exact" ? t("search_mode_exact") : t("search_mode_hungry")
              }
            >
              <Switch
                checked={searchMode !== "exact"}
                className="scale-90 origin-right"
                onCheckedChange={setSearchMode}
              />
            </TooltipWrapper>
          </div>
        </div>

        {/* Results */}
        {!searchDataReady ? (
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
    </>
  );
};

export default SearchPublic;
