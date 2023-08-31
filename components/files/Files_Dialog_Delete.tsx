"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";

import { useAppContext } from "@/contexts/AppContext";
import { Route } from "@/routes";
import { toast } from "@/components/ui/use-toast";
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
import { buttonVariants } from "@/components//ui/button";

import { Files_FormSchema } from "./Files_Form";

interface Props {
	className?: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	fileData: Files_FormSchema;
	fileId: string;
}

const Files_Dialog_Delete: React.FC<Props> = ({ isOpen, setIsOpen, fileData, fileId }) => {
	const t = useTranslations("PagesFeed.Pages_Dialog");
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
					title: t("toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(deletedFile, null, 2)}</pre>,
				});
			} else {
				const errors = (await response.json()).errors;

				toast({
					title: t("toast_response_title", { status: response.status }),
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
			title: t("toast_submit_title"),
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
						<AlertDialogTitle className="text-mlt-orange-dark">
							{t("title_remove", { filename: fileData.filename })}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("description_remove", { filename: fileData.filename, id: fileId })}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={handleDelete}
						>
							{submitting ? t("btn_delete_submitting") : t("btn_delete")}
						</AlertDialogAction>
						<AlertDialogCancel className={buttonVariants({ variant: "secondary" })}>
							{t("btn_cancel")}
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)
	);
};

export default Files_Dialog_Delete;
