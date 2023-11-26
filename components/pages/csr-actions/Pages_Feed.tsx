import React from "react";

import Link from "next/link";

import { cn } from "@/lib/cn-utils";

import styles from "../_pages.module.scss";
import { getPages } from "../_pages.actions";

interface Props {
	className?: string;
}

const PagesFeed: React.FC<Props> = async ({ className }) => {
	const pages = await getPages();

	return (
		<div className={cn(styles.feed, className)}>
			{pages?.map((page, index) => (
				<Link key={index} href={`/${page.uri}`}>
					<div key={index} className={styles.card}>
						<h1 className={styles.title}>{page.title}</h1>
						<span>{page.description}</span>
					</div>
				</Link>
			))}
		</div>
	);
};

export default PagesFeed;
