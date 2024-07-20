import React from "react";

import { ModelType } from "@/interfaces/_common-data-types";

import { getFilesR2 } from "../_files.actions";
import styles from "../_files.module.scss";
import Section from "./Section";

interface Props {
	className?: string;
	files_prefix: string;
	visibleItemsCommon?: number;
}

const FilesAdmin_CloudFlare: React.FC<Props> = async ({
	className,
	files_prefix,
	visibleItemsCommon = 25,
}) => {
	const files = await getFilesR2({ prefix: files_prefix });

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
					files={files}
					files_prefix={files_prefix}
					sortByAttachedTo={sortByAttachedTo}
					type={type as ModelType | "common"}
					visibleItems={visibleItems}
				/>
			))}
		</div>
	);
};

export default FilesAdmin_CloudFlare;
