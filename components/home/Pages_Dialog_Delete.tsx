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

import { Pages_FormSchema } from "./Pages_Form";
import { buttonVariants } from "../ui/button";

interface DeletionData {
	pageId: string;
	imageId: string | undefined;
	action: "DELETE";
	api: string;
	route: string;
	pageData: z.infer<typeof Pages_FormSchema>;
}

interface Props {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	pageData: z.infer<typeof Pages_FormSchema>;
	pageId: string;
}

const Pages_Dialog_Delete: React.FC<Props> = ({ isOpen, setIsOpen, pageData, pageId }) => {
	const t = useTranslations("PagesFeed.Pages_Dialog");
	const { session, pages, setPages } = useAppContext();
	const [submitting, setSubmitting] = useState(false);
	const [delData, setDelData] = useState<DeletionData>({
		pageId,
		imageId: pages.find((page) => page._id === pageId)?.image?._id.toString(),
		action: "DELETE",
		api: `${Route.api.PAGES}`,
		route: `${Route.api.PAGES}/${pageId}`,
		pageData,
	});

	useEffect(() => {
		setDelData({
			pageId,
			imageId: pages.find((page) => page._id === pageId)?.image?._id.toString(),
			action: "DELETE",
			api: `${Route.api.PAGES}`,
			route: `${Route.api.PAGES}/${pageId}`,
			pageData,
		});
	}, [pageId, pageData, pages]);

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

	if (!pageData || !pageId) {
		return;
	}

	return (
		<>
			{session?.user && (
				<>
					<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className="text-mlt-orange-dark">
									{t("title_remove", { title: pageData.title })}
								</AlertDialogTitle>
								<AlertDialogDescription>
									{t("description_remove", { title: pageData.title, id: pageId })}
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
				</>
			)}
		</>
	);
};

export default Pages_Dialog_Delete;
