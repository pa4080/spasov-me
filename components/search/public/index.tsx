"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import SectionHeader from "@/components/fragments/SectionHeader";
import { IconsMap } from "@/interfaces/IconsMap";
import { TagData } from "@/interfaces/Tag";
import { postTuple, projectTuple } from "@/interfaces/_common-data-types";

import CheckList_AtLeastOne, { ChecklistItems } from "../../fragments/CheckList_AtLeastOne";
import TagFilter from "./TagsFilter";
import TimeLine from "./TimeLine";
import { UnitedEntryType } from "./type";
import { filterItems_byTag } from "./utils/filterItems_byTag";
import { filterItems_byText } from "./utils/filterItems_byText";

interface SelectedTag {
	tag: TagData;
	attachedToIds: string[];
}

interface QueryFilter {
	searchValue_manual?: string | null;
	selectedTag_manual?: string | null;
}

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

	const [loading, setLoading] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
	const [searchResults, setSearchResults] = useState<UnitedEntryType[] | null>(dataList);

	const searchValue = searchParams.get("value");
	const selectedTagSearch = searchParams.get("tag");

	const setTag = (tag: TagData | null) => {
		!loading && setLoading(true);

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

	useEffect(() => {
		if (searchValue && searchInputRef?.current) {
			searchInputRef.current.value = searchValue;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (selectedTagSearch) {
			const tag = tags.find(({ _id }) => _id === selectedTagSearch);

			tag && setTag(tag);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTagSearch]);

	useEffect(() => {
		clearTimeout(searchTimeout);

		const result_text_filter = filterItems_byText({ searchValue, items: dataList });
		const results = filterItems_byTag({
			items: result_text_filter,
			tags: tags,
			selectedTagQuery: selectedTagSearch,
		});

		setLoading(false);
		setSearchResults(results);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue, tags, dataList]);

	const clearButtonClasses =
		"h-6 w-7 flex items-center justify-center rounded-md grayscale hover:grayscale-0 hover:brightness-110 active:brightness-75 transition-colors duration-300 hover:bg-primary-foreground/20"; // bg-accent-secondary/20

	const [categories, setCategories] = useState<ChecklistItems>(() => ({
		projects: { selected: true, label: t("cat_filter_projects"), modelType: "Project" },
		labs: { selected: true, label: t("cat_filter_labs"), modelType: "LabEntry" },
		about: { selected: true, label: t("cat_filter_about"), modelType: "AboutEntry" },
		blog: { selected: true, label: t("cat_filter_blog"), modelType: "Post" },
	}));

	const showResults =
		searchResults && searchResults.length > 0 && searchResults.length !== dataList.length;

	return (
		<div className={cn("space-y-20", cn(className))}>
			{/* Form */}
			<div className="relative mx-auto my-12 sa:my-auto h-full select-none flex justify-center items-start sa:items-center w-full max-w-screen-1xl bg-secondary px-5 py-3 rounded-2xl">
				<div className="relative w-full flex-grow h-fit flex flex-col gap-3 sm:gap-6 px-2 py-0 sa:px-0 sa:py-2 space-y-6">
					<div className="space-y-2">
						<Label className="text-lg flex gap-2 w-fit">
							<span>{t("input_label")}</span>
							<button
								className={clearButtonClasses}
								role="button"
								onClick={() => {
									if (searchInputRef.current) {
										searchInputRef.current.value = "";
										searchInputRef.current.focus();
									}

									setSearchValue("");
									!loading && setLoading(true);
								}}
							>
								<IconEmbedSvg height={16} type="broom" width={16} />
							</button>
						</Label>

						<Input
							ref={searchInputRef}
							className="ring-offset-secondary focus-visible:ring-offset-secondary focus:ring-offset-secondary"
							placeholder={t("input_placeholder")}
							onChange={(e) => {
								!loading && setLoading(true);

								setSearchTimeout(
									setTimeout(() => {
										setSearchValue(e.target.value);
									}, 1000)
								);
							}}
						/>
					</div>

					<div className="space-y-[0.625em]">
						<Label className="text-lg flex gap-2 w-fit">
							<span>{t("tags_label")}</span>
							<button
								className={clearButtonClasses}
								role="button"
								onClick={() => {
									// !loading && setLoading(true);
									setTag(null);
								}}
							>
								<IconEmbedSvg height={16} type="broom" width={16} />
							</button>
						</Label>

						<TagFilter
							iconsMap={iconsMap}
							selectedTag={selectedTagSearch}
							tags={tags}
							onTagClick={setTag}
						/>
					</div>
				</div>
				<CheckList_AtLeastOne
					checklistItems={categories}
					className="absolute left-4 -bottom-8"
					setChecklistItems={setCategories}
				/>
			</div>

			{/* Results */}
			{loading ? (
				<SectionHeader className="h-12" title={t("loading")} />
			) : (
				showResults &&
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
				)
			)}
		</div>
	);
};

export default SearchPublic;
