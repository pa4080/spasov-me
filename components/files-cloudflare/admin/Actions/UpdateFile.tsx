"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FileData } from "@/interfaces/File";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";

import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";

import { updateFile } from "@/components/files-cloudflare/_files.actions";
import { Route } from "@/routes";

import { File_FormSchema } from "../Form/schema";
// import FileForm from "../Form";
const FileForm = dynamic(() => import("../Form"), { ssr: false });

interface Props {
	className?: string;
	file: FileData;
}

const UpdateFile: React.FC<Props> = ({ className, file }) => {
	const t = msgs("Files_Update");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleUpdateFile = async (data: File_FormSchema) => {
		setSubmitting(true);

		try {
			const response = await updateFile(generateFormDataFromObject(data), file.filename, file._id, [
				pathname,
				Route.admin.ABOUT,
				Route.admin.PORTFOLIO,
				Route.admin.PAGES,
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
					className="ma:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl"
					closeOnOverlayClick={false}
				>
					<DialogHeader>
						<DialogTitle>{t("dialog_title")}</DialogTitle>
						{t("dialog_description") && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { filename: file.filename, id: file._id }),
								}}
							/>
						)}
					</DialogHeader>

					<FileForm
						className={t("dialog_description") ? "mt-0" : "mt-1"}
						formData={file}
						isContainerDialogOpen={isOpen}
						submitting={submitting}
						onSubmit={handleUpdateFile}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default UpdateFile;
