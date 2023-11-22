"use client";

import React from "react";

import { Control, FieldValues, Path, PathValue, UseFormSetValue } from "react-hook-form";

import { Check, ChevronsUpDown } from "lucide-react";

import {
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

export interface ComboBoxList<T> {
	value: PathValue<T, Path<T>>;
	label: string;
}

interface Props<T extends FieldValues> {
	control: Control<T>;
	list: ComboBoxList<T>[];
	name: Path<T>;
	setValue: UseFormSetValue<T>;
}

export default function Combobox<T extends FieldValues>({
	control,
	list,
	name,
	setValue,
}: Props<T>) {
	const t = msgs("PagesFeed");

	return (
		<FormField
			control={control}
			name={name}
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
											? list.find((item) => item.value === field.value)?.label
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
									{list.map((item) => (
										<CommandItem
											key={item.value}
											value={item.value}
											onSelect={() => {
												setValue(name, item.value);
											}}
										>
											<PopoverClose className="w-full flex items-center justify-start">
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														item.value === field.value ? "opacity-100" : "opacity-0"
													)}
													strokeWidth={3}
												/>
												<div className="line-clamp-1 text-left">{item.label}</div>
											</PopoverClose>
										</CommandItem>
									))}

									<CommandItem
										value={undefined}
										onSelect={() => {
											setValue(name, undefined as PathValue<T, Path<T>>);
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

											<div className="line-clamp-1 text-left">{t("form_pageImage_selectNone")}</div>
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
	);
}