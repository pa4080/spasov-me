"use client";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { bg } from "date-fns/locale";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Control, FieldError, FieldErrorsImpl, FieldValues, Merge, Path } from "react-hook-form";

import { CalendarIcon } from "lucide-react";

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { Input } from "../ui/input";

interface Props<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	messages?: {
		label?: string;
		description?: string;
		placeholder?: string;
		button?: string;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
	className?: string;
	dateFormat?: string;
}

export default function DatePicker<T extends FieldValues>({
	control,
	name,
	messages = { button: "OK" },
	error,
	className,
	dateFormat = "MM/yy",
}: Props<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={`flex flex-col space-y-0  ${className}`}>
					{messages.label && <FormLabel>{messages.label}</FormLabel>}
					<Popover>
						<PopoverTrigger asChild>
							<FormControl>
								<Button
									className={`w-full justify-center bg-primary text-sm px-1 gap-0 ${
										!field.value && "text-muted-foreground"
									}`}
									variant="outline"
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{field.value ? (
										format(field.value, dateFormat, { locale: bg })
									) : (
										<span>{messages.placeholder}</span>
									)}
								</Button>
							</FormControl>
						</PopoverTrigger>
						<PopoverContent className="w-full p-0 max-w-min">
							<div className="px-3 pt-3 pb-0 flex items-center justify-end gap-3 w-full">
								<Input
									autoFocus
									className="flex-shrink max-w-full"
									type="date"
									value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
									onChange={(e) => {
										const value = e.target.valueAsNumber;

										if (!value) {
											return;
										}

										field.onChange(new Date(value));
									}}
								/>
								{/* <Button className="text-sm" size="sm" type="submit" variant="outline"> */}
								<PopoverClose className="text-sm rounded-md h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
									{messages.button}
								</PopoverClose>
								{/* </Button> */}
							</div>
							<Calendar
								ISOWeek
								hideHead // This hides the days of the week
								initialFocus
								defaultMonth={field.value}
								mode="single"
								selected={field.value}
								onSelect={field.onChange}
							/>
						</PopoverContent>
					</Popover>

					{error ? (
						<FormMessage className="!mt-1" />
					) : (
						messages.description && <FormDescription>{messages.description}</FormDescription>
					)}
				</FormItem>
			)}
		/>
	);
}
