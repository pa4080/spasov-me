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
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { useAppContext } from "@/contexts/AppContext";
import { PostData } from "@/interfaces/Post";

import { deletePost } from "../../_blog.actions";

export interface Props {
	className?: string;
	post: PostData;
}

const DeletePost: React.FC<Props> = ({ className, post }) => {
	const t = msgs("Posts_Delete");
	const entryTypeLabel = (
		msgs("Posts_Form")("post_type_list") as unknown as Record<string, string>
	)[post.entryType];

	const { session } = useAppContext();
	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	if (!session) {
		return null;
	}

	const handleDeletePost = async () => {
		setSubmitting(true);

		try {
			const response = await deletePost(post._id, [
				pathname,
				Route.public.PORTFOLIO.uri,
				Route.admin.FILES_MONGODB,
				Route.admin.FILES_CFR2,
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
									__html: t("dialog_description", { id: post._id }),
								}}
							/>
						)}
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={() => handleDeletePost()}
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

export default DeletePost;
