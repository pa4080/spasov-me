import React from "react";

import { getFiles } from "@/components/_common.actions";

import styles from "../_files.module.scss";
import FileCreateOld from "./FileCreate";
import FileCard from "./file-card";

interface Props {
	className?: string;
}

const FilesAdmin: React.FC<Props> = async ({ className }) => {
	const files = await getFiles();

	return (
		<div className={`${styles.files} ${className}`}>
			<FileCreateOld />

			<div className={`${styles.feed} mt-16`}>
				{files?.map((file, index) => <FileCard key={index} file={file} />)}
			</div>
		</div>
	);
};

export default FilesAdmin;
