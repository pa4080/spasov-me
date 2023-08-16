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

import { uploadOrReplaceImage } from "@/lib/fetch-helpers";

import Files_Form, { Files_FormSchema } from "./Files_Form";
import ButtonIcon from "../fragments/ButtonIcon";

interface Props {
	className?: string;
}

const Files_Dialog_Upload: React.FC<Props> = ({ className }) => {
	const t = useTranslations("FilesFeed.Files_Dialog");
	const { session, setPages } = useAppContext();

	const form = useForm<z.infer<typeof Files_FormSchema>>({
		resolver: zodResolver(Files_FormSchema),
	});

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	// Clear the image field if the dialog is closed,
	// Otherwise on the next open "it" will attempt to set
	// the image field programmatically, which is not allowed by the browser.
	// useEffect(() => {
	// 	!isOpen && form.getValues("file") && form.setValue("file", "");
	// }, [form, isOpen]);

	const _uploadFile = async (data: z.infer<typeof Files_FormSchema>) => {
		setSubmitting(true);

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

				setPages((prevPages) => [...prevPages, newPage]);

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

	const uploadFile = async (data: z.infer<typeof Files_FormSchema>) => {
		const formData = new FormData();

		formData.append("file", data.file as File);
		formData.append("name", data.name);
		formData.append("description", data.description || "");

		const response = await fetch(Path.api.FILES, {
			method: "POST",
			body: formData,
		});

		// if (response.ok) {
		// 	image_id = (await response.json())[0]._id;

		// 	const old_id = old_image?._id?.toString();

		// 	if (image_id && old_id && image_id !== old_id) {
		// 		const response = await fetch(`/api/files/${old_id}`, {
		// 			method: "DELETE",
		// 		});

		// 		if (!response.ok) {
		// 			console.error(response);
		// 		}
		// 	}
		// }
	};

	const onSubmit = (data: z.infer<typeof Files_FormSchema>) => {
		const dataVisualRepresentation = {
			...data,
			file: {
				name: (data.file as File).name,
				size: (data.file as File).size,
				type: (data.file as File).type,
				lastModified: (data.file as File).lastModified,
			},
		};

		toast({
			title: t("toast_submit_title"),
			description: (
				<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
					{JSON.stringify(dataVisualRepresentation, null, 2)}
				</pre>
			),
		}) && setIsOpen(false);

		uploadFile(data);
	};

	return (
		<>
			{session?.user && (
				<div className={cn("w-full h-0 relative", className)}>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger disabled={submitting}>
							<ButtonIcon
								className="pl-3 pr-[0.7rem] rounded-lg absolute -top-14 sm580:right-0"
								height={26}
								label={t("btn_label_upload")}
								labelSubmitting={t("btn_label_uploading")}
								submitting={submitting}
								width={42}
								widthOffset={24}
								onClick={() => setIsOpen(true)}
							/>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t("title_upload")}</DialogTitle>
								<DialogDescription>{t("description")}</DialogDescription>
							</DialogHeader>

							<Files_Form
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

export default Files_Dialog_Upload;
