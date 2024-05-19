"use client";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { TagData } from "@/interfaces/Tag";

import TagFilter from "./TagFilter";
import TimeLine from "./TimeLine";

interface SelectedTag {
	tag: TagData;
	aboutEntryIds: string[];
	projectIds: string[];
}

interface Props {
	className?: string;
}

const SearchPublic: React.FC<Props> = ({ className }) => {
	const { tags, aboutEntries, projects } = useAppContext();
	const [selectedTag, setSelectedTag] = useState<SelectedTag | null>(null);
	const t = msgs("Search");

	const onTagClick = (tag: TagData) => {
		setSelectedTag({
			tag,
			aboutEntryIds:
				tag.attachedTo
					?.filter(({ modelType }) => modelType === "AboutEntry")
					.map(({ _id }) => _id) || [],
			projectIds:
				tag.attachedTo?.filter(({ modelType }) => modelType === "Project").map(({ _id }) => _id) ||
				[],
		});
	};

	const aboutEntries_filtered = aboutEntries.filter(
		({ _id }) => selectedTag && selectedTag.aboutEntryIds.includes(_id)
	);

	const projects_filtered = projects.filter(
		({ _id }) => selectedTag && selectedTag.projectIds.includes(_id)
	);

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
						/>
					</div>
					<div className="space-y-2">
						<Label className="text-lg">{t("tags_label")}</Label>
						<TagFilter selectedTag={selectedTag?.tag || null} tags={tags} onTagClick={onTagClick} />
					</div>
				</div>
			</div>

			{/* Results */}
			<TimeLine displayTags={true} entries={projects_filtered} type="informationTechnologies" />
			<TimeLine displayTags={true} entries={aboutEntries_filtered} type="employment" />
			<TimeLine displayTags={true} entries={aboutEntries_filtered} type="education" />
		</div>
	);
};

export default SearchPublic;
