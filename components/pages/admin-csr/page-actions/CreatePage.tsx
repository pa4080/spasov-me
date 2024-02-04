"use client";

import React, { useState } from "react";

import { Session } from "next-auth";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
}

const CreatePage: React.FC<Props> = ({ className, session, setPages }) => {
	const t = msgs("PagesFeed_OLD");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	const createPage = async (data: Pages_FormSchema) => {
		setSubmitting(true);

		try {
			const response = await fetch(Route.api.PAGES, {
				method: "POST",
				body: preparePageDocToFetch({
					data,
					user_id: session?.user.id,
				}),
			});

			if (response.ok) {
				const newPage: PageData = (await response.json()).data;

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
		<div className={className}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger disabled={submitting}>
					<ButtonIcon
						className="pl-[0.75rem] pr-[0.7rem] rounded-lg icon_accent_secondary"
						height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
						label={t("dialog_btn_add_a_page")}
						labelSubmitting={t("dialog_btn_add_a_page_submitting")}
						submitting={submitting}
						width={42} // 62
						widthOffset={24}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent closeOnOverlayClick={false}>
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

export default CreatePage;
