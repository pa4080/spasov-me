import React from "react";

import { FileData } from "@/interfaces/File";
import { ModelType } from "@/interfaces/_common-data-types";
import styles from "../_files.module.scss";
import Section from "./Section";

interface Props {
	className?: string;
	files: FileData[] | null;
	visibleItemsCommon?: number;
}

const FilesAdmin_CloudFlare: React.FC<Props> = async ({
	className,
	files,
	visibleItemsCommon = 25,
}) => {
	const sections = [
		{
			type: "common",
			visibleItems: visibleItemsCommon,
			sortByAttachedTo: false,
			files: files?.filter(
				(file) => !file.metadata.attachedTo || file.metadata.attachedTo.length === 0
			),
		},
		{
			type: "AboutEntry",
			visibleItems: 2,
			sortByAttachedTo: true,
			files: files?.filter(
				(file) =>
					file.metadata.attachedTo &&
					file.metadata.attachedTo.find(({ modelType }) => modelType === "AboutEntry")
			),
		},
		{
			type: "Project",
			visibleItems: 1,
			sortByAttachedTo: true,
			files: files?.filter(
				(file) =>
					file.metadata.attachedTo &&
					file.metadata.attachedTo.find(({ modelType }) => modelType === "Project")
			),
		},
		{
			type: "Post",
			visibleItems: 2,
			sortByAttachedTo: true,
			files: files?.filter(
				(file) =>
					file.metadata.attachedTo &&
					file.metadata.attachedTo.find(({ modelType }) => modelType === "Post")
			),
		},
	];

	return (
		<div className={`${styles.files} ${className}`}>
			{sections.map(({ type, visibleItems, sortByAttachedTo, files }) => (
				<Section
					key={type}
					sortByAttachedTo={sortByAttachedTo}
					files={files}
					type={type as ModelType | "common"}
					visibleItems={visibleItems}
				/>
			))}
		</div>
	);
};

export default FilesAdmin_CloudFlare;
