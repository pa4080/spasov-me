"use client";
import React, { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { TagData } from "@/interfaces/Tag";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { ProjectData } from "@/interfaces/Project";

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

	const [searchValue, setSearchValue] = useState("");
	const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>();
	const [searchResults, setSearchResults] = useState<UnitedEntryType[]>([
		...aboutEntries,
		...projects,
	]);

	useEffect(() => {
		setSearchResults([...aboutEntries, ...projects]);
	}, [aboutEntries, projects]);

	const onTagClick = (tag: TagData) => {
		setSelectedTag({
			tag,
			attachedToIds: tag?.attachedTo?.map(({ _id }) => _id) || [],
		});
	};

	const filterItems = (searchValue: string) => {
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
			setTimeout(
				() => {
					const results_value_filter = filterItems(searchValue);
					const results_tag_filter = results_value_filter?.filter(
						({ _id }) => selectedTag && selectedTag.attachedToIds.includes(_id)
					);

					const results =
						results_tag_filter && results_tag_filter.length > 0
							? results_tag_filter
							: results_value_filter;

					setSearchResults(results);
				},
				searchValue ? 500 : 0
			)
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchValue, selectedTag]);

	return (
		<div className={cn("space-y-20", cn(className))}>
			{/* Form */}
			<div className="relative mx-auto my-12 sa:my-auto h-full select-none flex justify-center items-start sa:items-center w-full max-w-screen-1xl bg-secondary px-5 py-3 rounded-2xl">
				<div className="relative w-full flex-grow h-fit flex flex-col gap-3 sm:gap-6 px-2 py-0 sa:px-0 sa:py-2 space-y-6">
					<div className="space-y-2">
						<Label className="text-lg">{t("input_label")}</Label>
						<Input
							className="ring-offset-secondary focus-visible:ring-offset-secondary focus:ring-offset-secondary"
							placeholder={t("input_placeholder")}
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label className="text-lg">{t("tags_label")}</Label>
						<TagFilter selectedTag={selectedTag?.tag || null} tags={tags} onTagClick={onTagClick} />
					</div>
				</div>
			</div>

			{/* Results */}
			{(searchValue || selectedTag) &&
				searchResults &&
				searchResults
					.reduce(
						(acc: string[], { entryType }) =>
							acc.indexOf(entryType) === -1 ? acc.concat(entryType) : acc,
						[]
					)
					.sort()
					.reverse()
					.map((entryType) => (
						<TimeLine
							key={entryType}
							displayTags={true}
							entries={searchResults}
							type={entryType as UnitedEntryType["entryType"]}
						/>
					))}
		</div>
	);
};

export default SearchPublic;
