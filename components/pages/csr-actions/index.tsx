import React from "react";

import { cn } from "@/lib/cn-utils";

import PagesFeed from "./Pages_Feed";
import Pages_Dialog_Add from "./Pages_Dialog_Add";
import styles from "../_pages.module.scss";

export interface PagesActions {
	className?: string;
}

interface Props {
	className?: string;
}

const Pages_Feed: React.FC<Props> = ({ className }) => {
	return (
		<div className={cn(styles.homePage, className)}>
			<Pages_Dialog_Add />
			<PagesFeed className={className} />
		</div>
	);
};

export default Pages_Feed;
