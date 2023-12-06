"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";

import {
	Form,
	FormControl,
	// FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { msgs } from "@/messages";
import { cn } from "@/lib/cn-utils";
import { Switch } from "@/components/ui/switch";

import { entryTuple, EntryItem, countryTuple, cityTuple } from "@/interfaces/_dataTypes";

import { Textarea } from "@/components/ui/textarea";

import { Entry_FormSchema, Entry_FormSchemaGenerator } from "./schema";

import DatePicker from "./DatePicker";
import SelectFromList from "./SelectFromList";

interface Props {
	className?: string;
	onSubmit: (data: Entry_FormSchema) => void;
	submitting?: boolean;
	formData?: Entry_FormSchema;
	entryType?: EntryItem;
}

const PagesForm: React.FC<Props> = ({
	className,
	onSubmit,
	submitting = false,
	entryType = entryTuple[0],
	formData,
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

	/**
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const subscription = form.watch((value, { name, type }) => {
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
 */

	return (
		<Form {...form}>
			<form
				className={cn(
					"w-full space-y-6",
					"bg-card/[50%] md:bg-card/[25%] dark:bg-card/[50%] rounded-2xl p-6 md:p-8",
					className
				)}
				onSubmit={form.handleSubmit(onSubmit)}
			>
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
									// label: t("country_label"),
									// description: t("country_description"),
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
									// label: t("city_label"),
									// description: t("city_description"),
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
												{/* <FormDescription>{t("visibility_description")}</FormDescription> */}
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
								error={form.formState.errors.type}
								itemsList={entryTuple.map((item) => ({
									value: item,
									label: (t("entry_type_list") as unknown as Record<string, string>)[item],
								}))}
								messages={{
									// label: t("type_label"),
									// description: t("type_description"),
									placeholder: t("type_placeholder"),
								}}
								name="type"
							/>
						</div>
					</div>
					<div className="sm:col-span-5 flex flex-col gap-3 h-full">
						{/* Title */}
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem className="space-y-0">
									{/* <FormLabel>{t("title_label")}</FormLabel> */}
									<FormControl>
										<Input placeholder={t("title_placeholder")} {...field} />
									</FormControl>

									{form.formState.errors.title ? (
										<FormMessage />
									) : (
										<>{/* <FormDescription>{t("title_description")}</FormDescription> */}</>
									)}
								</FormItem>
							)}
						/>

						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="flex-grow space-y-0">
									{/* <FormLabel>{t("description_label")}</FormLabel> */}
									<FormControl>
										<Textarea
											className="resize-none overflow-x-hidden h-full py-1"
											placeholder={t("description_placeholder")}
											{...field}
										/>
									</FormControl>
									{form.formState.errors.description ? (
										<FormMessage />
									) : (
										<>{/* <FormDescription>{t("description_description")}</FormDescription> */}</>
									)}
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button type="submit">{submitting ? t("btn_submitting") : t("btn_submit")}</Button>
			</form>
		</Form>
	);
};

export default PagesForm;
