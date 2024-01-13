"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { BsSendCheck } from "react-icons/bs";

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
import { toast } from "@/components/ui/use-toast";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";

import { TagType } from "@/interfaces/_dataTypes";

import { IconMap } from "@/interfaces/IconMap";

import TagForm from "../tag-form";

import { createTag } from "../../_tags.actions";

import { Tag_FormSchema } from "../tag-form/schema";

interface Props {
	className?: string;
	tagType: TagType;
	icons: IconMap;
}

const TagCreate: React.FC<Props> = ({ className, tagType, icons }) => {
	const t = msgs("TagsAdmin_CreateTag");
	const tagTypeLabel = (
		msgs("TagsAdmin_Form")("tag_type_list") as unknown as Record<string, string>
	)[tagType];

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

	const showDescription = t("dialog_description") && t("dialog_description") !== "null";

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
				<DialogContent className="sm:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl">
					<DialogHeader className="-mt-2">
						<DialogTitle>{t("dialog_title", { tagType: tagTypeLabel })}</DialogTitle>
						{showDescription && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: "new id" }),
								}}
							/>
						)}
					</DialogHeader>

					<TagForm
						className="mt-0"
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

export default TagCreate;
