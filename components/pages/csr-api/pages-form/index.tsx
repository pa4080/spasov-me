"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

import { Button } from "@/components/ui/button";
import { msgs } from "@/messages";
import { cn } from "@/lib/cn-utils";
import { useAppContext } from "@/contexts/AppContext";
import { Switch } from "@/components/ui/switch";

import { Route } from "@/routes";

import Combobox, { ComboBoxList } from "./Combobox";

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

interface Props {
	className?: string;
	onSubmit: (data: Pages_FormSchema) => void;
	submitting?: boolean;
	formData?: Pages_FormSchema;
}

const PagesForm: React.FC<Props> = ({ className, onSubmit, submitting = false, formData }) => {
	const t = msgs("PagesFeed");

	type tType = Parameters<typeof t>[0];

	const { files } = useAppContext();

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
		if (formData) {
			form.reset({ ...formData });
		}
	}, [form, formData]);

	// Generate "image files" list
	const [imageFiles, setImageFiles] = useState<ComboBoxList<Pages_FormSchema>[]>([]);

	useEffect(() => {
		if (files.length > 0) {
			const filterImageFiles = files
				.filter((file) => file.filename.match(/\.(png|jpg|jpeg|svg|webp)$/))
				.map((file) => ({
					value: file._id.toString(),
					label: file.filename,
				}));

			setImageFiles(filterImageFiles);
		}
	}, [files]);

	// Generate "visibility" switch
	const routeList = Object.keys(Route.public).map((key) => ({
		value: Route.public[key as keyof typeof Route.public].uri,
		label: t(key as tType),
	}));

	console.log(routeList);

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
				<Combobox control={form.control} list={imageFiles} name="image" setValue={form.setValue} />

				{/* Checkbox */}
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

export default PagesForm;
