import React from "react";

import { getFiles } from "../_files.actions";
import styles from "../_files.module.scss";
import Section from "./Section";

interface Props {
	className?: string;
}

const FilesAdmin: React.FC<Props> = async ({ className }) => {
	const files = await getFiles();

	return (
		<div className={`${styles.files} ${className}`}>
			<Section files={files} type="common" visibleItems={8} />
		</div>
	);
};

export default FilesAdmin;
