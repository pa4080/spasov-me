"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useAppContext } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/use-toast";

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

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { Path } from "@/interfaces/Path";
import { preparePageObjectToFetch } from "@/interfaces/Page";

// https://github.com/colinhacks/zod#nullable
const FormSchema = z.object({
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
}

const AddPageForm: React.FC<Props> = ({ className }) => {
	const { session } = useAppContext();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	});

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false); // https://youtu.be/3ijyZllWBwU?t=353

	// Clear the image field if the dialog is closed,
	// Otherwise on the next open "it" will attempt to set
	// the image field programmatically, which is not allowed by the browser.
	useEffect(() => {
		!isOpen && form.getValues("image") && form.setValue("image", undefined);
	}, [form, isOpen]);

	const createPage = async (data: z.infer<typeof FormSchema>) => {
		setSubmitting(true);

		// if (post.aiCategory === AiCategories.IMAGE && !formDataToUpload) {
		// 	setErrors((prevErrors) => ({ ...prevErrors, image: { message: t("imageRequiredError") } }));
		// 	setSubmitting(false);

		// 	return;
		// } else if (post.aiCategory === AiCategories.IMAGE && formDataToUpload) {
		// 	setErrors((prevErrors) => clearSpecificError(prevErrors, "image"));
		// }

		// const image_id: string | null = await uploadOrReplaceImage({
		// 	formDataToUpload,
		// 	postImageFilename,
		// 	post,
		// });

		try {
			const response = await fetch(Path.api.PAGES, {
				method: "POST",
				body: preparePageObjectToFetch({
					data,
					user_id: session?.user.id, // can be skipped on PUT/Update
				}),
			});

			if (response.ok) {
				const newPage = (await response.json()).data;
				// setPages((prevPages) => [...prevPages, newPage]);

				toast({
					title: `The server response with status "${response.status}" and data:`,
					description: (
						<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
							{JSON.stringify(newPage, null, 2)}
						</pre>
					),
				}) && form.reset();
			} else {
				const errors = (await response.json()).errors;

				toast({
					title: `The server response with status "${response.status}" and data:`,
					description: (
						<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
							{JSON.stringify(errors, null, 2)}
						</pre>
					),
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		createPage(data);

		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 rounded-md bg-mlt-dark-1 p-4 max-w-full whitespace-pre-wrap break-words">
					{JSON.stringify(data, null, 2)}
				</pre>
			),
		}) && setIsOpen(false);
	};

	return (
		<>
			{session?.user && (
				<div className={cn("h-16 w-full flex items-end justify-end", className)}>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger>
							<div
								className={cn(
									"rounded-full bg-mlt-dark-4 hover:bg-mlt-gray-4 text-mlt-gray-4 hover:text-mlt-dark-3 transition-colors duration-200 py-1 px-4 md:py-2 md:px-6 font-Unicephalon tracking-widest text-sm md:text-md",
									""
								)}
							>
								{submitting ? "Submitting..." : "Add a page"}
							</div>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add a new page</DialogTitle>
								<DialogDescription>
									This must be a valid/existing public page, defined within the project. By adding
									it here it will be available as a card at the homepage.
								</DialogDescription>
							</DialogHeader>

							<Form {...form}>
								<form className="w-full space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
												<FormDescription>
													Enter the display description of the page.
												</FormDescription>
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
						</DialogContent>
					</Dialog>
				</div>
			)}
		</>
	);
};

export default AddPageForm;
