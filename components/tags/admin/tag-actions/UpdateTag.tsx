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
import { IconMap } from "@/interfaces/IconMap";
import { TagData } from "@/interfaces/Tag";
import { TagType } from "@/interfaces/_dataTypes";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { updateTag } from "../../_tags.actions";
import TagForm from "../tag-form";
import { Tag_FormSchema } from "../tag-form/schema";

interface Props {
	className?: string;
	tag: TagData;
	tagType: TagType;
	icons: IconMap;
}

const UpdateTag: React.FC<Props> = ({ className, tagType, tag, icons }) => {
	const t = msgs("TagsAdmin_UpdateEntry");
	const tagTypeLabel = (
		msgs("TagsAdmin_Form")("tag_type_list") as unknown as Record<string, string>
	)[tagType];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleUpdateEntry = async (data: Tag_FormSchema) => {
		setSubmitting(true);
		try {
			/**
			 * In case we were used <form action={addPage}> this conversion will not be needed,
			 * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
			 * form.action()... @see https://stackoverflow.com/a/40552372/6543935
			 */

			const response = await updateTag(generateFormDataFromObject(data), tag._id, [
				pathname,
				Route.public.ABOUT.uri,
			]);

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
						height={18}
						// type="trash"
						type="brush"
						width={18}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent
					className="sm:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl"
					closeOnOverlayClick={false}
				>
					<DialogHeader>
						<DialogTitle>{t("dialog_title", { tagType: tagTypeLabel })}</DialogTitle>
						{t("dialog_description") && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: tag._id }),
								}}
							/>
						)}
					</DialogHeader>

					<TagForm
						className={t("dialog_description") ? "mt-0" : "mt-1"}
						formData={tag}
						icons={icons}
						submitting={submitting}
						tagType={tagType}
						onSubmit={handleUpdateEntry}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default UpdateTag;
