"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FileListItem } from "@/interfaces/File";
import { PageData } from "@/interfaces/Page";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { updatePage } from "../../_pages.actions";
import PageForm from "../page-form";
import { Pages_FormSchema } from "../page-form/schema";

interface Props {
	className?: string;
	page: PageData;
	files?: FileListItem[] | null | undefined;
}

const UpdatePage: React.FC<Props> = ({ className, page, files }) => {
	const t = msgs("PageCards_UpdatePage");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
	const pathname = usePathname();

	const handleUpdatePage = async (data: Pages_FormSchema) => {
		setSubmitting(true);

		try {
			const response = await updatePage(generateFormDataFromObject(data), page._id, [
				pathname,
				Route.public.HOME.uri,
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
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger disabled={submitting}>
					<ButtonIcon
						className="pl-1 bg-transparent icon_accent_secondary"
						height={22}
						type="brush"
						width={22}
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
									__html: t("dialog_description", { id: page._id }),
								}}
							/>
						)}
					</DialogHeader>

					<PageForm
						className={t("dialog_description") ? "mt-0" : "mt-1"}
						files={files}
						formData={page}
						submitting={submitting}
						onSubmit={handleUpdatePage}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default UpdatePage;
