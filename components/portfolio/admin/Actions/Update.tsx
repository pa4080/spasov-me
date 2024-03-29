"use client";
import React, { useState } from "react";

import { usePathname } from "next/navigation";

import ButtonIcon, { ButtonIconProps } from "@/components/fragments/ButtonIcon";
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
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { useAppContext } from "@/contexts/AppContext";

import { IconEmbSvgPathType } from "@/components/fragments/IconEmbedSvg";

import { updateProject } from "../../_portfolio.actions";
import ProjectForm from "../Form";
import { Project_FormSchema } from "../Form/schema";

interface Props {
	className?: string;
	project: ProjectData;
	files?: FileListItem[] | null | undefined;
	tags?: TagData[] | null | undefined;
	dialogTrigger_buttonIconProps?: ButtonIconProps;
}

const UpdateProject: React.FC<Props> = ({
	className,
	project,
	files,
	tags,
	dialogTrigger_buttonIconProps,
}) => {
	const t = msgs("Projects_Update");
	const projectTypeLabel = (
		msgs("Projects_Form")("project_type_list") as unknown as Record<string, string>
	)[project.projectType];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const { session, tags: tagsContext, fileList: fileListContext } = useAppContext();

	const tagsInUse = tags ?? tagsContext;
	const filesInUse = files ?? fileListContext;

	const handleUpdateProject = async (data: Project_FormSchema) => {
		setSubmitting(true);
		try {
			/**
			 * In case we were used <form action={addPage}> this conversion will not be needed,
			 * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
			 * form.action()... @see https://stackoverflow.com/a/40552372/6543935
			 */

			const response = await updateProject(generateFormDataFromObject(data), project._id, [
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

	if (!tagsInUse || !session) {
		return null;
	}

	const buttonIconPropsFinal = {
		className: "pl-1 bg-transparent icon_accent_secondary",
		disabled: !session,
		height: 22,
		type: "brush" as IconEmbSvgPathType,
		width: 22,
		onClick: () => setIsOpen(true),
		...dialogTrigger_buttonIconProps,
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className={className} disabled={submitting}>
				<ButtonIcon {...buttonIconPropsFinal} />
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
								__html: t("dialog_description", { id: project._id }),
							}}
						/>
					)}
				</DialogHeader>

				<ProjectForm
					className={t("dialog_description") ? "mt-0" : "mt-1"}
					files={filesInUse}
					formData={project}
					projectType={project.projectType}
					submitting={submitting}
					tags={tagsInUse}
					onSubmit={handleUpdateProject}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default UpdateProject;
