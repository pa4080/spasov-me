import React from "react";

import { getTags } from "@/components/tags/_tags.actions";

import TechTags from "@/components/fragments/TechTags";

import { cn } from "@/lib/cn-utils";

import { getEntries } from "../_about.actions";
import SpokenLanguages from "./Languages";
import Resume from "./Resume";

import { getFileList, getIconsMap } from "@/components/files-cloudflare/_files.actions";
import BusinessCard from "./BusinessCard";
import TimeLine from "./TimeLine";

const files_prefix = process.env?.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES || "files";

interface Props {
	className?: string;
}

const AboutPublic: React.FC<Props> = async ({ className }) => {
	const data = await Promise.all([
		getEntries({
			hyphen: true,
			typeList: ["employment", "education", "resume"],
			public: true,
		}),

		getEntries({
			hyphen: false,
			typeList: ["businessCard", "spokenLanguages"],
			public: true,
		}),
		getFileList({ prefix: files_prefix }),
		getIconsMap(),
		getTags({ hyphen: true, public: true }),
	]).then(([entriesHyphenated, entriesClear, fileList, iconsMap, tags]) => ({
		entriesHyphenated,
		entriesClear,
		fileList,
		iconsMap,
		tags,
	}));

	const { entriesHyphenated, entriesClear, fileList, iconsMap, tags } = data;

	return (
		<div className={cn("space-y-20 scroll-m-8", className)}>
			<BusinessCard
				iconsMap={iconsMap}
				fileList={fileList}
				tags={tags}
				className="about-cards-section list-section scroll-m-8"
				entries={entriesClear}
				type="businessCard"
			/>
			<Resume
				fileList={fileList}
				tags={tags}
				iconsMap={iconsMap}
				className="about-cards-section list-section scroll-m-8"
				entries={entriesHyphenated}
				type="resume"
			/>
			<TimeLine
				fileList={fileList}
				tags={tags}
				iconsMap={iconsMap}
				className="about-cards-section list-section scroll-m-8"
				displayTags={true}
				entries={entriesHyphenated}
				type="employment"
			/>
			<TimeLine
				fileList={fileList}
				tags={tags}
				iconsMap={iconsMap}
				className="about-cards-section list-section scroll-m-8"
				displayTags={false}
				entries={entriesHyphenated}
				type="education"
				visibleItems={2}
			/>
			<SpokenLanguages
				className="about-cards-section list-section scroll-m-8"
				entries={entriesClear}
				type="spokenLanguages"
			/>
			<TechTags
				className="about-cards-section list-section scroll-m-8"
				tags={tags}
				iconsMap={iconsMap}
			/>
		</div>
	);
};

export default AboutPublic;
