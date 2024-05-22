"use client";
import React, { useState } from "react";

import { usePathname } from "next/navigation";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { IconMap } from "@/interfaces/IconMap";
import { TagData } from "@/interfaces/Tag";
import { TagType } from "@/interfaces/_common-data-types";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";

import { updateTag } from "../../_tags.actions";
import TagForm from "../Form";
import { Tag_FormSchema } from "../Form/schema";

interface Props {
	className?: string;
	tag: TagData;
	tagType: TagType;
	icons: IconMap;
}

const UpdateTag: React.FC<Props> = ({ className, tagType, tag, icons }) => {
	const t = msgs("Tags_Update");
	const tagTypeLabel = (msgs("Tags_Form")("tag_type_list") as unknown as Record<string, string>)[
		tagType
	];

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
						height={18}
						// type="trash"
						type="brush"
						width={18}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent
					className="ma:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl"
					closeOnOverlayClick={false}
				>
					<DialogHeader>
						<div className="flex flex-col gap-1">
							<DialogTitle>{t("dialog_title", { tagType: tagTypeLabel })}</DialogTitle>
							{t("dialog_description") && (
								<DialogDescription
									dangerouslySetInnerHTML={{
										__html: t("dialog_description", { id: tag._id }),
									}}
								/>
							)}
						</div>
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
