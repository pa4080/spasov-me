"use client";
import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { deleteEntry } from "@/components/about/_about.actions";
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
import { AboutEntryType } from "@/interfaces/_common-data-types";
import { msgs } from "@/messages";
import { Route } from "@/routes";

export interface Props {
	className?: string;
	type: AboutEntryType;
	entry_id: string;
}

const DeleteAboutEntry: React.FC<Props> = ({ className, type, entry_id }) => {
	const t = msgs("AboutCV_DeleteEntry");
	const entryTypeLabel = (
		msgs("AboutCV_Form")("aboutEntry_type_list") as unknown as Record<string, string>
	)[type];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleDeleteEntry = async () => {
		setSubmitting(true);

		try {
			const response = await deleteEntry(entry_id, [
				pathname,
				Route.public.ABOUT.uri,
				Route.admin.FILES,
			]);

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
						height={22}
						type="trash"
						width={22}
						onClick={() => setIsOpen(true)}
					/>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-ring-secondary">
							{t("dialog_title", { entryType: entryTypeLabel })}
						</AlertDialogTitle>
						{t("dialog_description") && (
							<AlertDialogDescription
								className="hyphens-auto break-words"
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: entry_id }),
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

export default DeleteAboutEntry;
