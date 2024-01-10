"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { BsSendCheck } from "react-icons/bs";

import { updateEntry } from "@/components/about/_about.actions";
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
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import { AboutEntryType } from "@/interfaces/_dataTypes";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import EntryForm from "./entry-form";
import { Entry_FormSchema } from "./entry-form/schema";

interface Props {
	className?: string;
	entry: AboutEntryData;
	type: AboutEntryType;
	files?: FileListItem[] | null | undefined;
	tags: TagData[] | null | undefined;
}

const EntryUpdate: React.FC<Props> = ({ className, type: entryType, entry, files, tags }) => {
	const t = msgs("AboutCV_UpdateEntry");
	const entryTypeLabel = (
		msgs("AboutCV_Form")("aboutEntry_type_list") as unknown as Record<string, string>
	)[entryType];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleUpdateEntry = async (data: Entry_FormSchema) => {
		setSubmitting(true);
		try {
			/**
			 * In case we were used <form action={addPage}> this conversion will not be needed,
			 * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
			 * form.action()... @see https://stackoverflow.com/a/40552372/6543935
			 */

			const response = await updateEntry(generateFormDataFromObject(data), entry._id, [
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

	const showDescription = t("dialog_description") && t("dialog_description") !== "null";

	if (!tags) {
		return null;
	}

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
						<DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
						{showDescription && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: entry._id }),
								}}
							/>
						)}
					</DialogHeader>

					<EntryForm
						className={showDescription ? "mt-4" : "mt-0"}
						entryType={entryType}
						files={files}
						formData={entry}
						submitting={submitting}
						tags={tags}
						onSubmit={handleUpdateEntry}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default EntryUpdate;
