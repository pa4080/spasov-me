import React from "react";

import { msgs } from "@/messages";

import SectionHeader from "@/components/fragments/section-header";
import { FileData } from "@/interfaces/File";
import { hyphenateString } from "@/lib/process-text";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";

import ToggleCollapsible from "@/components/fragments/toggle-collapsible";

import styles from "../_files.module.scss";
import FileCreate from "./file-actions/FileCreate";
import FileCard from "./file-card";

interface Props {
	className?: string;
	files: FileData[] | null;
	type?: "common";
	visibleItems?: number;
}

const Section: React.FC<Props> = ({ className, files, type = "common", visibleItems = 2 }) => {
	const t = msgs("FilesAdmin");

	type tType = Parameters<typeof t>[0];

	const section_title = type === "common" ? hyphenateString(t(`title_${type}` as tType)) : type;
	const toggle_target_id = `section_${type}`;

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths />
				<FileCreate fileType={type} />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>

			<div className={styles.feed}>
				{files?.map((file, index) => (
					<FileCard
						key={index}
						className={visibleItems > index ? "" : "section-card-collapsible"}
						file={file}
					/>
				))}
			</div>
		</div>
	);
};

export default Section;
