"use client";

import React, { Dispatch, SetStateAction, useState } from "react";

import { useAppContext } from "@/contexts/AppContext";

import { buttonVariants } from "@/components//ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Route } from "@/routes";

import { msgs } from "@/messages";

import { Files_FormSchema } from "./files-form/schema";

interface Props {
	className?: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	fileData?: Files_FormSchema;
	fileId?: string;
}

const FileDelete: React.FC<Props> = ({ isOpen, setIsOpen, fileData, fileId }) => {
	const t = msgs("FilesAdmin_Form");
	const { session, setFiles } = useAppContext();
	const [submitting, setSubmitting] = useState(false);

	const deletePage = async () => {
		setSubmitting(true);

		try {
			const response = await fetch(`${Route.api.FILES}/${fileId}`, { method: "DELETE" });

			if (response.ok) {
				const deletedFile = (await response.json()).data;

				setFiles((prevFiles) => prevFiles.filter((file) => file._id !== deletedFile._id));

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(deletedFile, null, 2)}</pre>,
				});
			} else {
				const errors = (await response.json()).errors;

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(errors, null, 2)}</pre>,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = (e: React.SyntheticEvent) => {
		e.preventDefault();

		toast({
			title: t("dialog_toast_submit_title"),
			description: (
				<pre className="toast_pre_info">
					{JSON.stringify({ action: "DELETE", fileId, fileData }, null, 2)}
				</pre>
			),
		}) && setIsOpen(false);

		deletePage();
	};

	if (!fileData || !fileId) {
		return;
	}

	return (
		session?.user && (
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-accent-secondary">
							{t("dialog_title_delete", { filename: fileData.filename })}
						</AlertDialogTitle>
						<AlertDialogDescription className="hyphens-auto break-words">
							{t("dialog_description_delete", { filename: fileData.filename, id: fileId })}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={handleDelete}
						>
							{submitting ? t("dialog_btn_delete_submitting") : t("dialog_btn_delete")}
						</AlertDialogAction>
						<AlertDialogCancel className={buttonVariants({ variant: "secondary" })}>
							{t("dialog_btn_cancel")}
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)
	);
};

export default FileDelete;
