"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { Paperclip, Tag } from "lucide-react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";

import Combobox from "@/components/fragments/Combobox";
import DatePicker from "@/components/fragments/DatePicker";
import DisplayFileImage from "@/components/fragments/DisplayFileImage";
import MultiSelectFromList from "@/components/fragments/MultiSelectFromList";
import SelectFromList from "@/components/fragments/SelectFromList";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileData, FileListItem } from "@/interfaces/File";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { ProjectType, projectTuple } from "@/interfaces/_common-data-types";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { Project_FormSchema, Project_FormSchemaGenerator } from "./schema";

interface Props {
	className?: string;
	formData?: ProjectData;
	projectType: ProjectType;
	onSubmit: (data: Project_FormSchema) => void;
	submitting?: boolean;
	files?: FileListItem[] | null;
	tags: TagData[] | null;
}

const ProjectForm: React.FC<Props> = ({
	className,
	projectType: entryType = projectTuple[0],
	formData,
	onSubmit,
	submitting,
	files,
	tags,
}) => {
	const t = msgs("Projects_Form");

	const FormSchema = Project_FormSchemaGenerator([
		t("schema_title"),
		t("schema_description"),
		t("schema_type"),
		t("schema_date"),
		t("schema_date"),
		t("schema_visibility"),
		t("schema_tags"),
		t("schema_gallery"),
	]);

	const { theme } = useTheme();

	const form = useForm<Project_FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			urlHome: "",
			urlRepo: "",
			dateFrom: undefined,
			dateTo: undefined,
			projectType: entryType,
			visibility: true,
			attachment: undefined,
			icon: undefined,
			tags: [],
			gallery: [],
		},
		values: formData
			? {
					...formData,
					tags: formData?.tags.map((tag) => tag._id) || [],
					gallery: formData?.gallery?.map((file) => file._id) || [],
				}
			: undefined,
	});

	return (
		<Form {...form}>
			<form
				className={`w-full space-y-4 relative ${className}`}
				onSubmit={form.handleSubmit(onSubmit)}
			>
				{/* Grid */}
				<div className="flex flex-col ma:grid ma:grid-cols-7 gap-3">
					{/* Left grid */}
					<div className="ma:col-span-2 flex flex-col gap-3">
						{/* Date From and Date To */}
						<div className="flex gap-3 ma:gap-1 w-full">
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

						{/* Project's homepage url */}
						<FormField
							control={form.control}
							name="urlHome"
							render={({ field }) => (
								<FormItem className="space-y-0">
									{t("urlHome_label") && <FormLabel>{t("urlHome_label")}</FormLabel>}
									<FormControl>
										<Input className="text-sm" placeholder={t("urlHome_placeholder")} {...field} />
									</FormControl>

									{form.formState.errors.urlHome ? (
										<FormMessage />
									) : (
										t("urlHome_description") && (
											<FormDescription>{t("urlHome_description")}</FormDescription>
										)
									)}
								</FormItem>
							)}
						/>

						{/* Project's repository url */}
						<FormField
							control={form.control}
							name="urlRepo"
							render={({ field }) => (
								<FormItem className="space-y-0">
									{t("urlRepo_label") && <FormLabel>{t("urlRepo_label")}</FormLabel>}
									<FormControl>
										<Input className="text-sm" placeholder={t("urlRepo_placeholder")} {...field} />
									</FormControl>

									{form.formState.errors.urlRepo ? (
										<FormMessage />
									) : (
										t("urlRepo_description") && (
											<FormDescription>{t("urlRepo_description")}</FormDescription>
										)
									)}
								</FormItem>
							)}
						/>

						{/* Is public | Project type */}
						<div className="flex gap-3 flex-col 3xs:flex-row ma:flex-col w-full">
							{/* Checkbox | Is public? */}
							<FormField
								control={form.control}
								name="visibility"
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								render={({ field }) => (
									<FormItem className="flex-1 rounded-md border space-y-0">
										<div className="flex items-center justify-between py-2 pl-4 pr-3">
											<div>
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

							{/* Project type ["employment", "education"] */}
							<SelectFromList
								className="flex-1"
								control={form.control}
								error={form.formState.errors.projectType}
								itemsList={projectTuple.map((item) => ({
									value: item,
									label: (t("project_type_list") as unknown as Record<string, string>)[item],
								}))}
								messages={{
									label: t("type_label"),
									description: t("type_description"),
									placeholder: t("type_placeholder"),
								}}
								name="projectType"
							/>
						</div>

						{/* Attachment (image, pdf) */}
						<div className="flex gap-1 w-full max-w-full items-center justify-center">
							<Combobox
								className="w-full"
								control={form.control}
								error={form.formState.errors.attachment}
								list={files ?? []}
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
							<DisplayFileImage
								className={`rounded-md object-cover w-10 h-10 min-w-10 border ${form.watch("attachment") ? "opacity-90" : "opacity-25"}`}
								file={
									{
										filename:
											files?.find((f) => f.value === form.watch("attachment"))?.label ??
											Route.assets.IMAGE_PLACEHOLDER,
										metadata: {
											html: {
												fileUri:
													files?.find((f) => f.value === form.watch("attachment"))?.sourceImage ??
													Route.assets.IMAGE_PLACEHOLDER,
											},
										},
									} as FileData
								}
								sizes={["40px", "40px"]}
							/>
						</div>

						{/* Icon (image, pdf) */}
						<div className="flex gap-1 w-full max-w-full items-center justify-center">
							<Combobox
								className="w-full"
								control={form.control}
								error={form.formState.errors.icon}
								list={files ?? []}
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
							<DisplayFileImage
								className={`rounded-md object-cover w-10 h-10 min-w-10 border ${form.watch("icon") ? "opacity-90" : "opacity-25"}`}
								file={
									{
										filename:
											files?.find((f) => f.value === form.watch("icon"))?.label ??
											Route.assets.IMAGE_PLACEHOLDER,
										metadata: {
											html: {
												fileUri:
													files?.find((f) => f.value === form.watch("icon"))?.sourceImage ??
													Route.assets.IMAGE_PLACEHOLDER,
											},
										},
									} as FileData
								}
								sizes={["40px", "40px"]}
							/>
						</div>
					</div>

					{/* Right grid */}
					<div className="ma:col-span-5 flex flex-col gap-3 h-full">
						{/* Title */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="space-y-0">
									{t("title_label") && <FormLabel>{t("title_label")}</FormLabel>}
									<FormControl>
										<Input className="text-lg" placeholder={t("title_placeholder")} {...field} />
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
									className="flex-grow h-96 ma:h-1"
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

					{/* Tags - full grid */}
					<MultiSelectFromList
						Icon={Tag}
						className="w-full ma:col-span-7"
						control={form.control}
						displayType="tag_icon"
						error={form.formState.errors.tags}
						itemsList={
							tags
								?.sort((a, b) =>
									a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
								)
								?.map((tag) => ({
									value: tag._id,
									label: tag.name,
									sourceImage: tag.icon,
									sourceDescription: tag.description,
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

					{/* Gallery - full grid */}
					<MultiSelectFromList
						Icon={Paperclip}
						className="w-full ma:col-span-7"
						control={form.control}
						displayType="gallery_image"
						error={form.formState.errors.gallery}
						itemsList={files ?? []}
						messages={{
							label: t("gallery_label"),
							description: t("gallery_description"),
							placeholder: t("gallery_search"),
							select: t("schema_gallery"),
							add: t("gallery_add"),
							notFound: t("gallery_searchNotFound"),
						}}
						name="gallery"
						selected={form.watch("gallery") || []}
						onSelect={(items: string[] | undefined) =>
							items
								? form.setValue("gallery", items, { shouldValidate: items.length > 0 })
								: form.resetField("gallery")
						}
					/>
				</div>

				{/* Submit button */}
				<Button disabled={submitting} type="submit">
					{submitting ? t("btn_submitting") : t("btn_submit")}
				</Button>
			</form>
		</Form>
	);
};

export default ProjectForm;
