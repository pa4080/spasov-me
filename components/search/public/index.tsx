"use client";
import { hyphenateSync as hyphenate } from "hyphen/en";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import SectionHeader from "@/components/fragments/SectionHeader";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";

import { PostData } from "@/interfaces/Post";
import { postTuple, projectTuple } from "@/interfaces/_common-data-types";
import TagFilter from "./TagFilter";
import TimeLine from "./TimeLine";

export type UnitedEntryType = ProjectData | AboutEntryData | PostData;

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
}

const SearchPublic: React.FC<Props> = ({ className, tags, dataList }) => {
	const t = msgs("Search");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [selectedTag, setSelectedTag] = useState<SelectedTag | null>(null);

	const [loading, setLoading] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
	const [searchResults, setSearchResults] = useState<UnitedEntryType[] | null>(dataList);

	const setSearchParams = useCallback(
		({ searchValue_manual, selectedTag_manual }: QueryFilter = {}) => {
			const params = new URLSearchParams(searchParams);

			if (searchValue_manual) {
				params.set("value", searchValue_manual);
			} else if (searchValue) {
				params.set("value", searchValue);
			} else if (searchValue_manual === "") {
				params.delete("value");
			} else {
				params.delete("value");
			}

			if (selectedTag_manual) {
				params.set("tag", selectedTag_manual);
			} else if (selectedTag) {
				params.set("tag", selectedTag.tag._id);
			} else {
				params.delete("tag");
			}

			const newQuery = params.toString();

			router.replace(pathname + "?" + newQuery, {
				scroll: false,
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const setTag = (tag: TagData | null) => {
		!loading && setLoading(true);

		setSearchParams({ selectedTag_manual: tag?._id || null, searchValue_manual: searchValue });

		setSelectedTag(
			tag
				? {
						tag,
						attachedToIds: tag?.attachedTo?.map(({ _id }) => _id) || [],
					}
				: null
		);
	};

	const searchValue = searchParams.get("value");
	const setSearchValue = (value: string) => {
		setSearchParams({ searchValue_manual: value, selectedTag_manual: selectedTag?.tag?._id });
	};

	useEffect(() => {
		if (searchValue && searchInputRef?.current) {
			searchInputRef.current.value = searchValue;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const selectedTagSearch = searchParams.get("tag");

	useEffect(() => {
		if (selectedTagSearch) {
			const tag = tags.find(({ _id }) => _id === selectedTagSearch);

			tag && setTag(tag);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTagSearch]);

	const filterItems = () => {
		if (!searchValue) {
			return dataList;
		}
		const searchValueSanitized = searchValue.trim();
		const searchValuePrepared = searchValueSanitized.replace(/\s+/g, ".*?");
		const searchValueHyphenated = hyphenate(searchValueSanitized).replace(/\s+/g, ".*?");

		const regExpSearch = new RegExp(`(\\b(${searchValuePrepared})\\b)`, "i");
		const regExpHighligh = new RegExp(`(\\b(${searchValueHyphenated})\\b)`, "i");

		return dataList
			.filter(
				(dataItem) => dataItem.title.match(regExpSearch) || dataItem.description.match(regExpSearch)
			)
			.map((dataItem) => ({
				...dataItem,
				html: {
					title: dataItem.html.title.replace(
						regExpHighligh,
						"<span class='search-result-match'>$1</span>"
					),
					description: dataItem.html.description.replace(
						regExpHighligh,
						"<span class='search-result-match'>$1</span>"
					),
				},
			}));
	};

	useEffect(() => {
		clearTimeout(searchTimeout);

		const results_value_filter = filterItems();
		const results_tag_filter = results_value_filter?.filter(
			({ _id }) => selectedTag && selectedTag.attachedToIds.includes(_id)
		);

		const results =
			results_tag_filter && results_tag_filter.length > 0
				? results_tag_filter
				: selectedTag && results_tag_filter.length === 0
					? results_tag_filter
					: results_value_filter;

		setLoading(false);
		setSearchResults(results);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue, selectedTag, tags, dataList]);

	const clearButtonClasses =
		"h-6 w-7 flex items-center justify-center rounded-md grayscale hover:grayscale-0 hover:brightness-110 active:brightness-75 transition-colors duration-300 hover:bg-primary-foreground/20"; // bg-accent-secondary/20

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

						<TagFilter selectedTag={selectedTag?.tag || null} tags={tags} onTagClick={setTag} />
					</div>
				</div>
			</div>

			{/* Results */}
			{searchResults && searchResults.length === 0 ? (
				<SectionHeader className="h-12" title={t("noResults")} />
			) : (!searchValue || !selectedTag) && loading ? (
				<SectionHeader className="h-12" title={t("loading")} />
			) : searchValue || selectedTag ? (
				loading ? (
					<SectionHeader className="h-12" title={t("loading")} />
				) : (
					[...postTuple, ...projectTuple, "employment", "education", "resume"].map((entryType) => (
						<TimeLine
							key={entryType}
							displayTags={true}
							entries={searchResults}
							type={entryType as UnitedEntryType["entryType"]}
						/>
					))
				)
			) : null}
		</div>
	);
};

export default SearchPublic;
