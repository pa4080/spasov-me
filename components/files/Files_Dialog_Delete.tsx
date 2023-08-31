"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import * as z from "zod";

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

import { Files_FormSchema } from "./Files_Form";
import { buttonVariants } from "../ui/button";

interface DeletionData {
	fileId: string;
	imageId: string | undefined;
	action: "DELETE";
	api: string;
	route: string;
	pageData: z.infer<typeof Files_FormSchema>;
}

interface Props {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	fileData: z.infer<typeof Files_FormSchema>;
	fileId: string;
}

const Files_Dialog_Delete: React.FC<Props> = ({ isOpen, setIsOpen, fileData, fileId }) => {
	const t = useTranslations("PagesFeed.Pages_Dialog");
	const { session, pages, setPages } = useAppContext();
	const [submitting, setSubmitting] = useState(false);
	const [delData, setDelData] = useState<DeletionData>({
		fileId: fileId,
		imageId: pages.find((page) => page._id === fileId)?.image?._id.toString(),
		action: "DELETE",
		api: `${Route.api.FILES}`,
		route: `${Route.api.PAGES}/${fileId}`,
		pageData: fileData,
	});

	useEffect(() => {
		setDelData({
			fileId: fileId,
			imageId: pages.find((page) => page._id === fileId)?.image?._id.toString(),
			action: "DELETE",
			api: `${Route.api.PAGES}`,
			route: `${Route.api.PAGES}/${fileId}`,
			pageData: fileData,
		});
	}, [fileId, fileData, pages]);

	const deletePage = async (delData: DeletionData) => {
		setSubmitting(true);

		try {
			const response = await fetch(delData.route, {
				method: "DELETE",
			});

			if (response.ok) {
				const deletedPage = (await response.json()).data;

				setPages((prevPages) => prevPages.filter((page) => page._id !== deletedPage._id));

				toast({
					title: t("toast_response_title", { status: response.status }),
					description: (
						<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
							{JSON.stringify(deletedPage, null, 2)}
						</pre>
					),
				});
			} else {
				const errors = (await response.json()).errors;

				toast({
					title: t("toast_response_title", { status: response.status }),
					description: (
						<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
							{JSON.stringify(errors, null, 2)}
						</pre>
					),
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
				<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
					{JSON.stringify(delData, null, 2)}
				</pre>
			),
		}) && setIsOpen(false);

		deletePage(delData);
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
							{t("title_remove", { title: fileData.title })}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("description_remove", { title: fileData.title, id: fileId })}
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
