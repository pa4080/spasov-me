"use client";
import React, { useState } from "react";

import { usePathname } from "next/navigation";
import { BsSendCheck } from "react-icons/bs";

import ButtonIcon from "@/components/fragments/ButtonIcon";
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
import { toast } from "@/components/ui/use-toast";
import { TagType } from "@/interfaces/_dataTypes";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { deleteTag } from "../../_tags.actions";

interface Props {
	className?: string;
	tagType: TagType;
	tag_id: string;
}

const TagDelete: React.FC<Props> = ({ className, tagType, tag_id }) => {
	const t = msgs("TagsAdmin_DeleteTag");
	const tagTypeLabel = (
		msgs("TagsAdmin_Form")("tag_type_list") as unknown as Record<string, string>
	)[tagType];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleDeleteEntry = async () => {
		setSubmitting(true);

		try {
			const response = await deleteTag(tag_id, [pathname, Route.public.ABOUT.uri]);

			if (response) {
				toast({
					description: (
						<div className="flex flex-col items-center gap-2 justify-center w-full">
							<div className="flex items-center gap-2 justify-between">
								<span className="text-base">{t("toast_deleted")}</span>
								<span className="text-3xl">
									<BsSendCheck />
								</span>
							</div>
						</div>
					),
					variant: "destructive",
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
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogTrigger>
					<ButtonIcon
						className="pl-[2.6px] bg-transparent icon_accent_secondary"
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
						{showDescription && (
							<AlertDialogDescription
								className="hyphens-auto break-words"
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: tag_id }),
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

export default TagDelete;
