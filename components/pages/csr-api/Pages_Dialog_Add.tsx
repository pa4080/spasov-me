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

import { Route } from "@/routes";
import { PageObject, preparePageObjectToFetch } from "@/interfaces/Page";
import ButtonIcon from "@/components/fragments/ButtonIcon";

import Pages_Form, { Pages_FormSchema } from "./Pages_Form";

import { PagesActions } from ".";

const Pages_Dialog_Add: React.FC<PagesActions> = ({ className, session, setPages }) => {
	const t = msgs("PagesFeed");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	const createPage = async (data: Pages_FormSchema) => {
		setSubmitting(true);

		// eslint-disable-next-line no-console
		console.log("createPage", data);

		try {
			const response = await fetch(Route.api.PAGES, {
				method: "POST",
				body: preparePageObjectToFetch({
					data,
					user_id: session?.user.id,
				}),
			});

			if (response.ok) {
				const newPage: PageObject = (await response.json()).data;

				setPages((prevPages) => [...prevPages, newPage]);

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

	const handleAddPage = (data: Pages_FormSchema) => {
		toast({
			title: t("dialog_toast_submit_title"),
			description: <pre className="toast_pre_info">{JSON.stringify(data, null, 2)}</pre>,
		}) && setIsOpen(false);

		createPage(data);
	};

	return (
		session?.user && (
			<div className={cn("w-full h-0 relative", className)}>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger disabled={submitting}>
						<ButtonIcon
							className="pl-[0.75rem] pr-[0.7rem] rounded-lg absolute -top-4 right-0 icon_accent_secondary"
							height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
							label={t("dialog_btn_add_a_page")}
							labelSubmitting={t("dialog_btn_add_a_page_submitting")}
							submitting={submitting}
							width={42} // 62
							widthOffset={24}
							onClick={() => setIsOpen(true)}
						/>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("dialog_title_add")}</DialogTitle>
							<DialogDescription>{t("dialog_description")}</DialogDescription>
						</DialogHeader>

						<Pages_Form submitting={submitting} onSubmit={handleAddPage} />
					</DialogContent>
				</Dialog>
			</div>
		)
	);
};

export default Pages_Dialog_Add;
