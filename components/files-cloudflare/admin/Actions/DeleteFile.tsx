"use client";
import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { deleteFile } from "@/components/files-cloudflare/_files.actions";
import ButtonIcon from "@/components/fragments/ButtonIcon";
import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { FileData } from "@/interfaces/File";
import { msgs } from "@/messages";

export interface Props {
	className?: string;
	file: FileData;
}

const DeleteFile: React.FC<Props> = ({ className, file }) => {
	const t = msgs("Files_Delete");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleDeleteEntry = async () => {
		setSubmitting(true);

		try {
			const response = await deleteFile(file._id, [pathname]);

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
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogTrigger>
					<ButtonIcon
						className="pl-[2.6px] bg-transparent icon_accent_secondary"
						disabled={
							(file.metadata.attachedTo && file.metadata.attachedTo?.length > 0) || submitting
						}
						height={22}
						type="trash"
						width={22}
						onClick={() => setIsOpen(true)}
					/>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-ring-secondary">{t("dialog_title")}</AlertDialogTitle>
						{t("dialog_description") && (
							<AlertDialogDescription
								className="hyphens-auto break-words"
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { filename: file.filename, id: file._id }),
								}}
							/>
						)}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={() => handleDeleteEntry()}
						>
							{submitting ? t("dialog_btn_delete_submitting") : t("dialog_btn_delete")}
						</AlertDialogAction>
						<AlertDialogCancel className={buttonVariants({ variant: "secondary" })}>
							{t("dialog_btn_cancel")}
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default DeleteFile;
