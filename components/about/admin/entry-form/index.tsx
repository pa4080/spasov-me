"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";

import Combobox from "@/components/fragments/Combobox";
import MultiSelectFromList from "@/components/fragments/MultiSelectFromList";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileListItem } from "@/interfaces/File";
import { TagListItem } from "@/interfaces/Tag";
import { AboutEntryType, aboutEntryTuple, cityTuple, countryTuple } from "@/interfaces/_dataTypes";
import { msgs } from "@/messages";

import DatePicker from "../../../fragments/DatePicker";
import SelectFromList from "../../../fragments/SelectFromList";
import { Entry_FormSchema, Entry_FormSchemaGenerator } from "./schema";

interface Props {
	className?: string;
	formData?: AboutEntryData;
	entryType: AboutEntryType; // entryType?: AboutEntryItem;
	onSubmit: (data: Entry_FormSchema) => void;
	submitting?: boolean;
	files?: FileListItem[] | null;
	tags: TagListItem[] | null;
}

const EntryForm: React.FC<Props> = ({
	className,
	entryType = aboutEntryTuple[0],
	formData,
	onSubmit,
	submitting,
	files,
	tags,
}) => {
	const t = msgs("AboutCV_Form");

	const FormSchema = Entry_FormSchemaGenerator([
		t("schema_title"),
		t("schema_description"),
		t("schema_country"),
		t("schema_city"),
		t("schema_date"),
		t("schema_date"),
		t("schema_type"),
		t("schema_visibility"),
		t("schema_attachment"),
		t("schema_tags"),
	]);

	const { theme } = useTheme();

	const form = useForm<Entry_FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			country: formData?.country ?? countryTuple[0],
			city: formData?.city ?? cityTuple[0],
			dateFrom: undefined,
			dateTo: undefined,
			entryType: entryType,
			visibility: true,
			attachment: undefined,
			tags: [],
		},
		values: formData
			? { ...formData, tags: formData?.tags.map((item) => item._id) || [] }
			: undefined,
	});

	return (
		<Form {...form}>
			<form className={`w-full space-y-6 ${className}`} onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex flex-col sm:grid sm:grid-cols-7 gap-3">
					<div className="sm:col-span-2 flex flex-col gap-3">
						<div className="flex gap-3 sm:flex-col w-full">
							{/* Country */}
							<SelectFromList
								className="flex-1"
								control={form.control}
								error={form.formState.errors.country}
								itemsList={countryTuple.map((item) => ({
									value: item,
									label: (t("country_list") as unknown as Record<string, string>)[item],
								}))}
								messages={{
									label: t("country_label"),
									description: t("country_description"),
									placeholder: t("country_placeholder"),
								}}
								name="country"
							/>

							{/* City */}
							<SelectFromList
								className="flex-1"
								control={form.control}
								error={form.formState.errors.city}
								itemsList={cityTuple.map((item) => ({
									value: item,
									label: (t("city_list") as unknown as Record<string, string>)[item],
								}))}
								messages={{
									label: t("city_label"),
									description: t("city_description"),
									placeholder: t("city_placeholder"),
								}}
								name="city"
							/>
						</div>

						<div className="flex gap-3 sm:gap-1 w-full">
							{/* Date From */}
							<DatePicker
								className="flex-1"
								control={form.control}
								error={form.formState.errors.dateFrom}
								messages={{
									placeholder: t("dateFrom_label"),
									button: t("date_button"),
								}}
								name="dateFrom"
							/>

							{/* Date To */}
							<DatePicker
								className="flex-1"
								control={form.control}
								error={form.formState.errors.dateFrom}
								messages={{
									placeholder: t("dateTo_label"),
									button: t("date_button"),
								}}
								name="dateTo"
							/>
						</div>

						<div className="flex gap-3 flex-col 3xs:flex-row sm:flex-col w-full">
							{/* Checkbox */}
							<FormField
								control={form.control}
								name="visibility"
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								render={({ field }) => (
									<FormItem className="flex-1 rounded-md border space-y-0">
										<div className="flex items-center justify-between py-2 pl-4 pr-3">
											<div className="">
												<FormLabel>{t("visibility_title")}</FormLabel>
												{t("visibility_description") && (
													<FormDescription>{t("visibility_description")}</FormDescription>
												)}
											</div>
											<FormControl>
												<Switch checked={field.value} onCheckedChange={field.onChange} />
											</FormControl>
										</div>
									</FormItem>
								)}
							/>

							{/* Entry type ["employment", "education"] */}
							<SelectFromList
								className="flex-1"
								control={form.control}
								error={form.formState.errors.entryType}
								itemsList={aboutEntryTuple.map((item) => ({
									value: item,
									label: (t("aboutEntry_type_list") as unknown as Record<string, string>)[item],
								}))}
								messages={{
									label: t("type_label"),
									description: t("type_description"),
									placeholder: t("type_placeholder"),
								}}
								name="entryType"
							/>
						</div>

						{/* Attachment (image, pdf) */}
						{files && (
							<Combobox
								control={form.control}
								error={form.formState.errors.attachment}
								list={files}
								messages={{
									label: t("attachment_label"),
									description: t("attachment_description"),
									placeholder: t("attachment_search"),
									pleaseSelect: t("attachment_select"),
									notFound: t("attachment_searchNotFound"),
									selectNone: t("attachment_selectNone"),
								}}
								name="attachment"
								setValue={form.setValue}
							/>
						)}
					</div>

					<div className="sm:col-span-5 flex flex-col gap-3 h-full">
						{/* Title */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="space-y-0">
									{t("title_label") && <FormLabel>{t("title_label")}</FormLabel>}
									<FormControl>
										<Input placeholder={t("title_placeholder")} {...field} />
									</FormControl>

									{form.formState.errors.title ? (
										<FormMessage />
									) : (
										t("title_description") && (
											<FormDescription>{t("title_description")}</FormDescription>
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
								<FormItem
									className="flex-grow h-96 sm:h-1"
									data-color-mode={theme === "dark" ? "dark" : "light" || "auto"}
								>
									{t("description_label") && <FormLabel>{t("description_label")}</FormLabel>}
									<FormControl>
										<MDEditor
											autoFocus
											enableScroll
											commands={[...commands.getCommands()]}
											height={form.formState.errors.description ? "calc(100% - 1.8em)" : "100%"}
											overflow={false}
											preview="edit"
											textareaProps={{
												spellCheck: true,
												placeholder: t("description_placeholder"),
												style: {
													overscrollBehavior: "none",
													display: "block",
													color: "inherit",
												},
											}}
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									{form.formState.errors.description ? (
										<FormMessage className="z-10 relative" />
									) : (
										t("description_description") && (
											<FormDescription>{t("description_description")}</FormDescription>
										)
									)}
								</FormItem>
							)}
						/>
					</div>

					{/* Tags */}
					<MultiSelectFromList
						className="w-full sm:col-span-7"
						control={form.control}
						error={form.formState.errors.tags}
						itemsList={
							tags?.map((tag) => ({
								value: tag._id,
								label: tag.name,
								// label: `${tag.name} [${tag.description}]`,
							})) ?? []
						}
						messages={{
							label: t("tags_label"),
							description: t("tags_description"),
							placeholder: t("tags_search"),
							select: t("schema_tags"),
							add: t("tags_add"),
							notFound: t("tags_searchNotFound"),
						}}
						name="tags"
						selected={form.watch("tags") || []}
						onSelect={(items: string[] | undefined) =>
							items
								? form.setValue("tags", items, { shouldValidate: items.length > 0 })
								: form.resetField("tags")
						}
					/>
				</div>

				<Button disabled={submitting} type="submit">
					{submitting ? t("btn_submitting") : t("btn_submit")}
				</Button>
			</form>
		</Form>
	);
};

export default EntryForm;
