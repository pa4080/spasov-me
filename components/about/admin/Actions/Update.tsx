"use client";
import React, { useState } from "react";

import { usePathname } from "next/navigation";

import dynamic from "next/dynamic";

import { updateEntry } from "@/components/about/_about.actions";
import ButtonIcon from "@/components/fragments/ButtonIcon";
import Loading from "@/components/fragments/Loading";
import serverActionResponseToastAndLocationReload from "@/components/fragments/ServerActionResponseNotify";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import { generateFormDataFromObject } from "@/lib/gen-form-data-from-object";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { useAppContext } from "@/contexts/AppContext";

import { Entry_FormSchema } from "../Form/schema";

const AboutEntryForm = dynamic(() => import("../Form"), { ssr: false, loading: () => <Loading /> });

interface Props {
	className?: string;
	entry: AboutEntryData;
	files?: FileListItem[] | null | undefined;
	tags: TagData[] | null | undefined;
}

const UpdateAboutEntry: React.FC<Props> = ({ className, entry, files, tags }) => {
	const t = msgs("AboutEntries_Update");
	const entryTypeLabel = (
		msgs("AboutEntries_Form")("aboutEntry_type_list") as unknown as Record<string, string>
	)[entry.entryType];

	const { session } = useAppContext();
	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	if (!tags || !session) {
		return null;
	}

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
				Route.admin.FILES_MONGODB,
				Route.admin.FILES_CFR2,
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
						<DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
						{t("dialog_description") && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: entry._id }),
								}}
							/>
						)}
					</DialogHeader>

					<AboutEntryForm
						className={t("dialog_description") ? "mt-0" : "mt-1"}
						entryType={entry.entryType}
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

export default UpdateAboutEntry;
