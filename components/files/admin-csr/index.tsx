"use client";

import React, { useEffect, useState } from "react";

import { useAppContext } from "@/contexts/AppContext";
import { FileData } from "@/interfaces/File";
import loadDataFromApiRoute from "@/lib/load-data-fom-api-route";

import styles from "./_files-old.module.scss";
import FileCreate from "./FileCreate";
import FileDelete from "./FileDelete";
import FileDisplay from "./FileDisplay";
import FileEdit from "./FileEdit";

interface Props {
	className?: string;
}

// const FilesAdmin: React.FC<Props> = async ({ className }) => {
const FilesAdmin: React.FC<Props> = ({ className }) => {
	const { files, setFiles } = useAppContext();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [actionFileId, setActionFileId] = useState("");
	const [actionFile, setActionFile] = useState<FileData>();

	useEffect(() => {
		const controller = new AbortController();

		if (!files || files.length === 0) {
			loadDataFromApiRoute("FILES", setFiles, controller);
		}

		return () => {
			controller.abort();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={`${styles.files} ${className}`}>
			<FileCreate />

			<div className={`${styles.feed} mt-16`}>
				{files?.map((file, index) => (
					<FileDisplay
						key={index}
						file={file}
						setActionFile={setActionFile}
						setActionFileId={setActionFileId}
						setIsDeleteDialogOpen={setIsDeleteDialogOpen}
						setIsEditDialogOpen={setIsEditDialogOpen}
					/>
				))}
			</div>

			<FileDelete
				fileData={actionFile}
				fileId={actionFileId}
				isOpen={isDeleteDialogOpen}
				setIsOpen={setIsDeleteDialogOpen}
			/>

			<FileEdit
				fileData={actionFile}
				fileId={actionFileId}
				isOpen={isEditDialogOpen}
				setIsOpen={setIsEditDialogOpen}
			/>
		</div>
	);
};

export default FilesAdmin;
