"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { cn } from "@/lib/utils";

// https://github.com/colinhacks/zod#nullable
// Here is applied a tricky solution to translate the messages,
// outside React  component on the client side...?
export const FormSchemaGenerator = (messages?: string[]) =>
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
		image: z // https://stackoverflow.com/a/74028632/6543935
			.union([
				z.string().regex(/\.(png|jpg|jpeg|svg|webp)$/, {
					message: messages?.shift(),
				}),
				z.string().length(0),
			])
			.optional()
			.transform((e) => (e === "" ? undefined : e)),
	});

export const FormSchema = FormSchemaGenerator();

interface Props {
	className?: string;
	onSubmit: (data: z.infer<typeof FormSchema>) => void;
	submitting?: boolean;
	isContainerDialogOpen?: boolean;
}

const Pages_Form: React.FC<Props> = ({
	className,
	onSubmit,
	submitting = false,
	isContainerDialogOpen = true,
}) => {
	const t = useTranslations("PagesFeed.Form");
	const FormSchema = FormSchemaGenerator([
		t("schema.title"),
		t("schema.description"),
		t("schema.uri"),
		t("schema.image"),
	]);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	// Clear the image field if the dialog is closed,
	// Otherwise on the next open "it" will attempt to set
	// the image field programmatically, which is not allowed by the browser.
	useEffect(() => {
		!isContainerDialogOpen && form.getValues("image") && form.setValue("image", undefined);
	}, [form, isContainerDialogOpen]);

	return (
		<Form {...form}>
			<form className={cn("w-full space-y-6", className)} onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("pageTitle")}</FormLabel>
							<FormControl>
								<Input placeholder={t("pageTitlePlaceholder")} {...field} />
							</FormControl>
							<FormDescription>{t("pageTitleDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("pageDescription")}</FormLabel>
							<FormControl>
								<Input placeholder={t("pageDescriptionPlaceholder")} {...field} />
							</FormControl>
							<FormDescription>{t("pageDescriptionDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="uri"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("pageSlug")}</FormLabel>
							<FormControl>
								<Input placeholder={t("pageSlugPlaceholder")} {...field} />
							</FormControl>
							<FormDescription>{t("pageSlugDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("pageImage")}</FormLabel>
							<FormControl>
								<Input {...field} accept="image/*" type="file" />
							</FormControl>
							<FormDescription>{t("pageImageDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">{submitting ? t("trigger_submitting") : t("trigger_label")}</Button>
			</form>
		</Form>
	);
};

export default Pages_Form;
