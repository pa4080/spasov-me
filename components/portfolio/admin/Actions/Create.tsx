"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { createProject } from "@/components/portfolio/_portfolio.actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import { ProjectType } from "@/interfaces/_common-data-types";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";

import ProjectForm from "../Form";
import { Project_FormSchema } from "../Form/schema";

interface Props {
	className?: string;
	type: ProjectType;
	files?: FileListItem[] | null | undefined;
	tags: TagData[] | null | undefined;
}

const CreateProject: React.FC<Props> = ({ className, type, files, tags }) => {
	const t = msgs("Projects_Create");
	const projectTypeLabel = (
		msgs("Projects_Form")("project_type_list") as unknown as Record<string, string>
	)[type];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
	const pathname = usePathname();

	const handleCreateProject = async (data: Project_FormSchema) => {
		setSubmitting(true);

		try {
			/**
			 * In case we were used <form action={addPage}> this conversion will not be needed,
			 * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
			 * form.action()... @see https://stackoverflow.com/a/40552372/6543935
			 */

			const response = await createProject(generateFormDataFromObject(data), [
				pathname,
				Route.public.PORTFOLIO.uri,
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

	if (!tags) {
		return null;
	}

	return (
		<div className={className}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger disabled={submitting}>
					<ButtonIcon
						className="pl-[0.75rem] pr-[0.7rem] rounded-lg icon_accent_secondary"
						height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
						label={t("dialog_btn_add")}
						labelSubmitting={t("dialog_btn_add_submitting")}
						submitting={submitting}
						type="rectangle-history-circle-plus"
						width={42} // 62
						widthOffset={24}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent
					className="ma:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl"
					closeOnOverlayClick={false}
				>
					<DialogHeader>
						<DialogTitle>{t("dialog_title", { projectType: projectTypeLabel })}</DialogTitle>
						{t("dialog_description") && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: "new id" }),
								}}
							/>
						)}
					</DialogHeader>

					<ProjectForm
						className="mt-1"
						files={files}
						projectType={type}
						submitting={submitting}
						tags={tags}
						onSubmit={handleCreateProject}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CreateProject;
