"use client";

import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { bg } from "date-fns/locale";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Control, FieldError, FieldValues, Path, PathValue } from "react-hook-form";

import { CalendarIcon } from "lucide-react";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Popover,
	//  PopoverClose,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn-utils";
import { Calendar } from "@/components/ui/calendar";

interface Props<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	messages: {
		label?: string;
		description?: string;
		placeholder?: string;
	};
	error?: FieldError | undefined;
}

export default function DatePicker<T extends FieldValues>({
	control,
	name,
	messages,
	error,
}: Props<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel>{messages.label}</FormLabel>
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									className={cn(
										"w-full justify-between bg-primary text-sm",
										!field.value && "text-muted-foreground"
									)}
									variant="outline"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{field.value ? (
										format(field.value, "P", { locale: bg })
									) : (
										<span>{messages.label}</span>
									)}
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-full max-w-full p-0 ">
							<Calendar
								initialFocus
								mode="single"
								selected={field.value}
								onSelect={field.onChange}
							/>
						</PopoverContent>
					</Popover>

					{error ? <FormMessage /> : <FormDescription>{messages.description}</FormDescription>}
				</FormItem>
			)}
		/>
	);
}
