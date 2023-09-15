"use client";

import React, { useState } from "react";
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
import { buttonVariants } from "@/components/ui/button";

import { Pages_FormSchema } from "./Pages_Form";

interface Props {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	pageData?: Pages_FormSchema;
	pageId?: string;
}

const Pages_Dialog_Delete: React.FC<Props> = ({ isOpen, setIsOpen, pageData, pageId }) => {
	const t = useTranslations("PagesFeed.Dialog");
	const { session, setPages } = useAppContext();
	const [submitting, setSubmitting] = useState(false);

	const deletePage = async () => {
		setSubmitting(true);

		try {
			const response = await fetch(`${Route.api.PAGES}/${pageId}`, { method: "DELETE" });

			if (response.ok) {
				const deletedPage = (await response.json()).data;

				setPages((prevPages) => prevPages.filter((page) => page._id !== deletedPage._id));

				toast({
					title: t("toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(deletedPage, null, 2)}</pre>,
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

	const handleDeletePage = (e: React.SyntheticEvent) => {
		e.preventDefault();

		toast({
			title: t("toast_submit_title"),
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
						<AlertDialogTitle className="text-mlt-orange-dark">
							{t("title_delete", { title: pageData.title })}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("description_delete", { title: pageData.title, id: pageId })}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={handleDeletePage}
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

export default Pages_Dialog_Delete;
