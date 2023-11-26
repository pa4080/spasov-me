"use client";

import React, { useState } from "react";
import Link from "next/link";

import Image from "next/image";

import { useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/cn-utils";

// import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
import { FileDocument } from "@/interfaces/File";
import { Route } from "@/routes";

import styles from "./_files.module.scss";

import Files_Dialog_Upload from "./Files_Dialog_Upload";
// import Pages_Dialog_Delete from "./Pages_Dialog_Delete";
import ButtonIcon from "../fragments/ButtonIcon";
import Files_Dialog_Delete from "./Files_Dialog_Delete";
import Files_Dialog_Edit from "./Files_Dialog_Edit";

interface Props {
	className?: string;
}

const FilesFeedAndEditOptions: React.FC<Props> = ({ className }) => {
	const { files } = useAppContext();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [actionFileId, setActionFileId] = useState("");
	const [actionFile, setActionFile] = useState<FileDocument>();

	const handleDelete = (e: React.SyntheticEvent, file: FileDocument) => {
		e.preventDefault();
		setActionFile(file);
		setIsDeleteDialogOpen(true);
		setActionFileId(file._id.toString());
	};

	const handleEdit = (e: React.SyntheticEvent, file: FileDocument) => {
		e.preventDefault();
		setActionFile(file);
		setIsEditDialogOpen(true);
		setActionFileId(file._id.toString());
	};

	return (
		<div className={cn(styles.files, className)}>
			<Files_Dialog_Upload />

			<div className={cn(styles.feed, "mt-16")}>
				{files?.map((file, index) => {
					const fileUri = `${Route.api.FILES}/${file._id.toString()}/${file.filename}?v=${new Date(
						file.uploadDate
					).getTime()}`;

					return (
						<div key={index} className={styles.card}>
							<div className={styles.title}>
								<h1>{file.filename}</h1>
								<p>{file.metadata.description}</p>
							</div>
							<Link className={styles.imageLink} href={fileUri} target="_blank">
								<div className={styles.imageContainer}>
									{/* If it is another file type, it will be displayed as a link with icon... */}
									{file.filename.match(/\.(pdf|pptx|xlsx|docx)$/) ? (
										<Image
											priority
											alt={file.filename + " " + file.metadata.description}
											className={styles.image}
											height="0"
											sizes="160px"
											src={`${Route.assets.MIME_TYPE}/${file.filename.split(".").pop()}.png`}
											// style={{ width: "100%", height: "auto" }}
											width="0"
										/>
									) : (
										<Image
											priority
											alt={file.filename + " " + file.metadata.description}
											className={styles.image}
											height="0"
											sizes="320px"
											src={fileUri}
											// style={{ width: "100%", height: "auto" }}
											width="0"
										/>
									)}
								</div>
							</Link>

							<div className={styles.cardEditActions}>
								<ButtonIcon
									className="pl-[2.8px] bg-transparent icon_accent_secondary"
									height={18}
									type="trash"
									width={18}
									onClick={(e) => handleDelete(e, file)}
								/>
								<ButtonIcon
									className="pl-[4.5px] bg-transparent icon_accent_secondary"
									height={18}
									type="brush"
									width={18}
									onClick={(e) => handleEdit(e, file)}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<Files_Dialog_Delete
				fileData={actionFile}
				fileId={actionFileId}
				isOpen={isDeleteDialogOpen}
				setIsOpen={setIsDeleteDialogOpen}
			/>

			<Files_Dialog_Edit
				fileData={actionFile}
				fileId={actionFileId}
				isOpen={isEditDialogOpen}
				setIsOpen={setIsEditDialogOpen}
			/>
		</div>
	);
};

export default FilesFeedAndEditOptions;
