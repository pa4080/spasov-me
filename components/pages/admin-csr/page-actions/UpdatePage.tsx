"use client";

import React, { Dispatch, SetStateAction, useState } from "react";

import { Session } from "next-auth";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { PageData, preparePageDocToFetch } from "@/interfaces/Page";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import PagesForm from "../page-form";
import { Pages_FormSchema } from "../page-form/schema";

interface Props {
	className?: string;
	session: Session | null;
	setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>;
	pageData?: Pages_FormSchema;
	pageId?: string;
}

const UpdatePage: React.FC<Props> = ({
	isOpen,
	setIsOpen,
	pageData,
	pageId,
	setPages,
	session,
}) => {
	const t = msgs("PagesFeed_OLD");

	const [submitting, setSubmitting] = useState(false);

	const editPage = async (data: Pages_FormSchema) => {
		setSubmitting(true);

		try {
			const response = await fetch(`${Route.api.PAGES}/${pageId}`, {
				method: "PATCH",
				body: preparePageDocToFetch({
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
					description: errors ? (
						<pre className="toast_pre_info">{JSON.stringify(errors, null, 2)}</pre>
					) : (
						<div>None...</div>
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

	const handleEditPage = (data: Pages_FormSchema) => {
		toast({
			title: t("dialog_toast_submit_title"),
			description: <pre className="toast_pre_info">{JSON.stringify(data, null, 2)}</pre>,
		}) && setIsOpen(false);

		editPage(data);
	};

	if (!pageData || !pageId) {
		return;
	}

	return (
		session?.user && (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent closeOnOverlayClick={false}>
					<DialogHeader>
						<DialogTitle>{t("dialog_title_edit", { title: pageData.title })}</DialogTitle>
						<DialogDescription>{t("dialog_description")}</DialogDescription>
					</DialogHeader>

					<PagesForm formData={pageData} submitting={submitting} onSubmit={handleEditPage} />
				</DialogContent>
			</Dialog>
		)
	);
};

export default UpdatePage;
