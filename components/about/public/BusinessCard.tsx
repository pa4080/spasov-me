import React from "react";

import Image from "next/image";

import { AboutEntryData } from "@/interfaces/AboutEntry";

import { Route } from "@/routes";

import styles from "../_about.module.scss";

interface Props {
	data: AboutEntryData | null;
	className?: string;
}

const BusinessCard: React.FC<Props> = ({ data, className }) => {
	return (
		data && (
			<div className={`${styles.businessCard} ${className}`}>
				<div
					dangerouslySetInnerHTML={{ __html: data.html.title }}
					className={styles.businessCardTitle}
				/>

				<div className={styles.businessCardImageWrapper}>
					<Image
						alt={data.title}
						className={styles.businessCardImage}
						height={200}
						src={`${Route.api.FILES}/${data.html.attachmentUri}`}
						width={200}
					/>
				</div>

				<div
					dangerouslySetInnerHTML={{ __html: data.html.description }}
					className={styles.businessCardDescription}
				/>
			</div>
		)
	);
};

export default BusinessCard;
