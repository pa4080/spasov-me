"use client";

import React, { useState } from "react";
import Link from "next/link";

import Image from "next/image";

import { useSession } from "next-auth/react";

import { useAppContext } from "@/contexts/AppContext";

import { cn } from "@/lib/cn-utils";

// import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
import { FileObject } from "@/interfaces/File";

import base64placeholder from "@/public/assets/images/image-placeholder";

import { Route } from "@/routes";

import Files_Dialog_Upload from "./Files_Dialog_Upload";
// import Pages_Dialog_Delete from "./Pages_Dialog_Delete";
import ButtonIcon from "../fragments/ButtonIcon";
import Files_Dialog_Delete from "./Files_Dialog_Delete";
import { Files_FormSchema } from "./Files_Form";
import Files_Dialog_Edit from "./Files_Dialog_Edit";

interface Props {
	className?: string;
}

const FilesFeedAndEditOptions: React.FC<Props> = ({ className }) => {
	const { files, setFiles } = useAppContext();

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [actionFileId, setActionFileId] = useState("");
	const [actionFile, setActionFile] = useState<Files_FormSchema>();

	const { data: session } = useSession();

	const handleDelete = (e: React.SyntheticEvent, file: FileObject) => {
		e.preventDefault();
		setActionFile(file);
		setIsDeleteDialogOpen(true);
		setActionFileId(file._id.toString());
	};

	const handleEdit = (e: React.SyntheticEvent, file: FileObject) => {
		e.preventDefault();
		setActionFile(file);
		setIsEditDialogOpen(true);
		setActionFileId(file._id.toString());
	};

	return (
		<div className={cn("", className)}>
			<Files_Dialog_Upload />
			<div className="files_feed">
				{files?.map((file, index) => (
					<div key={index} className="files_card">
						<div>
							<h1 className="files_card_title">{file.filename}</h1>
							<p>{file.metadata.description}</p>
						</div>
						<div className="files_image_container">
							{session?.user && (
								<div className="files_card_actions">
									<ButtonIcon
										className="pl-[5px] bg-transparent"
										height={18}
										type="brush"
										width={18}
										onClick={(e) => handleEdit(e, file)}
									/>
									<ButtonIcon
										className="pl-[2.6px] bg-transparent"
										height={18}
										type="trash"
										width={18}
										onClick={(e) => handleDelete(e, file)}
									/>
								</div>
							)}
							<div className="files_image_wrapper">
								{/* If it is another file type, it will be displayed as a link with icon... */}
								<Link href={`/api/files/${file._id.toString()}`} target="_blank">
									{file.filename.match(/\.(pdf|pptx|xlsx|docx)$/) ? (
										<Image
											priority
											alt={file.filename + " " + file.metadata.description}
											className="files_image"
											height={200}
											src={`/assets/images/mime-type-icons/${file.filename.split(".").pop()}.png`}
											width={200}
										/>
									) : (
										<Image
											priority
											alt={file.filename + " " + file.metadata.description}
											className="files_image"
											height={200}
											placeholder={`data:image/${base64placeholder}`}
											src={`/api/files/${file._id.toString()}`}
											width={356}
										/>
									)}
								</Link>
							</div>
						</div>
					</div>
				))}
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
