"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";

import {
	Form,
	FormControl,
	FormDescription,
	// FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { TagItem, tagTuple } from "@/interfaces/_dataTypes";
import { cn } from "@/lib/cn-utils";
import { msgs } from "@/messages";

import { IconMap } from "@/interfaces/IconMap";

import Combobox from "@/components/fragments/Combobox";

import SelectFromList from "../../../fragments/SelectFromList";
import { Tag_FormSchema, Tag_FormSchemaGenerator } from "./schema";

export type FileListItem = { value: string; label: string };

interface Props {
	className?: string;
	formData?: Tag_FormSchema;
	tagType: TagItem;
	onSubmit: (data: Tag_FormSchema) => void;
	submitting?: boolean;
	icons: IconMap;
}

const TagForm: React.FC<Props> = ({
	className,
	tagType = tagTuple[0],
	formData,
	onSubmit,
	submitting,
	icons,
}) => {
	const t = msgs("TagsAdmin_Form");

	const FormSchema = Tag_FormSchemaGenerator([
		t("schema_name_length"),
		t("schema_name_monolite"),
		t("schema_description"),
		t("schema_icon"),
		t("schema_type"),
	]);

	const form = useForm<Tag_FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			description: "",
			icon: undefined,
			tagType: tagType,
		},
		values: formData,
	});

	return (
		<Form {...form}>
			<form className={cn("w-full space-y-6", className)} onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col gap-3">
					{/* Name */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="space-y-0">
								{t("name_label") && <FormLabel>{t("name_label")}</FormLabel>}
								<FormControl>
									<Input placeholder={t("name_placeholder")} {...field} />
								</FormControl>

								{form.formState.errors.name ? (
									<FormMessage />
								) : (
									t("name_description") && (
										<FormDescription>{t("name_description")}</FormDescription>
									)
								)}
							</FormItem>
						)}
					/>

					{/* Description */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="space-y-0">
								{t("description_label") && <FormLabel>{t("description_label")}</FormLabel>}
								<FormControl>
									<Input placeholder={t("description_placeholder")} {...field} />
								</FormControl>

								{form.formState.errors.description ? (
									<FormMessage />
								) : (
									t("description_description") && (
										<FormDescription>{t("description_description")}</FormDescription>
									)
								)}
							</FormItem>
						)}
					/>

					{/* Icon */}
					<Combobox
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

					{/* Tag type ["technology", "skill"] */}
					<SelectFromList
						className="flex-1"
						control={form.control}
						error={form.formState.errors.tagType}
						itemsList={tagTuple.map((item) => ({
							value: item,
							label: (t("tag_type_list") as unknown as Record<string, string>)[item],
						}))}
						messages={{
							label: t("type_label"),
							description: t("type_description"),
							placeholder: t("type_placeholder"),
						}}
						name="tagType"
					/>
				</div>

				<Button disabled={submitting} type="submit">
					{submitting ? t("btn_submitting") : t("btn_submit")}
				</Button>
			</form>
		</Form>
	);
};

export default TagForm;
