import React from "react";

import { getTags } from "@/components/tags/_tags.actions";

import TechTags from "@/components/fragments/TechTags";

import { cn } from "@/lib/cn-utils";

import { getEntries } from "../_about.actions";
import SpokenLanguages from "./Languages";
import Resume from "./Resume";

import BusinessCard from "./BusinessCard";
import TimeLine from "./TimeLine";

interface Props {
	className?: string;
}

const AboutPublic: React.FC<Props> = async ({ className }) => {
	const entriesHyphenated = await getEntries({
		hyphen: true,
		typeList: ["employment", "education", "resume"],
		public: true,
	});

	const entriesClear = await getEntries({
		hyphen: false,
		typeList: ["businessCard", "spokenLanguages"],
		public: true,
	});

	const tags = await getTags({ hyphen: true, public: true });

	return (
		<div className={cn("space-y-20 scroll-m-8", className)}>
			<BusinessCard
				className="about-cards-section list-section scroll-m-8"
				entries={entriesClear}
				type="businessCard"
			/>
			<Resume
				className="about-cards-section list-section scroll-m-8"
				entries={entriesHyphenated}
				type="resume"
			/>
			<TimeLine
				className="about-cards-section list-section scroll-m-8"
				displayTags={true}
				entries={entriesHyphenated}
				type="employment"
			/>
			<TimeLine
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
			<TechTags className="about-cards-section list-section scroll-m-8" tags={tags} />
		</div>
	);
};

export default AboutPublic;
