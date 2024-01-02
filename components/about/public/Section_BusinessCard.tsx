import React from "react";

import Image from "next/image";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { Route } from "@/routes";

import styles from "../_about.module.scss";

interface Props {
	entry: AboutEntryData | null;
	className?: string;
}

const BusinessCard: React.FC<Props> = ({ entry, className }) => {
	return (
		entry && (
			<div className={`${styles.businessCard} ${className}`}>
				<div
					dangerouslySetInnerHTML={{ __html: entry.html.title }}
					className={styles.businessCardTitle}
				/>

				<div className={styles.businessCardImageWrapper}>
					<Image
						priority
						alt={entry.title}
						className={styles.businessCardImage}
						fetchPriority="high"
						height={200}
						src={`${Route.api.FILES}/${entry.html.attachmentUri}`}
						width={200}
					/>
				</div>

				<div
					dangerouslySetInnerHTML={{ __html: entry.html.description }}
					className={styles.businessCardDescription}
				/>
			</div>
		)
	);
};

export default BusinessCard;
