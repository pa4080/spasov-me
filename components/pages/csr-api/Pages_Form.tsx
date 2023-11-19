"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Check, ChevronsUpDown } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";

import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { msgs } from "@/messages";
import { cn } from "@/lib/cn-utils";
import { useAppContext } from "@/contexts/AppContext";
import { Switch } from "@/components/ui/switch";

// https://github.com/colinhacks/zod#nullable
// Here is applied a tricky solution to translate the messages,
// outside React  component on the client side...?
export const Pages_FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		title: z.string().min(2, {
			message: messages?.shift(),
		}),
		description: z.string().min(2, {
			message: messages?.shift(),
		}),
		uri: z
			.string()
			.min(2, {
				message: messages?.shift(),
			})
			.toLowerCase()
			.regex(/^[a-z][a-z0-9-]+$/)
			.trim(),
		image: z.string().optional(),
		visibility: z.boolean(),
	});

export const Pages_FormSchema = Pages_FormSchemaGenerator();
export type Pages_FormSchema = z.infer<typeof Pages_FormSchema>;

interface ImageFile {
	id: string;
	name: string;
}

interface Props {
	className?: string;
	onSubmit: (data: Pages_FormSchema) => void;
	submitting?: boolean;
	formData?: Pages_FormSchema;
}

const Pages_Form: React.FC<Props> = ({ className, onSubmit, submitting = false, formData }) => {
	const t = msgs("PagesFeed");
	const { files } = useAppContext();
	const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);

	const FormSchema = Pages_FormSchemaGenerator([
		t("formSchema_title"),
		t("formSchema_description"),
		t("formSchema_uri"),
		t("formSchema_image"),
	]);

	const form = useForm<Pages_FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			uri: "",
			image: "",
			visibility: false,
		},
	});

	useEffect(() => {
		console.log("formData", formData);

		if (formData) {
			form.reset({ ...formData });
		}
	}, [form, formData]);

	useEffect(() => {
		if (files.length > 0) {
			const filterImageFiles = files
				.filter((file) => file.filename.match(/\.(png|jpg|jpeg|svg|webp)$/))
				.map((file) => ({
					id: file._id.toString(),
					name: file.filename,
				}));

			setImageFiles(filterImageFiles);
		}
	}, [files]);

	return (
		<Form {...form}>
			<form className={cn("w-full space-y-6", className)} onSubmit={form.handleSubmit(onSubmit)}>
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
							<FormDescription>{t("form_pageTitleDescription")}</FormDescription>
							<FormMessage />
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
							<FormDescription>{t("form_pageDescriptionDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* URI (slug) */}
				<FormField
					control={form.control}
					name="uri"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("form_pageSlug")}</FormLabel>
							<FormControl>
								<Input placeholder={t("form_pageSlugPlaceholder")} {...field} />
							</FormControl>
							<FormDescription>{t("form_pageSlugDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Image */}
				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>{t("form_pageImage")}</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											className={cn(
												"w-full justify-between bg-primary text-sm",
												!field.value && "text-muted-foreground"
											)}
											role="combobox"
											variant="outline"
										>
											<div className="line-clamp-1 text-left">
												{field.value
													? files.find((file) => file._id.toString() === field.value)?.filename
													: t("form_pageImage_select")}
											</div>
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full max-w-full p-0 ">
									<Command>
										<CommandInput placeholder={t("form_pageImage_search")} />
										<CommandEmpty>{t("form_pageImage_searchNotFound")}</CommandEmpty>
										<CommandGroup>
											{imageFiles.map((image) => (
												<CommandItem
													key={image.id}
													value={image.id}
													onSelect={() => {
														form.setValue("image", image.id);
													}}
												>
													<PopoverClose className="w-full flex items-center justify-start">
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																image.id === field.value ? "opacity-100" : "opacity-0"
															)}
															strokeWidth={3}
														/>
														<div className="line-clamp-1 text-left">{image.name}</div>
													</PopoverClose>
												</CommandItem>
											))}

											<CommandItem
												value={undefined}
												onSelect={() => {
													form.setValue("image", undefined);
												}}
											>
												<PopoverClose className="w-full flex items-center justify-start">
													<Check
														className={cn(
															"mr-2 h-4 w-4",
															undefined === field.value ? "opacity-100" : "opacity-0"
														)}
														strokeWidth={3}
													/>

													<div className="line-clamp-1 text-left">
														{t("form_pageImage_selectNone")}
													</div>
												</PopoverClose>
											</CommandItem>
										</CommandGroup>
									</Command>
								</PopoverContent>
							</Popover>
							<FormDescription>{t("form_pageImageDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="visibility"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between">
							<div className="space-y-0.5">
								<FormLabel>{t("form_pageVisibility_title")}</FormLabel>
								<FormDescription>{t("form_pageVisibility_description")}</FormDescription>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange} />
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

export default Pages_Form;
