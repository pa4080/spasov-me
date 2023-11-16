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

import { useAppContext } from "@/contexts/AppContext";
import { toast } from "@/components/ui/use-toast";

import { Route } from "@/routes";
import { PageObject, preparePageObjectToFetch } from "@/interfaces/Page";
import ButtonIcon from "@/components/fragments/ButtonIcon";

import Pages_Form, { Pages_FormSchema } from "./Pages_Form";
import { AddPageReturnType } from "../_home-page.functions";

interface Props {
	className?: string;
	addPage: (data: Pages_FormSchema) => Promise<AddPageReturnType>;
}

const Pages_Dialog_Add: React.FC<Props> = ({ className, addPage }) => {
	const { session, setPages } = useAppContext();
	const t = msgs("PagesFeed");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	const createPage = async (data: Pages_FormSchema) => {
		setSubmitting(true);

		try {
			const response = await addPage(data);

			// eslint-disable-next-line no-console
			console.log(response);
			// const response = await fetch(Route.api.PAGES, {
			// 	method: "POST",
			// 	body: preparePageObjectToFetch({
			// 		data,
			// 		user_id: session?.user.id,
			// 	}),
			// });

			// if (response.created) {
			// 	const newPage: PageObject = (await response.json()).data;

			// 	setPages((prevPages) => [...prevPages, newPage]);

			// 	toast({
			// 		title: t("dialog_toast_response_title", { status: response.status }),
			// 		description: <pre className="toast_pre_info">{JSON.stringify(newPage, null, 2)}</pre>,
			// 	});
			// } else {
			// 	const errors = (await response.json()).errors;

			// 	toast({
			// 		title: t("dialog_toast_response_title", { status: response.status }),
			// 		description: <pre className="toast_pre_info">{JSON.stringify(errors, null, 2)}</pre>,
			// 		variant: "destructive",
			// 	});
			// }
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
							className="pl-3 pr-[0.7rem] rounded-lg absolute -top-14 xa:right-0"
							height={26}
							submitting={submitting}
							width={42}
							widthOffset={24}
							onClick={() => setIsOpen(true)}
						/>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("dialog_title_add")}</DialogTitle>
							<DialogDescription>{t("dialog_description")}</DialogDescription>
						</DialogHeader>

						<Pages_Form
							isContainerDialogOpen={isOpen}
							submitting={submitting}
							onSubmit={handleAddPage}
						/>
					</DialogContent>
				</Dialog>
			</div>
		)
	);
};

export default Pages_Dialog_Add;
