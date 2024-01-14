"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";
import { BsSendCheck } from "react-icons/bs";

import { createEntry } from "@/components/about/_about.actions";
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
import { FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import { AboutEntryType } from "@/interfaces/_dataTypes";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import EntryForm from "../entry-form";
import { Entry_FormSchema } from "../entry-form/schema";

interface Props {
	className?: string;
	type: AboutEntryType;
	files?: FileListItem[] | null | undefined;
	tags: TagData[] | null | undefined;
}

const EntryCreate: React.FC<Props> = ({ className, type, files, tags }) => {
	const t = msgs("AboutCV_CreateEntry");
	const entryTypeLabel = (
		msgs("AboutCV_Form")("aboutEntry_type_list") as unknown as Record<string, string>
	)[type];

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

			const response = await createEntry(generateFormDataFromObject(data), [
				pathname,
				Route.public.ABOUT.uri,
			]);

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

	if (!tags) {
		return null;
	}

	return (
		<div className={className}>
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
				<DialogContent
					className="sm:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl"
					closeOnOverlayClick={false}
				>
					<DialogHeader className="-mt-2">
						<DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
						{t("dialog_description") && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: "new id" }),
								}}
							/>
						)}
					</DialogHeader>

					<EntryForm
						className="mt-0"
						entryType={type}
						files={files}
						submitting={submitting}
						tags={tags}
						onSubmit={handleCreateEntry}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default EntryCreate;
