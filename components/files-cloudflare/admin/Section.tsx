import React from "react";

import { msgs } from "@/messages";

import SectionHeader from "@/components/fragments/SectionHeader";
import { FileData } from "@/interfaces/File";
import { hyphenateString } from "@/lib/process-text";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";

import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";

import { ModelType } from "@/interfaces/_common-data-types";

import styles from "../_files.module.scss";
import CreateFile from "./Actions/CreateFile";
import FileCard from "./Card";

interface Props {
	className?: string;
	files: FileData[] | null | undefined;
	type?: ModelType | "common";
	visibleItems?: number;
	sortByAttachedTo?: boolean;
	sortByAttachedToVisibleItems?: number;
}

const Section: React.FC<Props> = ({
	className,
	files,
	type = "common",
	visibleItems = 2,
	sortByAttachedTo = true,
	sortByAttachedToVisibleItems = 25,
}) => {
	const t = msgs("Files");

	type tType = Parameters<typeof t>[0];

	const typeToSnakeCase = type
		.replace(/([A-Z])/g, "_$1")
		.toLocaleLowerCase()
		.replace(/^_/g, "");

	const section_title = hyphenateString(t(`section_title_${typeToSnakeCase}` as tType));
	const toggle_target_id = `section_${typeToSnakeCase}`;

	const attachedToDocuments = sortByAttachedTo
		? files?.reduce(
				(acc, file) => {
					if (file.metadata.attachedTo?.length && file.metadata.attachedTo?.length > 0) {
						file.metadata.attachedTo.forEach(({ title, modelType }) => {
							if (modelType === type) {
								if (!acc[title]) {
									acc[title] = [];
								}

								acc[title].push(file);
							}
						});
					}

					return acc;
				},
				{} as Record<string, FileData[]>
			)
		: undefined;

	return (
		<div className={`${styles.section} list-section ${className}`} id={toggle_target_id}>
			<SectionHeader title={section_title}>
				<RevalidatePaths />
				<CreateFile />
				<ToggleCollapsible
					tooltip
					target_id={toggle_target_id}
					text={[t("btnAll"), t("btnLess")]}
					type="section"
				/>
			</SectionHeader>

			{attachedToDocuments && Object.keys(attachedToDocuments).length > 0 ? (
				Object.keys(attachedToDocuments)
					.sort()
					.map((attachedToDocument, index) => (
						<div
							key={attachedToDocument}
							className={`${styles.feed} scroll-m-8 mt-12 list-sub-section ${sortByAttachedToVisibleItems > index ? "" : "sub-section-collapsible"}`}
							id={`${toggle_target_id}_${index}`}
						>
							<div className="flex flex-row w-full justify-between gap-4 items-center border-4 h-10 border-primary bg-primary rounded-full">
								<div className="text-xl font-semibold tracking-wide flex-grow pl-5 flex items-center rounded-full">
									<h2 className="line-clamp-1">{attachedToDocument}</h2>
								</div>
								<ToggleCollapsible
									tooltip
									className="-mr-1"
									target_id={`${toggle_target_id}_${index}`}
									text={[t("btnAll"), t("btnLess")]}
									type="section"
								/>
							</div>

							{attachedToDocuments[attachedToDocument]
								?.sort((file_b, file_a) =>
									type === "common"
										? file_a.uploadDate.getTime() - file_b.uploadDate.getTime()
										: file_a._id.match(/logo/)
											? 1
											: file_a._id.localeCompare(file_b._id)
								)
								?.map((file, index) => (
									<FileCard
										key={file._id}
										className={visibleItems > index ? "" : "section-card-collapsible"}
										file={file}
										section_id={`${toggle_target_id}_${type}_${attachedToDocument.replace(/ /g, "_")}`}
									/>
								))}
						</div>
					))
			) : (
				<div className={styles.feed}>
					{files
						?.sort((b, a) =>
							a?.uploadDate &&
							typeof a?.uploadDate?.getTime === "function" &&
							b?.uploadDate &&
							typeof b?.uploadDate?.getTime === "function"
								? a?.uploadDate?.getTime() - b?.uploadDate?.getTime()
								: 1
						)
						?.map((file, index) => (
							<FileCard
								key={index}
								className={visibleItems > index ? "" : "section-card-collapsible"}
								file={file}
								section_id={`${toggle_target_id}_${type}`}
							/>
						))}
				</div>
			)}
		</div>
	);
};

export default Section;
