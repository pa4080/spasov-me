"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { BsSendCheck } from "react-icons/bs";

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

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { toast } from "@/components/ui/use-toast";
import { generateFormDataFromObject } from "@/lib/generateFormDataFromObject";

import { Entry_FormSchema } from "./entry-form/schema";

import EntryForm from "./entry-form";

import { createEntry } from "../_about.actions";

import { GenericActionProps } from ".";

const EntryCreate: React.FC<GenericActionProps> = ({ className, entryType }) => {
	const t = msgs("AboutCV_CreateEntry");
	const entryTypeLabel = (
		msgs("AboutCV_Form")("aboutEntry_type_list") as unknown as Record<string, string>
	)[entryType];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
	const pathname = usePathname();

	const handleCreateEntry = async (data: Entry_FormSchema) => {
		setSubmitting(true);
		try {
			/**
			 * In case we were used <form action={addPage}> this conversion will not be needed,
			 * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
			 * form.action()... @see https://stackoverflow.com/a/40552372/6543935
			 */
			if (
				data.dateTo.toLocaleDateString("en-US", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}) ===
				new Date().toLocaleDateString("en-US", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				})
			) {
				data.dateTo = "now" as unknown as Date;
			}

			const response = await createEntry(generateFormDataFromObject(data), pathname);

			if (response) {
				toast({
					description: (
						<div className="flex flex-col items-center gap-2 justify-center w-full">
							<div className="flex items-center gap-2 justify-between">
								<span className="text-base">{t("toast_submitted")}</span>
								<span className="text-3xl">
									<BsSendCheck />
								</span>
							</div>
						</div>
					),
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
			setIsOpen(false);
		}
	};

	const showDescription = t("dialog_description") && t("dialog_description") !== "null";

	return (
		<div className={cn(className)}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger disabled={submitting}>
					<ButtonIcon
						className="pl-[0.75rem] pr-[0.7rem] rounded-lg icon_accent_secondary"
						height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
						label={t("dialog_btn_add")}
						labelSubmitting={t("dialog_btn_add_submitting")}
						submitting={submitting}
						width={42} // 62
						widthOffset={24}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl">
					<DialogHeader className="-mt-2">
						<DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
						{showDescription && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: "new id" }),
								}}
							/>
						)}
					</DialogHeader>

					<EntryForm
						className="mt-0"
						entryType="employment"
						submitting={submitting}
						onSubmit={handleCreateEntry}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default EntryCreate;
