"use client";

import React, { useState } from "react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";
import { toast } from "@/components/ui/use-toast";
import ButtonIcon from "@/components/fragments/ButtonIcon";

import PagesForm, { Pages_FormSchema } from "../csr-api/pages-form";

import { addPage } from "../_pages.actions";

import { PagesActions } from ".";

const Pages_Dialog_Add: React.FC<PagesActions> = ({ className }) => {
	const t = msgs("PagesFeed");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	const createPage = async (data: Pages_FormSchema) => {
		try {
			setSubmitting(true);
			/**
			 * In case we were used <form action={addPage}> this conversion will not be needed,
			 * because our "addPage()" server action is designed to accept object of FormData.
			 *
			 * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
			 * form.action()...
			 *
			 * @see https://stackoverflow.com/a/40552372/6543935
			 */
			const newPageFormData = Object.keys(data).reduce((formData, key) => {
				formData.append(key, String(data[key as keyof Pages_FormSchema]));

				return formData;
			}, new FormData());

			const newPage = await addPage(newPageFormData);

			if (newPage) {
				toast({
					title: t("dialog_toast_response_title", { status: "SUCCESS" }),
					description: <pre className="toast_pre_info">{JSON.stringify(newPage, null, 2)}</pre>,
				});
			} else {
				toast({
					title: t("dialog_toast_response_title", { status: "ERROR" }),
					// description: <pre className="toast_pre_info">{JSON.stringify(errors, null, 2)}</pre>,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleAddPage = (data: Pages_FormSchema) => {
		toast({
			title: t("dialog_toast_submit_title"),
			description: <pre className="toast_pre_info">{JSON.stringify(data, null, 2)}</pre>,
		}) && setIsOpen(false);

		createPage(data);
	};

	return (
		<div className={cn("w-full h-0 relative", className)}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger disabled={submitting}>
					<ButtonIcon
						className="pl-[0.6rem] pr-[0.7rem] rounded-lg absolute -top-4 right-0 icon_accent_secondary"
						height={36}
						submitting={submitting}
						width={62}
						widthOffset={24}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("dialog_title_add")}</DialogTitle>
						<DialogDescription>{t("dialog_description")}</DialogDescription>
					</DialogHeader>

					<PagesForm submitting={submitting} onSubmit={handleAddPage} />
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Pages_Dialog_Add;
