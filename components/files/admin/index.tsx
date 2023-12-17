"use client";

import React, { useState } from "react";

import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";

// import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
import { FileDocument } from "@/interfaces/File";

import styles from "../_files.module.scss";

import FileCreate from "./FileCreate";
// import Pages_Dialog_Delete from "./Pages_Dialog_Delete";
import FileDelete from "./FileDelete";
import FileDisplay from "./FileDisplay";
import FileEdit from "./FileEdit";

interface Props {
	className?: string;
}

const FilesFeedAndEditOptions: React.FC<Props> = ({ className }) => {
	const { files } = useAppContext();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [actionFileId, setActionFileId] = useState("");
	const [actionFile, setActionFile] = useState<FileDocument>();

	return (
		<div className={cn(styles.files, className)}>
			<FileCreate />

			<div className={cn(styles.feed, "mt-16")}>
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

export default FilesFeedAndEditOptions;
