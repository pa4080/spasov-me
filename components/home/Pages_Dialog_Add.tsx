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

import { Route } from "@/routes";
import { preparePageObjectToFetch } from "@/interfaces/Page";

import Pages_Form, { Pages_FormSchema } from "./Pages_Form";
import ButtonIcon from "../fragments/ButtonIcon";

interface Props {
	className?: string;
}

const Pages_Dialog_Add: React.FC<Props> = ({ className }) => {
	const t = useTranslations("PagesFeed.Pages_Dialog");
	const { session, setPages } = useAppContext();

	const form = useForm<z.infer<typeof Pages_FormSchema>>({
		resolver: zodResolver(Pages_FormSchema),
	});

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	// Clear the image field if the dialog is closed,
	// Otherwise on the next open "it" will attempt to set
	// the image field programmatically, which is not allowed by the browser.
	useEffect(() => {
		!isOpen && form.getValues("image") && form.setValue("image", undefined);
	}, [form, isOpen]);

	const createPage = async (data: z.infer<typeof Pages_FormSchema>) => {
		setSubmitting(true);

		try {
			const response = await fetch(Route.api.PAGES, {
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

	const onSubmit = (data: z.infer<typeof Pages_FormSchema>) => {
		toast({
			title: t("toast_submit_title"),
			description: (
				<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
					{JSON.stringify(data, null, 2)}
				</pre>
			),
		}) && setIsOpen(false);

		createPage(data);
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
								submitting={submitting}
								width={42}
								widthOffset={24}
								onClick={() => setIsOpen(true)}
							/>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>{t("title_add")}</DialogTitle>
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

export default Pages_Dialog_Add;
