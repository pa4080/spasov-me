"use client";

import React, { useState } from "react";

import { useAppContext } from "@/contexts/AppContext";

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
import { Route } from "@/routes";

import { FileDocument } from "@/interfaces/File";

import { msgs } from "@/messages";

import Files_Form from "./files-form";
import { Files_FormSchema } from "./files-form/schema";

interface Props {
	className?: string;
}

const FileCreate: React.FC<Props> = ({ className }) => {
	const t = msgs("FilesAdmin_Form_OLD");
	const { session, setFiles } = useAppContext();

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	const uploadFile = async (data: Files_FormSchema) => {
		setSubmitting(true);

		try {
			if (!session?.user.id || !data.file) {
				throw new Error("No user id or file");
			}

			const formData = new FormData();

			formData.append("file", data.file as File);
			formData.append("name", data.filename);
			formData.append("description", data.description || "");
			formData.append("user_id", session?.user.id);

			const response = await fetch(Route.api.FILES, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				const newFile: FileDocument = (await response.json()).data;

				// TODO: Here we waiting a while for the backend upload stream to finish
				// find a way to do this without waiting with timeout but with a promise
				setTimeout(
					() => {
						setFiles((prevFiles) => [newFile, ...prevFiles]);
					},
					newFile?.chunkSize / 100 || 500
				);

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(newFile, null, 2)}</pre>,
				});
			} else {
				const errors = (await response.json()).errors;

				toast({
					title: t("dialog_toast_response_title", { status: response.status }),
					description: <pre className="toast_pre_info">{JSON.stringify(errors, null, 2)}</pre>,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleUploadFile = (data: Files_FormSchema) => {
		const dataVisualRepresentation = {
			...data,
			file: {
				name: (data.file as File).name,
				size: (data.file as File).size,
				type: (data.file as File).type,
				lastModified: (data.file as File).lastModified,
			},
		};

		toast({
			title: t("dialog_toast_submit_title"),
			description: (
				<pre className="toast_pre_info">{JSON.stringify(dataVisualRepresentation, null, 2)}</pre>
			),
		}) && setIsOpen(false);

		uploadFile(data);
	};

	return (
		session?.user && (
			<div className={`w-full h-0 relative ${className}`}>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger disabled={submitting}>
						<ButtonIcon
							className="pl-[0.75rem] pr-[0.7rem] rounded-lg absolute -top-4 right-0 icon_accent_secondary"
							height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
							label={t("dialog_btn_label_upload")}
							labelSubmitting={t("dialog_btn_label_uploading")}
							submitting={submitting}
							width={42} // 62
							widthOffset={24}
							onClick={() => setIsOpen(true)}
						/>
					</DialogTrigger>
					<DialogContent closeOnOverlayClick={false}>
						<DialogHeader>
							<DialogTitle>{t("dialog_title_upload")}</DialogTitle>
							<DialogDescription>{t("dialog_description")}</DialogDescription>
						</DialogHeader>

						<Files_Form
							isContainerDialogOpen={isOpen}
							submitting={submitting}
							onSubmit={handleUploadFile}
						/>
					</DialogContent>
				</Dialog>
			</div>
		)
	);
};

export default FileCreate;
