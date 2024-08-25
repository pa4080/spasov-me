"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

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
import { useAppContext } from "@/contexts/AppContext";
import { LabEntryData } from "@/interfaces/LabEntry";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import { cn } from "@/lib/cn-utils";

import { deleteLabEntry } from "../../_lab.actions";

export interface Props {
	className?: string;
	labEntry: LabEntryData;
}

const DeleteLabEntry: React.FC<Props> = ({ className, labEntry }) => {
	const t = msgs("LabEntries_Delete");
	const entryTypeLabel = (
		msgs("LabEntries_Form")("lab_entry_type_list") as unknown as Record<string, string>
	)[labEntry.entryType];

	const { session } = useAppContext();
	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	if (!session) {
		return null;
	}

	const handleDeleteLabEntry = async () => {
		setSubmitting(true);

		try {
			const response = await deleteLabEntry(labEntry._id, [
				pathname,
				Route.public.LAB.uri,
				Route.admin.LAB,
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
				<AlertDialogTrigger onClick={() => setIsOpen(true)}>
					<IconEmbedSvg
						className={cn("grayscale-[100%] hover:grayscale-[0%] mt-[10px]", className)}
						className_Path1="fill-accent"
						className_Path2="fill-accent-secondary"
						height={21}
						type="trash"
						width={21}
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
									__html: t("dialog_description", { id: labEntry._id }),
								}}
							/>
						)}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={() => handleDeleteLabEntry()}
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

export default DeleteLabEntry;
