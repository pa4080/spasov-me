"use client";
import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { createFile } from "@/components/files/_files.actions";
import ButtonIcon from "@/components/fragments/ButtonIcon";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";

import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";

import FileForm from "../file-form";
import { File_FormSchema } from "../file-form/schema";

interface Props {
	className?: string;
}

const CreateFile: React.FC<Props> = ({ className }) => {
	const t = msgs("Files_Create");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
	const pathname = usePathname();

	const handleCreateFile = async (data: File_FormSchema) => {
		setSubmitting(true);

		try {
			const response = await createFile(generateFormDataFromObject(data), [pathname]);

			serverActionResponseToastAndLocationReload({
				trigger: !!response,
				msgSuccess: t("toast_success"),
				msgError: t("toast_error"),
				redirectTo: pathname,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
			setIsOpen(false);
		}
	};

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
					<DialogHeader>
						<DialogTitle>{t("dialog_title")}</DialogTitle>
						{t("dialog_description") && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: "new id" }),
								}}
							/>
						)}
					</DialogHeader>

					<FileForm
						className="mt-1"
						isContainerDialogOpen={isOpen}
						submitting={submitting}
						onSubmit={handleCreateFile}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CreateFile;
