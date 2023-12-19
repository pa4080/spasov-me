"use client";

import React from "react";

import Image from "next/image";

import { FileDocument } from "@/interfaces/File";
import { Route } from "@/routes";

import styles from "../_files.module.scss";

import ButtonIcon from "../../fragments/ButtonIcon";

interface Props {
	className?: string;
	file: FileDocument;
	setActionFile: React.Dispatch<React.SetStateAction<FileDocument | undefined>>;
	setActionFileId: React.Dispatch<React.SetStateAction<string>>;
	setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileDisplay: React.FC<Props> = ({
	className,
	file,
	setActionFile,
	setActionFileId,
	setIsDeleteDialogOpen,
	setIsEditDialogOpen,
}) => {
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

	const fileUri = `${Route.api.FILES}/${file._id.toString()}/${file.filename}?v=${new Date(
		file.uploadDate
	).getTime()}`;

	return (
		<div className={`${styles.card} ${className}`}>
			<div className={styles.title}>
				<h1>{file.filename}</h1>

				<p>{file.metadata.description}</p>
			</div>

			<a className={styles.imageLink} href={fileUri} target="_blank">
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
							width="0"
						/>
					)}
				</div>
			</a>

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
};

export default FileDisplay;
