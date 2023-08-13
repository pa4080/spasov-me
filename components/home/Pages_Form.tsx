"use client";

import React, { useEffect } from "react";
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
export const FormSchema = z.object({
	title: z.string().min(2, {
		message: "The page title must be at least 2 characters.",
	}),
	description: z.string().min(2, {
		message: "The description must be at least 20 characters.",
	}),
	uri: z
		.string()
		.min(2, {
			message:
				"The page URI must be at least 2 characters. It must start with latin lowercase letter and can contain numbers and dashes.",
		})
		.toLowerCase()
		.regex(/^[a-z][a-z0-9-]+$/)
		.trim(),
	image: z // https://stackoverflow.com/a/74028632/6543935
		.union([
			z.string().regex(/\.(png|jpg|jpeg|svg|webp)$/, {
				message: "The allowed formats are: png, jpg, jpeg, svg, webp.",
			}),
			z.string().length(0),
		])
		.optional()
		.transform((e) => (e === "" ? undefined : e)),
});

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
							<FormLabel>Page name</FormLabel>
							<FormControl>
								<Input placeholder="Page name" {...field} />
							</FormControl>
							<FormDescription>Enter the display name of the page.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Page description</FormLabel>
							<FormControl>
								<Input placeholder="Page description" {...field} />
							</FormControl>
							<FormDescription>Enter the display description of the page.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="uri"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Page slug</FormLabel>
							<FormControl>
								<Input placeholder="example-slug" {...field} />
							</FormControl>
							<FormDescription>
								Enter the URI (slug) of the page. No capital letters and spaces.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Page image</FormLabel>
							<FormControl>
								<Input {...field} accept="image/*" type="file" />
							</FormControl>
							<FormDescription>Upload an image of the page.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">{submitting ? "Submitting..." : "Submit"}</Button>
			</form>
		</Form>
	);
};

export default Pages_Form;
