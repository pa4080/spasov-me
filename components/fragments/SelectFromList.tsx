"use client";

import {
	Control,
	FieldError,
	FieldErrorsImpl,
	FieldValues,
	Merge,
	Path,
	PathValue,
} from "react-hook-form";

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

export interface Item<T> {
	value: PathValue<T, Path<T>>;
	label: string;
}

export type ItemList<T> = Item<T>[];

interface Props<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	itemsList: ItemList<T>;
	messages: {
		label?: string;
		description?: string;
		placeholder?: string;
	};
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
	className?: string;
}

export default function SelectFromList<T extends FieldValues>({
	control,
	name,
	messages,
	error,
	itemsList,
	className,
}: Props<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={`space-y-0 ${className}`}>
					{messages.label && <FormLabel>{messages.label}</FormLabel>}
					<Select defaultValue={field.value} onValueChange={field.onChange}>
						<FormControl>
							<SelectTrigger className="text-left">
								<SelectValue
									placeholder={
										itemsList?.find((item) => item?.value === field?.value)?.label ??
										messages.placeholder
									}
								/>
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{itemsList.map((item, index) => (
								<SelectItem
									key={index}
									defaultChecked={field.value === item.value}
									value={item.value}
								>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

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
