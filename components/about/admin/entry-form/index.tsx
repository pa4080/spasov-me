"use client";

import React, { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Switch } from "@/components/ui/switch";

import { AboutEntryTuple } from "@/interfaces/AboutEntry";

import { Entry_FormSchema, Entry_FormSchemaGenerator } from "./schema";

import DatePicker from "./DatePicker";
import SelectFromList from "./SelectFromList";

interface Props {
	className?: string;
	onSubmit: (data: Entry_FormSchema) => void;
	submitting?: boolean;
	formData?: Entry_FormSchema;
	entryType?: typeof AboutEntryTuple & undefined;
}

const PagesForm: React.FC<Props> = ({
	className,
	onSubmit,
	submitting = false,
	entryType = AboutEntryTuple[0],
	formData,
}) => {
	const t = msgs("AboutCV_Form");

	const countryList = t("country_list") as unknown as string[];
	const cityList = t("city_list") as unknown as string[];

	const FormSchema = Entry_FormSchemaGenerator([
		t("schema_title"),
		t("schema_description"),
		t("schema_country"),
		t("schema_city"),
		t("schema_date"),
		t("schema_date"),
		t("schema_type"),
		t("schema_visibility"),
	]);

	const form = useForm<Entry_FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			country: "",
			city: "",
			dateFrom: undefined,
			dateTo: undefined,
			type: entryType,
			visibility: true,
		},
		values: formData,
	});

	//
	/**
	 * Generate "image files" list - this probably will be used later,
	 * If we decide to attach a file to each item.
	 * i.e.: Diploma or Certificate or something like that
	 *
	const { files } = useAppContext();

	const [imageFiles, setImageFiles] = useState<ComboBoxList<Entry_FormSchema>[]>([]);

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
	*/

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const subscription = form.watch((value, { name, type }) => {
			// if (name === "uri") {
			// 	const visibilityValue =
			// 		routesArr.find((route) => route.uri.slice(1) === value.uri)?.visible ?? false;

			// 	form.setValue("visibility", visibilityValue);
			// }

			// eslint-disable-next-line no-console
			console.log("value", value);
			// eslint-disable-next-line no-console
			console.log("name", name);
			// eslint-disable-next-line no-console
			console.log("type", type);
		});

		return () => subscription.unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch]);

	return (
		<Form {...form}>
			<form className={cn("w-full space-y-6", className)} onSubmit={form.handleSubmit(onSubmit)}>
				{/* Title */}
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("title_label")}</FormLabel>
							<FormControl>
								<Input placeholder={t("title_placeholder")} {...field} />
							</FormControl>

							{form.formState.errors.title ? (
								<FormMessage />
							) : (
								<FormDescription>{t("title_description")}</FormDescription>
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
							<FormLabel>{t("description_label")}</FormLabel>
							<FormControl>
								<Input placeholder={t("description_placeholder")} {...field} />
							</FormControl>

							{form.formState.errors.description ? (
								<FormMessage />
							) : (
								<FormDescription>{t("description_description")}</FormDescription>
							)}
						</FormItem>
					)}
				/>

				{/* Country */}
				<SelectFromList
					control={form.control}
					error={form.formState.errors.country}
					itemsList={countryList}
					messages={{
						label: t("country_label"),
						description: t("country_description"),
						placeholder: t("country_placeholder"),
					}}
					name="country"
				/>

				{/* City */}
				<SelectFromList
					control={form.control}
					error={form.formState.errors.city}
					itemsList={cityList}
					messages={{
						label: t("city_label"),
						description: t("city_description"),
						placeholder: t("city_placeholder"),
					}}
					name="city"
				/>

				{/* Date From */}
				<DatePicker
					control={form.control}
					error={form.formState.errors.dateFrom}
					messages={{
						label: t("dateFrom_label"),
					}}
					name="dateFrom"
				/>

				{/* Date To */}
				<DatePicker
					control={form.control}
					error={form.formState.errors.dateFrom}
					messages={{
						label: t("dateTo_label"),
					}}
					name="dateTo"
				/>

				{/* Checkbox */}
				<FormField
					control={form.control}
					name="visibility"
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between">
							<div className="space-y-0.5">
								<FormLabel>{t("visibility_title")}</FormLabel>
								<FormDescription>{t("visibility_description")}</FormDescription>
							</div>
							<FormControl>
								<Switch checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
						</FormItem>
					)}
				/>

				{/* City */}
				<SelectFromList
					control={form.control}
					error={form.formState.errors.type}
					itemsList={AboutEntryTuple}
					messages={{
						label: t("type_label"),
						description: t("type_description"),
						placeholder: t("type_placeholder"),
					}}
					name="type"
				/>

				<Button type="submit">{submitting ? t("btn_submitting") : t("btn_submit")}</Button>
			</form>
		</Form>
	);
};

export default PagesForm;
