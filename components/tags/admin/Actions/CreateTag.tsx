"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { msgs } from "@/messages";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";

import { TagType } from "@/interfaces/_common-data-types";

import { IconMap } from "@/interfaces/IconMap";

import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";

import TagForm from "../Form";

import { createTag } from "../../_tags.actions";

import { Tag_FormSchema } from "../Form/schema";

interface Props {
	className?: string;
	tagType: TagType;
	icons: IconMap;
}

const CreateTag: React.FC<Props> = ({ className, tagType, icons }) => {
	const t = msgs("Tags_Create");
	const tagTypeLabel = (msgs("Tags_Form")("tag_type_list") as unknown as Record<string, string>)[
		tagType
	];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353
	const pathname = usePathname();

	const handleCreateTag = async (data: Tag_FormSchema) => {
		setSubmitting(true);

		try {
			/**
			 * In case we were used <form action={addPage}> this conversion will not be needed,
			 * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
			 * form.action()... @see https://stackoverflow.com/a/40552372/6543935
			 */

			const response = await createTag(generateFormDataFromObject(data), [pathname]);

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
						className="pl-[0.75rem] pr-[0.7rem] rounded-lg icon_accent_secondary"
						height={26} // 36 // pl-[0.6rem] pr-[0.7rem]
						label={t("dialog_btn_add")}
						labelSubmitting={t("dialog_btn_add_submitting")}
						submitting={submitting}
						width={42} // 62
						widthOffset={24}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent className="ma:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl">
					<DialogHeader>
						<div className="flex flex-col gap-1">
							<DialogTitle>{t("dialog_title", { tagType: tagTypeLabel })}</DialogTitle>
							{t("dialog_description") && (
								<DialogDescription
									dangerouslySetInnerHTML={{
										__html: t("dialog_description", { id: "new id" }),
									}}
								/>
							)}
						</div>
					</DialogHeader>

					<TagForm
						className="mt-1"
						icons={icons}
						submitting={submitting}
						tagType={tagType}
						onSubmit={handleCreateTag}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CreateTag;
