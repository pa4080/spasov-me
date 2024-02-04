"use client";

import React, { useState } from "react";

import { Session } from "next-auth";

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
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { PageData } from "@/interfaces/Page";

import { Pages_FormSchema } from "../page-form/schema";

interface Props {
	className?: string;
	session: Session | null;
	setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	pageData?: Pages_FormSchema;
	pageId?: string;
}

const DeletePage: React.FC<Props> = ({
	isOpen,
	setIsOpen,
	pageData,
	pageId,
	setPages,
	session,
}) => {
	const t = msgs("PagesFeed_OLD");

	const [submitting, setSubmitting] = useState(false);

	const deletePage = async () => {
		setSubmitting(true);

		try {
			const response = await fetch(`${Route.api.PAGES}/${pageId}`, { method: "DELETE" });

			if (response.ok) {
				const deletedPage = (await response.json()).data;

				setPages((prevPages) => prevPages.filter((page) => page._id !== deletedPage._id));

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(deletedPage, null, 2)}</pre>,
				});
			} else {
				const errors = (await response.json()).errors;

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(errors, null, 2)}</pre>,
					// variant: "destructive",
					variant: "default",
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleDeletePage = (e: React.SyntheticEvent) => {
		e.preventDefault();

		toast({
			title: t("dialog_toast_submit_title"),
			description: (
				<pre className="toast_pre_info">
					{JSON.stringify({ action: "DELETE", pageId, pageData }, null, 2)}
				</pre>
			),
		}) && setIsOpen(false);

		deletePage();
	};

	if (!pageData || !pageId) {
		return;
	}

	return (
		session?.user && (
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-ring-secondary">
							{t("dialog_title_delete", { title: pageData.title })}
						</AlertDialogTitle>
						<AlertDialogDescription className="hyphens-auto break-words">
							{t("dialog_description_delete", { title: pageData.title, id: pageId })}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={handleDeletePage}
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

export default DeletePage;