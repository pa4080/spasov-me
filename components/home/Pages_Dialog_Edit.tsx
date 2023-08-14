"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useAppContext } from "@/contexts/AppContext";

import { toast } from "@/components/ui/use-toast";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { Path } from "@/interfaces/Path";
import { preparePageObjectToFetch } from "@/interfaces/Page";

import Pages_Form, { FormSchema } from "./Pages_Form";

interface Props {
	className?: string;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	pageData: z.infer<typeof FormSchema>;
	pageId: string;
}

const Pages_Dialog_Edit: React.FC<Props> = ({ isOpen, setIsOpen, pageData, pageId }) => {
	const t = useTranslations("PagesFeed.Pages_Dialog");
	const { session, setPages } = useAppContext();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const [submitting, setSubmitting] = useState(false);

	// Clear the image field if the dialog is closed,
	// Otherwise on the next open "it" will attempt to set
	// the image field programmatically, which is not allowed by the browser.
	useEffect(() => {
		!isOpen && form.getValues("image") && form.setValue("image", undefined);
	}, [form, isOpen]);

	const editPage = async (data: z.infer<typeof FormSchema>) => {
		setSubmitting(true);

		try {
			const response = await fetch(`${Path.api.PAGES}/${pageId}`, {
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
					title: t("toast_response_title", { status: response.status }),
					description: (
						<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
							{JSON.stringify(newPage, null, 2)}
						</pre>
					),
				}) && form.reset();
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

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		toast({
			title: t("toast_submit_title"),
			description: (
				<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
					{JSON.stringify(data, null, 2)}
				</pre>
			),
		}) && setIsOpen(false);

		editPage(data);
	};

	if (!pageData || !pageId) {
		return;
	}

	return (
		<>
			{session?.user && (
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("title_edit", { title: pageData.title })}</DialogTitle>
							<DialogDescription>{t("description")}</DialogDescription>
						</DialogHeader>

						<Pages_Form
							formData={pageData}
							isContainerDialogOpen={isOpen}
							submitting={submitting}
							onSubmit={onSubmit}
						/>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};

export default Pages_Dialog_Edit;
