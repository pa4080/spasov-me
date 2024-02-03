import React from "react";

import Image from "next/image";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { AboutEntryType } from "@/interfaces/_common-data-types";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";

import { Route } from "@/routes";

import styles from "./_business-card.module.scss";

interface Props {
	entries: AboutEntryData[] | null;
	className?: string;
	type: AboutEntryType;
}

const BusinessCard: React.FC<Props> = ({ entries, className, type }) => {
	// const t = msgs("AboutCV");
	// type tType = Parameters<typeof t>[0];
	// const section_title = t(`title_${type}` as tType);

	const toggle_target_id = `section_${type}`;

	const entry =
		entries
			?.filter(({ entryType }) => entryType === type)
			?.find(({ dateTo, visibility }) => dateTo === undefined && visibility) ?? null;

	const descriptionArr = entry?.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		entry && (
			<div className={`${styles.businessCard} ${className}`} id={toggle_target_id}>
				<div
					dangerouslySetInnerHTML={{ __html: entry.html.title }}
					className={styles.businessCardTitle}
				/>

				<div
					className={`${styles.imageWrapper} bg-secondary drop-shadow-[1px_2px_4px_rgba(17,17,17,0.4)] dark:bg-foreground-secondary dark:drop-shadow-[1px_2px_4px_rgba(17,17,17,1)]`}
				>
					<Image
						priority
						alt={entry.title}
						className={styles.image}
						fetchPriority="high"
						height={200}
						src={entry.html.attachmentUri || Route.assets.IMAGE_PLACEHOLDER}
						width={200}
					/>
				</div>

				<div
					dangerouslySetInnerHTML={{ __html: descriptionArr?.[0] || "" }}
					className={styles.businessCardDescription}
				/>
			</div>
		)
	);
};

export default BusinessCard;
