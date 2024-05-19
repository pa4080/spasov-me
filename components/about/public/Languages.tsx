import React from "react";

import SectionHeader from "@/components/fragments/SectionHeader";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { AboutEntryType } from "@/interfaces/_common-data-types";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";

interface Props {
	className?: string;
	type: AboutEntryType;
	entries: AboutEntryData[] | null;
}

/**
 * Convert points to stars
 * @param points number of points per language
 * @param maxStars maximum count of the stars on the scale
 * @param starWeight the weight of one full star
 * @returns (<i-full-star/>|<i-half-star/>|<i-no-star/>)[]
 */
function stars(points: number, maxStars: number = 5, starWeight: number = 10) {
	const stars = [];
	const fullStars = Math.floor(points / starWeight);
	const halfStars = points % starWeight > 0 ? 1 : 0;
	const emptyStars = maxStars - fullStars - halfStars;

	for (let i = 0; i < fullStars; i++) {
		stars.push(<i key={`full-star-${i}`} className="icon i-full-star i-default-bg" />);
	}

	for (let i = fullStars; i < fullStars + halfStars; i++) {
		stars.push(<i key={`half-star-${i}`} className="icon i-half-star i-default-bg" />);
	}

	for (let i = fullStars + halfStars; i < fullStars + halfStars + emptyStars; i++) {
		stars.push(<i key={`no-star-${i}`} className="icon i-no-star i-default-bg" />);
	}

	return stars;
}

/**
 * The format of the description of each language must be: `lang:points:level`,
 * i.e: "Bulgarian:50:native", where the points is a number between 0 and 50.
 * The full starts have weight of 10 points, the half starts - 5 points.
 *
 * The title of the section must exist in the messages.json file
 * In the format of: `title_${type}`, i.e. "title_employment"
 */
const SpokenLanguages: React.FC<Props> = ({ className, type, entries }) => {
	const t = msgs("AboutEntries");

	type tType = Parameters<typeof t>[0];

	const section_title = t(`title_${type}` as tType);
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	return (
		<div className={className} id={toggle_target_id}>
			<SectionHeader className="pop-header" title={section_title} />

			<div className="space-y-4">
				{entries
					?.filter(({ entryType }) => entryType === type)
					.sort((a, b) => a.title.localeCompare(b.title))
					.map((entry, index) => {
						const [title, points, level] = entry.description.split(":");

						return (
							<div
								key={index}
								className="flex flex-wrap gap-2 3xs:gap-4 xa:gap-6 justify-start items-center pop-item"
							>
								<div className="4xs:w-24">{title}</div>
								<div className="text-sm 5xs:text-base">{stars(Number(points))}</div>
								<div className="text-foreground-secondary">{level}</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default SpokenLanguages;
