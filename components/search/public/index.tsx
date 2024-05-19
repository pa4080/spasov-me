"use client";
import React, { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { TagData } from "@/interfaces/Tag";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { ProjectData } from "@/interfaces/Project";

import SectionHeader from "@/components/fragments/SectionHeader";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";

import TagFilter from "./TagFilter";
import TimeLine from "./TimeLine";

export type UnitedEntryType = ProjectData | AboutEntryData;

interface SelectedTag {
	tag: TagData;
	attachedToIds: string[];
}

interface Props {
	className?: string;
}

const SearchPublic: React.FC<Props> = ({ className }) => {
	const t = msgs("Search");
	const { tags, aboutEntries, projects } = useAppContext();

	const [selectedTag, setSelectedTag] = useState<SelectedTag | null>(null);

	const [loading, setLoading] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [searchValue, setSearchValue] = useState("");
	const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
	const [searchResults, setSearchResults] = useState<UnitedEntryType[] | null>(null);

	useEffect(() => {
		setSearchResults([...aboutEntries, ...projects]);
	}, [aboutEntries, projects]);

	const onTagClick = (tag: TagData) => {
		setLoading(true);

		setSelectedTag({
			tag,
			attachedToIds: tag?.attachedTo?.map(({ _id }) => _id) || [],
		});
	};

	const filterItems = () => {
		const dataList = [...aboutEntries, ...projects];

		if (!searchValue) {
			return dataList;
		}

		const regEx = new RegExp(`\\b${searchValue.toLowerCase().replace(/\s+/g, ".*")}`, "i");

		return dataList.filter(
			(dataItem) =>
				dataItem.title.toLowerCase().match(regEx) || dataItem.description.toLowerCase().match(regEx)
		);
	};

	useEffect(() => {
		clearTimeout(searchTimeout);

		setSearchTimeout(
			setTimeout(() => {
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
			}, 500)
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue, selectedTag, tags, aboutEntries, projects]);

	return (
		<div className={cn("space-y-20", cn(className))}>
			{/* Form */}
			<div className="relative mx-auto my-12 sa:my-auto h-full select-none flex justify-center items-start sa:items-center w-full max-w-screen-1xl bg-secondary px-5 py-3 rounded-2xl">
				<div className="relative w-full flex-grow h-fit flex flex-col gap-3 sm:gap-6 px-2 py-0 sa:px-0 sa:py-2 space-y-6">
					<div className="space-y-2">
						<Label className="text-lg flex gap-2 w-fit">
							<span>{t("input_label")}</span>
							<button
								className={
									"h-6 w-7 flex items-center justify-center rounded-md grayscale hover:grayscale-0 hover:bg-accent-secondary/20 bg-accent-secondary/20 hover:brightness-110 active:brightness-75 transition-colors duration-300"
								}
								role="button"
								onClick={() => {
									if (searchInputRef.current) {
										searchInputRef.current.value = "";
										searchInputRef.current.focus();
									}

									setLoading(true);
									setSearchValue("");
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
									}, 2500)
								);
							}}
						/>
					</div>
					<div className="space-y-[0.625em]">
						<Label className="text-lg flex gap-2 w-fit">
							<span>{t("tags_label")}</span>
							<button
								className={
									"h-6 w-7 flex items-center justify-center rounded-md grayscale hover:grayscale-0 hover:bg-accent-secondary/20 bg-accent-secondary/20 hover:brightness-110 active:brightness-75 transition-colors duration-300"
								}
								role="button"
								onClick={() => {
									setLoading(true);
									setSelectedTag(null);
								}}
							>
								<IconEmbedSvg height={16} type="broom" width={16} />
							</button>
						</Label>
						<TagFilter selectedTag={selectedTag?.tag || null} tags={tags} onTagClick={onTagClick} />
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
					["informationTechnologies", "employment", "education", "resume"].map((entryType) => (
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
