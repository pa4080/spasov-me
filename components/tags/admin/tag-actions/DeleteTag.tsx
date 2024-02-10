"use client";
import React, { useState } from "react";

import { usePathname } from "next/navigation";

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
import { TagData } from "@/interfaces/Tag";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { deleteTag } from "../../_tags.actions";

interface Props {
	className?: string;
	tag: TagData;
}

const DeleteTag: React.FC<Props> = ({ className, tag }) => {
	const t = msgs("Tags_Delete");
	const tagTypeLabel = (msgs("Tags_Form")("tag_type_list") as unknown as Record<string, string>)[
		tag.tagType
	];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleDeleteEntry = async () => {
		setSubmitting(true);

		try {
			const response = await deleteTag(tag._id, [pathname, Route.public.ABOUT.uri]);

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
						disabled={(tag.attachedTo && tag.attachedTo?.length > 0) || submitting}
						height={18}
						type="trash"
						width={18}
						onClick={() => setIsOpen(true)}
					/>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-ring-secondary">
							{t("dialog_title", { tagType: tagTypeLabel })}
						</AlertDialogTitle>
						{t("dialog_description") && (
							<AlertDialogDescription
								className="hyphens-auto break-words"
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", {
										id: tag._id,
										name: tag.name,
										description: tag.description,
									}),
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

export default DeleteTag;
