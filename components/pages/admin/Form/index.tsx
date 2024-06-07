"use client";
import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { IconMap } from "@/interfaces/IconMap";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { FileData } from "@/interfaces/File";

import DisplayFileImage from "@/components/fragments/DisplayFileImage";

import DisplayIcon from "@/components/fragments/DisplayIcon";

import Loading from "@/components/fragments/Loading";
import { useAppContext } from "@/contexts/AppContext";
import Combobox from "../../../fragments/Combobox";
import { Pages_FormSchema, Pages_FormSchemaGenerator } from "./schema";

interface Props {
	className?: string;
	onSubmit: (data: Pages_FormSchema) => void;
	submitting?: boolean;
	formData?: Pages_FormSchema;
	icons: IconMap;
}

const PageForm: React.FC<Props> = ({
	className,
	onSubmit,
	submitting = false,
	formData,
	icons,
}) => {
	const t = msgs("PageCards_Form");
	const { fileList } = useAppContext();

	const FormSchema = Pages_FormSchemaGenerator([
		t("schema_title"),
		t("schema_description"),
		t("schema_uri"),
		t("schema_image"),
		t("schema_icon"),
	]);

	const form = useForm<Pages_FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			uri: "",
			attachment: "",
			visibility: false,
			icon: "",
		},
		values: formData,
	});

	// Manage "visibility" switch
	const publicRoutesArr = Object.keys(Route.public)
		.filter((key) => key !== "HOME")
		.map((key) => Route.public[key as keyof typeof Route.public]);

	const publicRoutesAsValueValueArr = publicRoutesArr.map((route) => ({
		value: route.uri.slice(1),
		label: route.uri.slice(1),
	}));

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const subscription = form.watch((value, { name, type }) => {
			if (name === "uri") {
				const visibilityValue =
					publicRoutesArr.find((route) => route.uri.slice(1) === value.uri)?.visible ?? false;

				form.setValue("visibility", visibilityValue);
			}
		});

		return () => subscription.unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch]);

	if (!fileList) return <Loading />;

	return (
		<Form {...form}>
			<form
				className={`w-full space-y-4 relative ${className}`}
				onSubmit={form.handleSubmit(onSubmit)}
			>
				{/* Title */}
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("form_pageTitle")}</FormLabel>
							<FormControl>
								<Input placeholder={t("form_pageTitlePlaceholder")} {...field} />
							</FormControl>

							{form.formState.errors.title ? (
								<FormMessage className="!mt-1" />
							) : (
								<FormDescription>{t("form_pageTitleDescription")}</FormDescription>
							)}
						</FormItem>
					)}
				/>

				{/* Description */}
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("form_pageDescription")}</FormLabel>
							<FormControl>
								<Input placeholder={t("form_pageDescriptionPlaceholder")} {...field} />
							</FormControl>

							{form.formState.errors.description ? (
								<FormMessage className="!mt-1" />
							) : (
								<FormDescription>{t("form_pageDescriptionDescription")}</FormDescription>
							)}
						</FormItem>
					)}
				/>

				{/* URI (slug) */}
				<Combobox
					control={form.control}
					error={form.formState.errors.uri}
					list={publicRoutesAsValueValueArr}
					messages={{
						label: t("form_pageUri_label"),
						description: t("form_pageUri_description"),
						placeholder: t("form_pageUri_placeholder"),
						pleaseSelect: t("form_pageUri_select"),
						notFound: t("form_pageUri_searchNotFound"),
						selectNone: t("form_pageUri_selectNone"),
					}}
					name="uri"
					setValue={form.setValue}
				/>

				{/* Attachment: Image */}
				<div className="flex gap-2 w-full max-w-full items-center justify-center">
					<Combobox
						className="w-full"
						control={form.control}
						error={form.formState.errors.attachment}
						list={fileList}
						messages={{
							label: t("form_pageAttachment_label"),
							description: t("form_pageAttachment_description"),
							placeholder: t("form_pageAttachment_search"),
							pleaseSelect: t("form_pageAttachment_select"),
							notFound: t("form_pageAttachment_searchNotFound"),
							selectNone: t("form_pageAttachment_selectNone"),
						}}
						name="attachment"
						setValue={form.setValue}
					/>
					<DisplayFileImage
						className={`rounded-md object-cover max-h-full w-10 h-10 min-w-10 border -mt-2 ${form.watch("attachment") ? "opacity-90" : "opacity-25"}`}
						file={
							{
								filename:
									fileList?.find((f) => f.value === form.watch("attachment"))?.label ??
									Route.assets.IMAGE_PLACEHOLDER,
								metadata: {
									html: {
										fileUri:
											fileList?.find((f) => f.value === form.watch("attachment"))?.sourceImage ??
											Route.assets.IMAGE_PLACEHOLDER,
									},
								},
							} as FileData
						}
						sizes={["90px", "90px"]}
					/>
				</div>

				{/* Icon */}
				<div className="sm:flex-[2] flex flex-row gap-2">
					<Combobox
						className="w-full"
						control={form.control}
						error={form.formState.errors.icon}
						list={Object.keys(icons).map((icon) => ({
							value: icon,
							label: icon,
						}))}
						messages={{
							label: t("icon_label"),
							description: t("icon_description"),
							placeholder: t("icon_search"),
							pleaseSelect: t("icon_select"),
							notFound: t("icon_searchNotFound"),
							selectNone: t("icon_selectNone"),
						}}
						name="icon"
						setValue={form.setValue}
					/>

					<div className="max-h-full h-full min-w-fit border rounded-md bg-primary flex items-center justify-center p-1">
						<DisplayIcon
							className="hover:bg-transparent dark:hover:bg-transparent"
							icon={icons[form.watch("icon") ?? "placeholder"]}
						/>
					</div>
				</div>

				{/* Checkbox */}
				<FormField
					control={form.control}
					name="visibility"
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between">
							<div className="space-y-0.5">
								<FormLabel>{t("form_pageVisibility_title")}</FormLabel>
								<FormDescription>{t("form_pageVisibility_description")}</FormDescription>
							</div>
							<FormControl>
								{/* <Switch checked={field.value} onCheckedChange={field.onChange} /> */}
								<Switch checked={field.value} />
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type="submit">
					{submitting ? t("form_btn_submitting") : t("form_btn_submit")}
				</Button>
			</form>
		</Form>
	);
};

export default PageForm;
