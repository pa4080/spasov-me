"use client";

import React, { Dispatch, SetStateAction, useState } from "react";

import { useAppContext } from "@/contexts/AppContext";

import { toast } from "@/components/ui/use-toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { Route } from "@/routes";
import { preparePageObjectToFetch } from "@/interfaces/Page";

import { msgs } from "@/messages";

import Files_Form, { Files_FormSchema } from "./files-form";

interface Props {
	className?: string;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	fileData?: Files_FormSchema;
	fileId?: string;
}

const Files_Dialog_Edit: React.FC<Props> = ({ isOpen, setIsOpen, fileData, fileId }) => {
	const t = msgs("FilesFeed");
	const { session, setPages } = useAppContext();

	const [submitting, setSubmitting] = useState(false);

	const editPage = async (data: Files_FormSchema) => {
		setSubmitting(true);

		try {
			const response = await fetch(`${Route.api.FILES}/${fileId}`, {
				method: "PATCH",
				body: preparePageObjectToFetch({
					data,
					user_id: session?.user.id,
				}),
			});

			if (response.ok) {
				const newPage = (await response.json()).data;

				setPages((prevPages) => {
					const newPages = [...prevPages];
					const index = newPages.findIndex((page) => page._id === newPage._id);

					newPages[index] = newPage;

					return newPages;
				});

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(newPage, null, 2)}</pre>,
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
						formData={{ ...fileData, fileId }}
						isContainerDialogOpen={isOpen}
						submitting={submitting}
						onSubmit={handleEditPage}
					/>
				</DialogContent>
			</Dialog>
		)
	);
};

export default Files_Dialog_Edit;
