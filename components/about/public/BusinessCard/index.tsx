import React from "react";

import Image from "next/image";

import { AboutEntryData } from "@/interfaces/AboutEntry";
import { AboutEntryType } from "@/interfaces/_common-data-types";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { Route } from "@/routes";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import styles from "./_business-card.module.scss";

interface Props {
	entries: AboutEntryData[] | null;
	className?: string;
	type: AboutEntryType;
}

const BusinessCard: React.FC<Props> = ({ entries, className, type }) => {
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`section_${type}`);

	const entry =
		entries
			?.filter(({ entryType }) => entryType === type)
			?.find(({ dateTo, visibility }) => dateTo === undefined && visibility) ?? null;

	const descriptionArr = entry?.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	const cvLink = entry?.gallery
		?.find(({ filename }) => filename.match(/\.pdf$/))
		?.metadata.html.fileUrl?.replace(/\?.*$/, "");

	console.log({ cvLink });

	return (
		entry && (
			<div className={`relative ${styles.businessCard} ${className}`} id={toggle_target_id}>
				<div
					dangerouslySetInnerHTML={{ __html: entry.html.title }}
					className={styles.businessCardTitle}
				/>

				<div
					className={`${styles.imageWrapper} bg-secondary drop-shadow-[1px_2px_4px_rgba(17,17,17,0.4)] dark:bg-foreground-secondary dark:drop-shadow-[1px_2px_4px_rgba(17,17,17,1)]`}
					style={{ backgroundImage: `url(${Route.assets.LOGO_SVG})` }}
				>
					<Image
						priority
						alt={entry.title}
						className={styles.image}
						fetchPriority="high"
						height={200}
						src={
							entry.html.attachment?.metadata.html.fileUrl ||
							entry.html.attachment?.metadata.html.fileUri ||
							Route.assets.LOGO_SVG
						}
						unoptimized={entry.html.attachment?.filename.match(/\.svg$/) ? true : false}
						width={200}
					/>
				</div>

				<div
					dangerouslySetInnerHTML={{ __html: descriptionArr?.[0] || "" }}
					className={styles.businessCardDescription}
				/>

				<a
					href={cvLink}
					target="_blank"
					rel="noreferrer"
					className="absolute right-4 sa:right-2 bottom-16 sa:-bottom-8 pl-[2.8px] bg-transparent grayscale opacity-45 hover:opacity-100 hover:grayscale-0 transition-all duration-200"
				>
					<IconEmbedSvg height={28} type={"download"} width={28} />
				</a>
			</div>
		)
	);
};

export default BusinessCard;
