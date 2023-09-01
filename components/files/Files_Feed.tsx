"use client";

import React, { useState } from "react";
import Link from "next/link";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { useAppContext } from "@/contexts/AppContext";

// import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
import { FileObject } from "@/interfaces/File";

import Files_Dialog_Upload from "./Files_Dialog_Upload";
// import Pages_Dialog_Delete from "./Pages_Dialog_Delete";
import ButtonIcon from "../fragments/ButtonIcon";
import Files_Dialog_Delete from "./Files_Dialog_Delete";
import { Files_FormSchema } from "./Files_Form";

interface Props {
	className?: string;
	files: FileObject[];
}

const Files_Feed: React.FC<Props> = ({ className, files }) => {
	const { session } = useAppContext();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
	const [actionFileId, setActionFileId] = useState("");
	const [actionFile, setActionFile] = useState<Files_FormSchema>();

	const handleDelete = (e: React.SyntheticEvent, file: FileObject) => {
		e.preventDefault();
		setActionFile(file);
		setIsRemoveDialogOpen(true);
		setActionFileId(file._id.toString());
	};

	// const handleEdit = (e: React.SyntheticEvent, file: FileObject) => {
	// 	e.preventDefault();
	// 	setActionPage({
	// 		filename: file.filename,
	// 		description: page.description,
	// 		uri: page.uri,
	// 		image: page.image?.filename,
	// 	});
	// 	setIsEditDialogOpen(true);
	// 	setActionPageId(file._id.toString());
	// };

	return (
		<div className={cn("", className)}>
			<Files_Dialog_Upload />
			<div className="files_feed">
				{files?.map((file, index) => (
					<div key={index} className="files_card ">
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
										// onClick={(e) => handleEdit(e, file)}
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
							{/* If it is another file type, it will be displayed as a link with icon... */}
							<Link href={`/api/files/${file._id.toString()}`} target="_blank">
								<Image
									priority
									alt={file.filename + " " + file.metadata.description}
									className="files_image"
									height={200}
									src={`/api/files/${file._id.toString()}`}
									width={356}
								/>
							</Link>
						</div>
					</div>
				))}
			</div>

			<Files_Dialog_Delete
				fileData={actionFile}
				fileId={actionFileId}
				isOpen={isRemoveDialogOpen}
				setIsOpen={setIsRemoveDialogOpen}
			/>
		</div>
	);
};

export default Files_Feed;
