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
import { toast } from "@/components/ui/use-toast";
import { FileData } from "@/interfaces/File";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";

import { updateFile } from "../../_files.actions";
import FileForm from "../file-form";
import { File_FormSchema } from "../file-form/schema";

interface Props {
	className?: string;
	file: FileData;
}

const UpdateFile: React.FC<Props> = ({ className, file }) => {
	const t = msgs("FilesAdmin_UpdateFile");

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleUpdateFile = async (data: File_FormSchema) => {
		setSubmitting(true);

		try {
			// TODO: Revalidate "projects", "about", etc. when rhe relations are implemented
			const response = await updateFile(generateFormDataFromObject(data), file._id, [pathname]);

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
					<DialogHeader className="-mt-2">
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
						className={t("dialog_description") ? "mt-4" : "mt-0"}
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
