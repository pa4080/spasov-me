"use server";

import React from "react";
import Link from "next/link";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth-options";
import { PageObject } from "@/interfaces/Page";
import { cn } from "@/lib/cn-utils";

import Page from "@/models/page";
import { connectToMongoDb } from "@/lib/mongodb-mongoose";

import styles from "./_home-page.module.scss";

interface Props {
	className?: string;
}

const getPages = async (): Promise<PageObject[]> => {
	"use server";
	await connectToMongoDb();
	const response: PageObject[] = await Page.find().populate(["creator", "image"]);

	return response;
};

const Pages_Feed: React.FC<Props> = async ({ className }) => {
	const session = await getServerSession(authOptions);
	const pages = await getPages();

	return (
		<div className={cn(styles.homePage, className)}>
			{session?.user ? (
				<div>Here we must implement CLIENT SIDE component...</div>
			) : (
				<div className={styles.pagesFeed}>
					{pages?.map((page, index) => (
						<Link key={index} href={`/${page.uri}`}>
							<div key={index} className={styles.pagesCard}>
								<h1 className={styles.title}>{page.title}</h1>
								<span>{page.description}</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default Pages_Feed;
