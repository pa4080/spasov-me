import React from "react";

import { AboutEntryItem } from "@/interfaces/_dataTypes";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { getEntries } from "../_about.actions";
import styles from "../_about.module.scss";
import AddEntry from "./AddEntry";
import AboutEntryContent from "./entry";

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

	return (
		<div className={cn(styles.about, className)}>
			<div className="flex justify-between mb-4 w-full">
				<h1 className={cn(styles.title, "flex-grow")}>{t("title_employment")}</h1>
				<AddEntry entryType="employment" />
			</div>

			{entryList
				?.filter(({ entryType }) => entryType === "employment")
				.map((entry, index) => <AboutEntryContent key={index} entry={entry} />)}
			{}
		</div>
	);
};

export default PagesFeedAndEditOptions;
