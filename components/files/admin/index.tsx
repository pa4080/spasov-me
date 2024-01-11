// "use client";

import React from "react";

// import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
// import { FileDocument } from "@/interfaces/File";

import { getFiles } from "@/components/_common.actions";

import styles from "../_files.module.scss";

import FileCreate from "./FileCreate";
// import Pages_Dialog_Delete from "./Pages_Dialog_Delete";
import FileCard from "./FileCard";

interface Props {
	className?: string;
}

const FilesAdmin: React.FC<Props> = async ({ className }) => {
	// const { files } = useAppContext();

	// console.log("files", files);

	const files = await getFiles();

	// console.log("files", fileList);

	// const fileList = await getFileList();

	// const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	// const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	// const [actionFileId, setActionFileId] = useState("");
	// const [actionFile, setActionFile] = useState<FileDocument>();

	return (
		<div className={`${styles.files} ${className}`}>
			<FileCreate />

			<div className={`${styles.feed} mt-16`}>
				{files?.map((file, index) => (
					<FileCard
						key={index}
						file={file}
						// setActionFile={setActionFile}
						// setActionFileId={setActionFileId}
						// setIsDeleteDialogOpen={setIsDeleteDialogOpen}
						// setIsEditDialogOpen={setIsEditDialogOpen}
					/>
				))}
			</div>

			{/* <FileDelete
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
			/> */}
		</div>
	);
};

export default FilesAdmin;
