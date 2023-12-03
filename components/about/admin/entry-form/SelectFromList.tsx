"use client";

import React from "react";

import { Control, FieldError, FieldValues, Path, PathValue } from "react-hook-form";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export interface ItemsList<T> {
	value: PathValue<T, Path<T>>;
	label: string;
}

interface Props<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	itemsList: string[] | readonly string[];
	messages: {
		label?: string;
		description?: string;
		placeholder?: string;
	};
	error?: FieldError | undefined;
}

export default function SelectFromList<T extends FieldValues>({
	control,
	name,
	messages,
	error,
	itemsList,
}: Props<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{messages.label && <FormLabel>{messages.label}</FormLabel>}
					<Select defaultValue={field.value} onValueChange={field.onChange}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder={messages.placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{itemsList.map((item, index) => (
								<SelectItem key={index} value={item}>
									{`${item.slice(0, 1).toUpperCase()}${item.slice(1)}`}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{error ? <FormMessage /> : <FormDescription>{messages.description}</FormDescription>}
				</FormItem>
			)}
		/>
	);
}
