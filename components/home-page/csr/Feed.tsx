import React from "react";

import Link from "next/link";

import { cn } from "@/lib/cn-utils";
import { PageObject } from "@/interfaces/Page";

import styles from "../_home-page.module.scss";
import { AddPageReturnType } from "../_home-page.functions";
import Pages_Dialog_Add from "./Pages_Dialog_Add";
import { Pages_FormSchema } from "./Pages_Form";

interface Props {
	pages: PageObject[];
	className?: string;
	addPage: (data: Pages_FormSchema) => Promise<AddPageReturnType>;
}

const PagesFeed: React.FC<Props> = ({ pages, className, addPage }) => {
	return (
		<div className={cn(styles.homePage, className)}>
			<Pages_Dialog_Add addPage={addPage} />
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

export default PagesFeed;
