import React from "react";

import { getFiles } from "../_files.actions";
import styles from "../_files.module.scss";
import Section from "./Section";

interface Props {
	className?: string;
}

const FilesAdmin_CloudFlare: React.FC<Props> = async ({ className }) => {
	const files = await getFiles();

	const filesCommon = files?.filter(
		(file) => !file.metadata.attachedTo || file.metadata.attachedTo.length === 0
	);

	const filesAbout = files?.filter(
		(file) =>
			file.metadata.attachedTo &&
			file.metadata.attachedTo.find(({ modelType }) => modelType === "AboutEntry")
	);

	const filesPortfolio = files?.filter(
		(file) =>
			file.metadata.attachedTo &&
			file.metadata.attachedTo.find(({ modelType }) => modelType === "Project")
	);

	return (
		<div className={`${styles.files} ${className}`}>
			<Section files={filesCommon} type="common" />
			<Section files={filesAbout} type="AboutEntry" />
			<Section sortByAttachedTo files={filesPortfolio} type="Project" visibleItems={1} />
		</div>
	);
};

export default FilesAdmin_CloudFlare;
