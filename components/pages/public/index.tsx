import React from "react";

import Link from "next/link";

import { getPageCards } from "../_pages.actions";
import styles from "../_pages.module.scss";

interface Props {
	className?: string;
}

const FeedPages: React.FC<Props> = async ({ className }) => {
	const pages = await getPageCards({ public: true });

	return (
		<div className={`${styles.pages} ${className}`}>
			<div className={styles.feed}>
				{pages?.map((page, index) => (
					<Link key={index} href={`/${page.uri}`}>
						<div key={index} className={styles.card}>
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
