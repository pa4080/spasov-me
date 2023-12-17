"use client";

import React, { Dispatch, SetStateAction, useState } from "react";

import { useAppContext } from "@/contexts/AppContext";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

import { FileDocument } from "@/interfaces/File";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import Files_Form from "./files-form";
import { Files_FormSchema } from "./files-form/schema";

interface Props {
	className?: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	fileData?: FileDocument;
	fileId?: string;
}

const FileEdit: React.FC<Props> = ({ isOpen, setIsOpen, fileData, fileId }) => {
	const t = msgs("FilesFeed");
	const { session, setFiles } = useAppContext();

	const [submitting, setSubmitting] = useState(false);

	const editPage = async (data: Files_FormSchema) => {
		setSubmitting(true);

		try {
			if (!session?.user.id) {
				throw new Error("No user id");
			}

			const formData = new FormData();

			formData.append("file", data.file as File);
			formData.append("name", data.filename);
			formData.append("description", data.description || "");
			formData.append("user_id", session?.user.id);

			const response = await fetch(`${Route.api.FILES}/${fileId}`, {
				method: "PATCH",
				body: formData,
			});

			if (response.ok) {
				const newFile: FileDocument = (await response.json()).data;

				// TODO: Here we waiting a while for the backend upload stream to finish
				// find a way to do this without waiting with timeout but with a promise
				setTimeout(
					() => {
						setFiles((prevFiles) =>
							prevFiles.map((file) => (file._id === newFile._id ? newFile : file))
						);
					},
					newFile?.chunkSize / 100 || 500
				);

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(newFile, null, 2)}</pre>,
				});
			} else {
				const errors = (await response.json()).errors;

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(errors, null, 2)}</pre>,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleEditPage = (data: Files_FormSchema) => {
		toast({
			title: t("dialog_toast_submit_title"),
			description: <pre className="toast_pre_info">{JSON.stringify(data, null, 2)}</pre>,
		}) && setIsOpen(false);

		editPage(data);
	};

	if (!fileData || !fileId) {
		return;
	}

	return (
		session?.user && (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="pr-6">
							{t("dialog_title_edit", { filename: fileData.filename })}
						</DialogTitle>
						<DialogDescription>{t("dialog_description")}</DialogDescription>
					</DialogHeader>

					<Files_Form
						formData={fileData}
						isContainerDialogOpen={isOpen}
						submitting={submitting}
						onSubmit={handleEditPage}
					/>
				</DialogContent>
			</Dialog>
		)
	);
};

export default FileEdit;
