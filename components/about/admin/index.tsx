import React from "react";

import { remark } from "remark";
import html from "remark-html";

import { AboutEntryItem } from "@/interfaces/_dataTypes";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import EntryCreate from "./EntryCreate";
import EntryDisplay from "./EntryDisplay";

export interface GenericActionProps {
	className?: string;
	entryType: AboutEntryItem;
}

interface Props {
	className?: string;
}

const PagesFeedAndEditOptions: React.FC<Props> = async ({ className }) => {
	const t = msgs("AboutCV");

	const entryList = await getEntries();
	const entries = entryList?.map((entry) => ({
		_id: entry._id.toString(),
		html: {
			title: remark().use(html).processSync(entry.title).toString(),
			description: remark().use(html).processSync(entry.description).toString(),
		},

		title: entry.title,
		description: entry.description,
		country: entry.country,
		city: entry.city,
		dateFrom: entry.dateFrom as Date,
		dateTo: entry.dateTo as Date,
		entryType: entry.entryType,
		visibility: entry.visibility as boolean,
	}));

	return (
		<div className={cn(styles.about, className)}>
			<div className="flex items-center justify-between gap-4 mb-4 w-full">
				<h1 className={cn(styles.title, "flex-grow")}>{t("title_employment")}</h1>
				<EntryCreate entryType="employment" />
			</div>

			<div className={cn(styles.feed)}>
				{entries
					?.filter(({ entryType }) => entryType === "employment")
					.map((entry, index) => <EntryDisplay key={index} entry={entry} />)}
			</div>
		</div>
	);
};

export default PagesFeedAndEditOptions;
