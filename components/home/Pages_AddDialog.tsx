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
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { Path } from "@/interfaces/Path";
import { preparePageObjectToFetch } from "@/interfaces/Page";

import Pages_Form, { FormSchema } from "./Pages_Form";

interface Props {
	className?: string;
}

const AddPageForm: React.FC<Props> = ({ className }) => {
	const t = useTranslations("PagesFeed.Pages_AddDialog");
	const { session } = useAppContext();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	// Clear the image field if the dialog is closed,
	// Otherwise on the next open "it" will attempt to set
	// the image field programmatically, which is not allowed by the browser.
	useEffect(() => {
		!isOpen && form.getValues("image") && form.setValue("image", undefined);
	}, [form, isOpen]);

	const createPage = async (data: z.infer<typeof FormSchema>) => {
		setSubmitting(true);

		// if (post.aiCategory === AiCategories.IMAGE && !formDataToUpload) {
		// 	setErrors((prevErrors) => ({ ...prevErrors, image: { message: t("imageRequiredError") } }));
		// 	setSubmitting(false);

		// 	return;
		// } else if (post.aiCategory === AiCategories.IMAGE && formDataToUpload) {
		// 	setErrors((prevErrors) => clearSpecificError(prevErrors, "image"));
		// }

		// const image_id: string | null = await uploadOrReplaceImage({
		// 	formDataToUpload,
		// 	postImageFilename,
		// 	post,
		// });

		try {
			const response = await fetch(Path.api.PAGES, {
				method: "POST",
				body: preparePageObjectToFetch({
					data,
					user_id: session?.user.id, // can be skipped on PUT/Update
				}),
			});

			if (response.ok) {
				const newPage = (await response.json()).data;
				// setPages((prevPages) => [...prevPages, newPage]);

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
		createPage(data);

		toast({
			title: t("toast_submit_title"),
			description: (
				<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
					{JSON.stringify(data, null, 2)}
				</pre>
			),
		}) && setIsOpen(false);
	};

	return (
		<>
			{session?.user && (
				<div className={cn("h-16 w-full flex items-end justify-end", className)}>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger>
							<div
								className={cn(
									"rounded-full bg-mlt-dark-4 hover:bg-mlt-gray-4 text-mlt-gray-2 hover:text-mlt-dark-3 transition-colors duration-200 py-1 px-4 md:py-2 md:px-6 font-Unicephalon tracking-widest text-sm md:text-md",
									""
								)}
							>
								{submitting ? t("trigger_submitting") : t("trigger_label")}
							</div>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t("title")}</DialogTitle>
								<DialogDescription>{t("description")}</DialogDescription>
							</DialogHeader>

							<Pages_Form
								isContainerDialogOpen={isOpen}
								submitting={submitting}
								onSubmit={onSubmit}
							/>
						</DialogContent>
					</Dialog>
				</div>
			)}
		</>
	);
};

export default AddPageForm;
