import React from "react";

import Link from "next/link";

import { cn } from "@/lib/cn-utils";

import styles from "../_pages.module.scss";
import { getPublicPages } from "../_pages.actions";

interface Props {
	className?: string;
}

const FeedPages: React.FC<Props> = async ({ className }) => {
	const pages = await getPublicPages();

	return (
		<div className={cn(styles.homePage, className)}>
			<div className={cn(styles.pagesFeed, className)}>
				{pages?.map((page, index) => (
					<Link key={index} href={`/${page.uri}`}>
						<div key={index} className={styles.pagesCard}>
							<h1 className={styles.title}>{page.title}</h1>
							<span>{page.description}</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default FeedPages;
