import React from "react";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";
import SectionHeader from "@/components/fragments/section-header";
import { PageData } from "@/interfaces/Page";
import { hyphenateString } from "@/lib/process-text";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { FileListItem } from "@/interfaces/File";

import styles from "../_pages.module.scss";
import CreatePage from "./page-actions/CreatePage";
import PageCard from "./page-card";

interface Props {
	className?: string;
	pages: PageData[] | null;
	files?: FileListItem[] | null;
	type?: "common";
}

const Section: React.FC<Props> = ({ className, pages, files, type = "common" }) => {
	const t = msgs("PagesAdmin");

	type tType = Parameters<typeof t>[0];

	const section_title = type === "common" ? hyphenateString(t(`title_${type}` as tType)) : type;
	const toggle_target_id = `section_${type}`;

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths paths={[Route.public.HOME.uri]} />
				<CreatePage files={files} />
				{/* <ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/> */}
			</SectionHeader>

			<div className={styles.feed}>
				{pages?.map((page, index) => <PageCard key={index} page={page} />)}
			</div>
		</div>
	);
};

export default Section;
