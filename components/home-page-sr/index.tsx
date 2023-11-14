"use server";

import React from "react";

import Link from "next/link";

import { PageObject } from "@/interfaces/Page";
import { cn } from "@/lib/cn-utils";

import Page from "@/models/page";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";

import styles from "./_home-page.module.scss";

interface Props {
	className?: string;
}

export const getPages = async (): Promise<PageObject[]> => {
	"use server";
	await connectToMongoDb();
	const response: PageObject[] = await Page.find().populate(["creator", "image"]);

	return response;
};

const FeedPages: React.FC<Props> = async ({ className }) => {
	const pages = await getPages();

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
