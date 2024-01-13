"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { BsSendCheck } from "react-icons/bs";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { msgs } from "@/messages";

import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";

import { toast } from "@/components/ui/use-toast";

import { createFile } from "../../_files.actions";
import FileForm from "../file-form";
import { File_FormSchema } from "../file-form/schema";

interface Props {
	className?: string;
	fileType: "common";
}

const FileCreate: React.FC<Props> = ({ className, fileType }) => {
	const t = msgs("AboutCV_CreateEntry");
	const entryTypeLabel = (
		msgs("AboutCV_Form")("aboutEntry_type_list") as unknown as Record<string, string>
	)[fileType];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
	const pathname = usePathname();

	const handleCreateFile = async (data: File_FormSchema) => {
		// setSubmitting(true);

		try {
			const response = await createFile(
				generateFormDataFromObject({ ...data, name: data.filename }),
				[pathname]
			);

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
						{showDescription && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: "new id" }),
								}}
							/>
						)}
					</DialogHeader>

					<FileForm
						isContainerDialogOpen={isOpen}
						submitting={submitting}
						onSubmit={handleCreateFile}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default FileCreate;
