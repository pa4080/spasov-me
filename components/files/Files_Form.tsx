"use client";

import React, { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import slugify from "slugify";

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

import { roundTo } from "@/lib/round";

import IconEmbedSvg from "../fragments/IconEmbedSvg";

// https://github.com/colinhacks/zod#nullable
// Here is applied a tricky solution to translate the messages,
// outside React  component on the client side...?
export const FormSchemaGenerator = (messages?: string[]) =>
	z.object({
		file: z.union([
			// z.instanceof(FileList, { message: messages?.shift() }), // This throws an error in the server's log
			// @see https://conform.guide/file-upload
			// @see https://github.com/colinhacks/zod/issues/387#issuecomment-1191390673 // This is the solution
			z.any().refine((files) => files?.length === 1, messages?.shift()),
			z.instanceof(File, {
				message: messages?.shift(),
			}),
		]),
		filename: z
			.string()
			.regex(/^[a-zA-Z][.a-zA-Z0-9-_]+$/, {
				message: messages?.shift(),
			})
			.regex(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx)$/, {
				message: messages?.shift(),
			}),
		description: z.string().optional(),
		/**
		 * Optional file with check
		 * @see https://stackoverflow.com/a/74028632/6543935
		 *
		 * image: z.union([
		 * 			z.string().regex(/\.(png|jpg|jpeg|svg|webp)$/, {
		 * 				message: messages?.shift(),
		 * 			}),
		 * 			z.string().length(0),
		 * 		])
		 * 		.optional()
		 * 		.transform((e) => (e === "" ? undefined : e)),
		 */
	});

export const Files_FormSchema = FormSchemaGenerator();
export type Files_FormSchema = z.infer<typeof Files_FormSchema>;

interface Props {
	className?: string;
	onSubmit: (data: Files_FormSchema) => void;
	submitting?: boolean;
	isContainerDialogOpen?: boolean;
	formData?: Files_FormSchema;
}

const Files_Form: React.FC<Props> = ({
	className,
	onSubmit,
	submitting = false,
	// isContainerDialogOpen = true,
	// formData,
}) => {
	const t = useTranslations("FilesFeed.Form");
	const locale = useLocale();
	const displayImageRef = useRef<HTMLImageElement>(null);
	const [fileToUpload, setFileToUpload] = useState<File | null>(null);

	const FormSchema = FormSchemaGenerator([
		t("schema.file"),
		t("schema.name"),
		t("fileInputDescription"),
		t("schema.description"),
	]);

	const form = useForm<Files_FormSchema>({
		resolver: zodResolver(FormSchema),
	});

	const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.item(0) ?? null;

		if (file) {
			const filename = slugify(
				file.name.replace(/[^\.a-zA-Z0-9_-]/g, "-").replace(/^[^a-zA-Z]/g, ""),
				{
					lower: false,
					remove: /[*+~()'"!:@]/g,
					locale: "en",
				}
			);

			if (!filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx)$/)) {
				form.setError("file", {
					type: "manual",
					message: t("fileInputDescription"),
				});

				return;
			} else {
				form.clearErrors("file");
			}

			if (filename.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
				displayImageRef.current?.setAttribute("src", URL.createObjectURL(file));
			} else if (filename.match(/\.(pdf|pptx|xlsx|docx)$/)) {
				displayImageRef.current?.setAttribute(
					"src",
					`/assets/images/mime-type-icons/${filename.split(".").pop()}.png`
				);
			}

			const modifiedDate = new Date(file.lastModified).toLocaleString(locale);
			const fileSizeKb = roundTo(file.size / 1000, 1);

			form.setValue("filename", filename);
			form.setValue("description", `${modifiedDate} ~${fileSizeKb}Kb`);
			setFileToUpload(file);
		}
	};

	const handleSubmit = async (data: Files_FormSchema) => {
		if (!fileToUpload) {
			form.setError("file", {
				type: "manual",
				message: t("schema.file"),
			});

			return;
		}

		data.file = fileToUpload;
		onSubmit(data);
	};

	return (
		<Form {...form}>
			<form
				className={cn("w-full space-y-6 relative", className)}
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				<FormItem>
					<FormLabel htmlFor="file-input">{t("fileInput")}</FormLabel>

					<FormControl>
						<div
							className={cn(
								"input_file_wrapper w-full cursor-pointer relative rounded-md",
								"border border-input bg-background text-md ring-offset-background text-mlt-dark-1 hover:outline-none hover:ring-2 hover:ring-mlt-blue-dark hover:ring-offset-2 disabled:cursor-not-allowed"
							)}
						>
							<div className="absolute left-0 top-0 w-full h-full flex justify-center items-center gap-1 -z-1">
								{fileToUpload ? (
									<IconEmbedSvg
										c1="mlt-blue-bright"
										c2=""
										height={32}
										op1="cc"
										op2="ff"
										type="cloud-check"
										width={60}
									/>
								) : (
									<IconEmbedSvg
										c1="mlt-blue-bright"
										c2=""
										height={32}
										op1="cc"
										op2="ff"
										type="cloud-arrow-up"
										width={60}
									/>
								)}
								<p
									className="max-w-[85%] text-mlt-gray-0 mr-3"
									style={{
										direction: "rtl",
										textAlign: "left",
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									{fileToUpload ? fileToUpload.name : t("fileInputChoiceFile")}
								</p>
							</div>
							<input
								id="file-input"
								{...form.register("file")}
								accept="*"
								className="z-10 h-12"
								type="file"
								onChange={handleInputFileChange}
							/>
						</div>
					</FormControl>

					<FormDescription>{t("fileInputDescription")}</FormDescription>

					{form.formState.errors.file && (
						<p className="text-sm font-medium text-destructive">
							{String(form.formState.errors.file.message)}
						</p>
					)}
				</FormItem>

				<FormField
					control={form.control}
					name="filename"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("fileName")}</FormLabel>
							<FormControl>
								<Input placeholder={t("fileNamePlaceholder")} {...field} />
							</FormControl>
							<FormDescription>{t("fileNameDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="mr-56">
							<FormLabel>{t("fileDescription")}</FormLabel>
							<FormControl>
								<Input placeholder={t("fileDescriptionPlaceholder")} {...field} />
							</FormControl>
							<FormDescription>{t("fileDescriptionDescription")}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">{submitting ? t("btn_submitting") : t("btn_submit")}</Button>
				<div className="absolute right-0 bottom-0 w-52 h-48 rounded-md overflow-hidden">
					{/* It is not possible to use next Image here, because we cannot modify its src property */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						ref={displayImageRef}
						alt="Display image before upload"
						className="object-cover w-full h-full rounded-md"
						height={192}
						src="/assets/images/image-placeholder.webp"
						width={208}
					/>
				</div>
			</form>
		</Form>
	);
};

export default Files_Form;
